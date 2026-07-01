import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  // หัวข้อ 3.3 Event-Driven: รอรับฟังก์ชันเมื่อมี Event 'user.created' เกิดขึ้น
  @OnEvent('user.created')
  handleUserCreatedEvent(payload: { userId: number; email: string }) {
    // ในสถานการณ์จริง ตรงนี้อาจจะไปเรียก SendGrid, AWS SES เพื่อส่งอีเมล
    this.logger.log(`[Event-Driven] 🎉 เย้! ได้รับการแจ้งเตือนว่ามีผู้ใช้ใหม่สมัครเข้ามา: ${payload.email} (ID: ${payload.userId})`);
    this.logger.log(`[Event-Driven] 📧 กำลังจำลองการส่งอีเมลต้อนรับ...`);
  }
}
