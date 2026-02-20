import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateDeviceDTO, DeviceAdafruitDto } from './dto';
import { MqttService } from 'src/mqtt/mqtt.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class DevicesService {
    constructor(private readonly mqttService: MqttService,
        private readonly prisma: PrismaService
    ) {
        this.getAllDevices();
    }

    async sendData(devicesDto: DeviceAdafruitDto) {
        await this.getDevice(devicesDto.topic)
        await this.mqttService.sendDataToAdafruit(devicesDto.topic, devicesDto.value);
        return { message: 'Data sent to Adafruit IO!' };
    }

    async addDevice(deviceDto: CreateDeviceDTO) {
        try {
            const device = await this.prisma.device.create({
                data: {
                    topic: deviceDto.topic,
                    type: deviceDto.type,
                    maxValue: deviceDto.maxValue
                }
            });
            this.mqttService.subscribeToDeviceData(device.topic);
            return device;
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ConflictException('Topic has been used');
                }
            }
            console.error(error);
            throw new InternalServerErrorException("An error occurred! Please try again.");
        }
    }

    async getAllDevices() {
        const devices = await this.prisma.device.findMany({
            select: {
                topic: true
            }
        });
        for (const device of devices) {
            this.mqttService.subscribeToDeviceData(device.topic);
        }
    }

    async getDevice(topic: string) {
        const device = await this.prisma.device.findUnique({
            where: { topic: topic }
        });
        if (!device) {
            throw new NotFoundException("Topic doesn't exist");
        }
    }
}
