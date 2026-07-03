import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, VersioningType, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { TransformInterceptor } from '@core/common/interceptors/transform.interceptor';
import { Logger } from 'nestjs-pino';

describe('App & Health E2E', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    // 1. จำลองการ Boot แอปพลิเคชัน (คล้ายๆ ใน main.ts)
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // 2. ตั้งค่าทุกอย่างให้เหมือน Production จริงเป๊ะๆ
    app.useLogger(app.get(Logger));
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
    });
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.useGlobalInterceptors(new TransformInterceptor());

    await app.init();
  });

  afterAll(async () => {
    await app.close(); // ปิด Connection Database & Redis ให้เรียบร้อย
  });

  // --- เริ่มต้นการ Test --- //

  it('GET /v1/health - ระบบต้องมีชีวิตอยู่ (Status 200)', () => {
    // เราใช้ supertest จำลองการยิง HTTP Request
    return request(app.getHttpServer())
      .get('/v1/health')
      .expect(200) // คาดหวังว่าต้องตอบ 200 OK
      .expect((res) => {
        // คาดหวังว่า Response Body ต้องมีคำว่า ok (ตามรูปแบบของ Terminus)
        // กรณีถ้า TransformInterceptor ทำงาน มันจะอยู่ใน .data แต่ถ้าไม่ มันจะอยู่ชั้นนอกสุด
        const payload = res.body.data || res.body; 
        expect(payload.status).toBe('ok');
        expect(payload.info.database.status).toBe('up');
      });
  });

  it('GET /v1/invalid-route - ระบบดักจับ URL ผิดและพ่น 404', () => {
    return request(app.getHttpServer())
      .get('/v1/not-found-url-xxx')
      .expect(404);
  });
});
