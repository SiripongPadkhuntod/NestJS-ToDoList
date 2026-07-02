import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from '@core/common/filters/all-exceptions.filter';
import { TransformInterceptor } from '@core/common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable API Versioning (e.g., /v1/...)
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Enable CORS
  const corsOrigins = process.env.CORS_ORIGINS 
    ? process.env.CORS_ORIGINS.split(',') 
    : '*';
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  // Enable graceful shutdown
  app.enableShutdownHooks();

  // เปิดใช้งาน Pipe เพื่อตรวจจับข้อมูล DTO ที่ผิดพลาด
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // ตัดข้อมูลขยะที่ไม่ได้ระบุใน DTO ทิ้งอัตโนมัติ
  }));

  // หัวข้อ 3.1: เปิดใช้งาน Interceptor สำหรับจัดรูปแบบ Response ให้เหมือนกันทั้งแอป
  app.useGlobalInterceptors(new TransformInterceptor());

  // Swagger config
  const config = new DocumentBuilder()
    .setTitle('PRJ E-Procurement API')
    .setVersion('1.0')
    .addBearerAuth()
    .build(); 
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
