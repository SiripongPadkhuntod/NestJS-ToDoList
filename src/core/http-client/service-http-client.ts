import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import CircuitBreaker from 'opossum';

@Injectable()
export class ServiceHttpClient {
  private readonly logger = new Logger(ServiceHttpClient.name);
  private breaker: any;

  constructor(private readonly httpService: HttpService) {
    // 1. สร้างฟังก์ชันสำหรับยิง API ที่จะถูกครอบด้วย Circuit Breaker
    const apiCall = async (url: string) => {
      const response = await firstValueFrom(this.httpService.get(url));
      return response.data;
    };

    // 2. ตั้งค่า Circuit Breaker (ดึงค่าจาก env หรือใช้ค่า Default)
    const options: CircuitBreaker.Options = {
      timeout: parseInt(process.env.CB_TIMEOUT_MS || '3000', 10), // ถ้ายิง API นานเกิน 3 วินาที ถือว่า Timeout
      errorThresholdPercentage: parseInt(
        process.env.CB_ERROR_THRESHOLD || '50',
        10,
      ), // ถ้า Error เกิน 50% ให้สับสวิตช์เป็น Open (หยุดยิง)
      resetTimeout: parseInt(process.env.CB_RESET_TIMEOUT_MS || '5000', 10), // หลังจากผ่านไป 5 วินาที ให้ลองยิงใหม่ (Half-Open)
    };

    this.breaker = new CircuitBreaker(apiCall, options);

    // 3. ดักฟัง Event ต่างๆ ของ Circuit Breaker
    this.breaker.on('open', () =>
      this.logger.warn('Circuit Breaker OPEN. API requests paused.'),
    );
    this.breaker.on('halfOpen', () =>
      this.logger.log('Circuit Breaker HALF-OPEN. Attempting API request.'),
    );
    this.breaker.on('close', () =>
      this.logger.log('Circuit Breaker CLOSED. API requests resumed.'),
    );
    this.breaker.on('fallback', (result) =>
      this.logger.warn(`Fallback triggered: ${result}`),
    );

    // ตั้งค่า Fallback (แผนสำรองเมื่อ API ล่ม หรือ Circuit เปิด)
    this.breaker.fallback(() => {
      return {
        status: 'fallback',
        message: 'บริการปลายทางมีปัญหา กรุณาลองใหม่ภายหลัง',
      };
    });
  }

  // Method สำหรับให้คนอื่นเรียกใช้งาน
  async get(url: string): Promise<any> {
    try {
      this.logger.log(`Executing HTTP request to: ${url}`);
      return await this.breaker.fire(url);
    } catch (error) {
      this.logger.error(`HTTP request failed: ${error.message}`);
      throw error;
    }
  }
}
