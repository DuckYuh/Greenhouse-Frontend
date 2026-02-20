import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException, OnModuleDestroy } from '@nestjs/common';
import * as mqtt from 'mqtt';
import { Subject } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MqttService implements OnModuleDestroy {
	private client: mqtt.MqttClient;
	private eventSubject = new Subject<any>();

	constructor(private readonly prisma: PrismaService
	) {
		this.client = mqtt.connect('mqtts://io.adafruit.com', {
			port: Number(process.env.MQTT_PORT),
			username: process.env.MQTT_USERNAME,
			password: process.env.MQTT_PASSWORD,
		});

		this.client.on('connect', () => {
			console.log('Connected to Adafruit IO MQTT');
		});

		this.client.on('error', (err) => {
			console.error('MQTT Error:', err);
		});

		// Listen to device
		this.client.on('message', async (topic, message) => {
			const data = Number(message.toString());
			const device = await this.getDevice(topic)
			// Save record to database
			try {
				const record = await this.prisma.record.create({
					data: {
						value: data,
						dateCreated: new Date(),
						device: {
							connect: { ID: device.ID }
						}
					}
				})
			} catch (err) {
				console.error(err);
				throw new InternalServerErrorException("An error occurred! Please try again.");
			}
			if (device.maxValue && device.maxValue < data) {
				this.eventSubject.next({ device });
			} 			
		});
	}

	async sendDataToAdafruit(topic: string, value: number) {
		this.client.publish(topic, `${value}`, (err) => {
			if (err) {
				console.error('Error publishing to MQTT:', err);
			} else {
				console.log(`Published to ${topic}: ${value}`);
			}
		});
	}

	public subscribeToDeviceData(topic: string) {
		this.client.subscribe(topic, (err) => {
			if (err) {
				console.error('Error subscribing:', err);
			} else {
				console.log(`Subscribed to ${topic}`);
			}
		});
	}

	onModuleDestroy() {
		this.client.end();
	}
	
	getEvents() {
		return this.eventSubject.asObservable();
	}

	async getDevice(topic: string) {
        const device = await this.prisma.device.findUnique({
            where: { topic: topic }
        });
        if (!device) {
            throw new NotFoundException("Topic doesn't exist");
        }
        return device
    }
}
