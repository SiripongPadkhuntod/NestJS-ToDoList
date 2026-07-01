// src/app.module.ts
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config'; // หัวข้อ 2.10: นำเข้า ConfigModule
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BullModule } from '@nestjs/bullmq';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { NotificationsModule } from './notifications/notifications.module';
import { MailQueueModule } from './mail-queue/mail-queue.module';

@Module({
  imports: [
    // หัวข้อ 2.10 Config & Environment Variable: ใช้โหลดตัวแปรจากไฟล์ .env
    ConfigModule.forRoot({ isGlobal: true }),
    // หัวข้อ 3.3 Event-Driven: เปิดใช้งานระบบ Event 
    EventEmitterModule.forRoot(),
    // หัวข้อ 3.4 Queue & Redis: ตั้งค่าเชื่อมต่อ Redis สำหรับใช้งาน BullMQ
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    // หัวข้อ 3.5 Caching - Redis: ตั้งค่าระบบ Cache ให้ทำงานร่วมกับ Redis
    CacheModule.registerAsync({
      isGlobal: true, // เปิดให้ใช้ได้ทั้งแอป
      useFactory: async () => ({
        store: await redisStore({
          socket: {
            host: 'localhost',
            port: 6379,
          },
          ttl: 60000, // แคชไว้ 1 นาที (60 วินาที)
        }),
      }),
    }),
    TasksModule, 
    UsersModule, 
    PrismaModule, // นำแผนก Tasks เข้ามาเชื่อมต่อ (หัวข้อ 1.3)
    AuthModule, 
    NotificationsModule, 
    MailQueueModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule implements NestModule {
  // ตั้งค่า Middleware (หัวข้อ 1.10)
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply((req, res, next) => {
        console.log(`[Middleware] มีคนเรียก URL: ${req.method} ${req.url}`);
        next(); // ต้องสั่ง next() เสมอ ไม่งั้น Request จะค้าง
      })
      .forRoutes('*'); // ทำงานทุกเส้นทาง
  }
}