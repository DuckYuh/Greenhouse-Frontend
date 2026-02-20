import { Controller, Get, Sse, MessageEvent } from '@nestjs/common';
import { MqttService } from 'src/mqtt/mqtt.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Controller('sse')
export class SseController {
    constructor(private readonly mqttService: MqttService) {}

    @Get()
    @Sse()
    sendEvents(): Observable<MessageEvent> { 
        return this.mqttService.getEvents().pipe(
            map((data) => ({
                data: JSON.stringify(data)
            }))
        );
    }
}
