import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({
    secret: process.env.JWT_SERCRET_KEY,
    global: true,
    signOptions: {expiresIn: '2 days'}
  })],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
 