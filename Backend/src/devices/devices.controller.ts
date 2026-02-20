import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { CreateDeviceDTO, DeviceAdafruitDto } from './dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @UseGuards(AuthGuard)
  @Post('sendData')
  async sendData(@Body() device : DeviceAdafruitDto) {
    return this.devicesService.sendData(device);
  }

  @UseGuards(AuthGuard)
  @Post('addDevice')
  async addDevice(@Body() device: CreateDeviceDTO) {
    return this.devicesService.addDevice(device);
  }

}
