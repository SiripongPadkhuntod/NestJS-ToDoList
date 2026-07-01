import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class MailQueueService {
  constructor(@InjectQueue('mail') private mailQueue: Queue) {}

  async sendWelcomeEmail(email: string) {
    // โยนงานเข้าไปต่อคิวใน Redis
    await this.mailQueue.add('welcome-email', {
      email,
    });
  }
}
