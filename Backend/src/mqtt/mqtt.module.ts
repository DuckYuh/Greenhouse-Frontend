import { Global, Module } from '@nestjs/common';
import { MqttService } from './mqtt.service';
import { DevicesModule } from 'src/devices/devices.module';

@Global()
@Module({
  imports: [DevicesModule],
  providers: [MqttService],
  exports: [MqttService],
})

export class MqttModule {}
