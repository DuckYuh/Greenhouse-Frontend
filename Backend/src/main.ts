import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const httpApp = await NestFactory.create(AppModule);

  httpApp.enableCors({
    origin: 'http://localhost:5173', // Thay bằng domain frontend của bạn nếu khác
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Cho phép gửi cookie hoặc token khi cần
  });

  await httpApp.listen(process.env.PORT || 8080);
}

bootstrap();
