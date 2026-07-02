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

    // 2. ตั้งค่า Circuit Breaker
    const options: CircuitBreaker.Options = {
      timeout: 3000,               // ถ้ายิง API นานเกิน 3 วินาที ถือว่า Timeout
      errorThresholdPercentage: 50, // ถ้า Error เกิน 50% ให้สับสวิตช์เป็น Open (หยุดยิง)
      resetTimeout: 5000,          // หลังจากผ่านไป 5 วินาที ให้ลองยิงใหม่ (Half-Open)
    };

    this.breaker = new CircuitBreaker(apiCall, options);

    // 3. ดักฟัง Event ต่างๆ ของ Circuit Breaker
    this.breaker.on('open', () => this.logger.warn('🔴 Circuit Breaker OPEN! หยุดยิง API ชั่วคราว!'));
    this.breaker.on('halfOpen', () => this.logger.log('🟡 Circuit Breaker HALF-OPEN! ลองยิง API อีกครั้ง...'));
    this.breaker.on('close', () => this.logger.log('🟢 Circuit Breaker CLOSED! API กลับมาปกติแล้ว!'));
    this.breaker.on('fallback', (result) => this.logger.warn(`🛡️ Fallback ทำงาน: ${result}`));
    
    // ตั้งค่า Fallback (แผนสำรองเมื่อ API ล่ม หรือ Circuit เปิด)
    this.breaker.fallback(() => {
      return { status: 'fallback', message: 'บริการปลายทางมีปัญหา กรุณาลองใหม่ภายหลัง' };
    });
  }

  // Method สำหรับให้คนอื่นเรียกใช้งาน
  async get(url: string): Promise<any> {
    try {
      this.logger.log(`กำลังยิง API ไปที่: ${url}`);
      return await this.breaker.fire(url);
    } catch (error) {
      this.logger.error(`เกิดข้อผิดพลาดในการยิง API: ${error.message}`);
      throw error;
    }
  }
}
