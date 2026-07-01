import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable API Versioning (e.g., /v1/...)
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Enable graceful shutdown
  app.enableShutdownHooks();

  // เปิดใช้งาน Pipe เพื่อตรวจจับข้อมูล DTO ที่ผิดพลาด
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // ตัดข้อมูลขยะที่ไม่ได้ระบุใน DTO ทิ้งอัตโนมัติ
  }));

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
