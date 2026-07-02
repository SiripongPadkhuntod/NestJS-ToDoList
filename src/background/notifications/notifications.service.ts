import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MailQueueService } from '@background/mail-queue/mail-queue.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private readonly mailQueueService: MailQueueService) {}

  // หัวข้อ 3.3 Event-Driven: รอรับฟังก์ชันเมื่อมี Event 'user.created' เกิดขึ้น
  @OnEvent('user.created')
  async handleUserCreatedEvent(payload: { userId: number; email: string }) {
    this.logger.log(`[Event-Driven] 🎉 ได้รับแจ้งเตือนผู้ใช้ใหม่: ${payload.email} (ID: ${payload.userId})`);
    
    // หัวข้อ 3.4 Queue & Redis: โยนงานส่งอีเมลลงคิว
    this.logger.log(`[Event-Driven] ➡️ กำลังส่งงานเข้า Queue ให้ Worker ไปทำต่อหลังบ้าน...`);
    await this.mailQueueService.sendWelcomeEmail(payload.email);
  }
}
