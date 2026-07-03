// src/app.module.ts
import { Module, NestModule, MiddlewareConsumer, Logger, OnApplicationShutdown } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // หัวข้อ 2.10: นำเข้า ConfigModule
import { TasksModule } from '@modules/tasks/tasks.module';
import { UsersModule } from '@modules/users/users.module';
import { PrismaModule } from '@core/prisma/prisma.module';
import { AuthModule } from '@modules/auth/auth.module';
import { AllExceptionsFilter } from '@core/common/filters/all-exceptions.filter';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BullModule } from '@nestjs/bullmq';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { NotificationsModule } from '@background/notifications/notifications.module';
import { MailQueueModule } from '@background/mail-queue/mail-queue.module';
import { SecurityModule } from '@core/security/security.module';
import { HttpClientModule } from '@core/http-client/http-client.module';
import { StorageModule } from '@core/storage/storage.module';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { HealthModule } from '@core/health/health.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    // หัวข้อ 2.10 Config & Environment Variable: ใช้โหลดตัวแปรจากไฟล์ .env
    ConfigModule.forRoot({ isGlobal: true }),
    
    // Rate Limiting (ป้องกันคนยิง API รัวๆ) - จำกัด x ครั้งต่อ y วินาทีต่อ 1 IP
    ThrottlerModule.forRoot([{
      ttl: parseInt(process.env.THROTTLE_TTL_MS || '60000', 10),
      limit: parseInt(process.env.THROTTLE_LIMIT || '100', 10),
    }]),

    // ระบบ Logging ขั้นสูงด้วย Pino (Structured JSON Log)
    PinoLoggerModule.forRoot({
      pinoHttp: {
        level: process.env.LOG_LEVEL || 'info',
        transport: process.env.NODE_ENV !== 'production' 
          ? { target: 'pino-pretty', options: { singleLine: true } }
          : undefined,
      },
    }),

    // ระบบ Metrics เพื่อให้ Prometheus เข้ามาดึงข้อมูลไปแสดงใน Grafana ได้
    PrometheusModule.register({
      path: '/metrics',
      defaultMetrics: {
        enabled: true,
      },
    }),

    // หัวข้อ 3.3 Event-Driven: เปิดใช้งานระบบ Event 
    EventEmitterModule.forRoot(),
    // หัวข้อ 3.4 Queue & Redis: ตั้งค่าเชื่อมต่อ Redis สำหรับใช้งาน BullMQ
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
        db: 1, // <--- บอกให้ระบบย้ายไปใช้ Logical Database ที่ 1 (db1)
      },
    }),
    // หัวข้อ 3.5 Caching - Redis: ตั้งค่าระบบ Cache ให้ทำงานร่วมกับ Redis
    CacheModule.registerAsync({
      isGlobal: true, // เปิดให้ใช้ได้ทั้งแอป
      useFactory: async () => ({
        store: await redisStore({
          socket: {
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379', 10),
          },
          ttl: parseInt(process.env.CACHE_TTL_MS || '60000', 10),
        }),
      }),
    }),
    TasksModule, 
    UsersModule,
    SecurityModule,
    HttpClientModule,
    StorageModule,
    PrismaModule, // นำแผนก Tasks เข้ามาเชื่อมต่อ (หัวข้อ 1.3)
    AuthModule, 
    NotificationsModule, 
    MailQueueModule,
    HealthModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule, OnApplicationShutdown {
  private readonly appLogger = new Logger('GracefulShutdown');
  // ตั้งค่า Middleware (หัวข้อ 1.10)
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply((req, res, next) => {
        // คอมเมนต์โค้ดส่วนนี้ออกเพื่อไม่ให้รก Console เวลายิง API บ่อยๆ
        // const logger = new Logger('HTTP');
        // logger.log(`มีคนเรียก URL: ${req.method} ${req.url}`);
        next(); // ต้องสั่ง next() เสมอ ไม่งั้น Request จะค้าง
      })
      .forRoutes('*'); // ทำงานทุกเส้นทาง
  }

  beforeApplicationShutdown(signal?: string) {
    this.appLogger.warn(`Received signal ${signal}. Starting Graceful Shutdown...`);
  }

  onApplicationShutdown(signal?: string) {
    this.appLogger.log(`Graceful Shutdown completed (Signal: ${signal}). Application terminated safely.`);
  }
}