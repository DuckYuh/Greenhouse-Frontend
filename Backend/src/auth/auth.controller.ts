import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  signin(@Body() authDto : AuthDto) {
    return this.authService.signin(authDto)
  }

  @Post('signup')
  signup(@Body() authDto : AuthDto) {
    return this.authService.signup(authDto)
  }
  
  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return req.user
  }
}
