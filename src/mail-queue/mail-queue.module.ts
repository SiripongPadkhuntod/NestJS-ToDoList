import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { MailQueueService } from './mail-queue.service';
import { MailQueueProcessor } from './mail-queue.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'mail', // ชื่อคิว
    }),
  ],
  providers: [MailQueueService, MailQueueProcessor],
  exports: [MailQueueService, BullModule],
})
export class MailQueueModule {}
