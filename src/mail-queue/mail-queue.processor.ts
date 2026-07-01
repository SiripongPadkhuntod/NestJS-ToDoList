import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';

@Processor('mail')
export class MailQueueProcessor extends WorkerHost {
  private readonly logger = new Logger(MailQueueProcessor.name);

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(`[Queue Worker] 👷 กำลังเริ่มประมวลผลงานรหัส: ${job.id}`);
    
    switch (job.name) {
      case 'welcome-email':
        this.logger.log(`[Queue Worker] 📧 กำลังส่งอีเมลต้อนรับไปยัง: ${job.data.email}`);
        
        // จำลองการทำงานที่ใช้เวลานาน เช่น ส่งอีเมล 3 วินาที
        await new Promise((resolve) => setTimeout(resolve, 3000));
        
        this.logger.log(`[Queue Worker] ✅ ส่งอีเมลสำเร็จ!`);
        break;
      default:
        this.logger.warn(`[Queue Worker] ⚠️ ไม่รู้จักงานชื่อ: ${job.name}`);
    }
  }
}
