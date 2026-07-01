import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { MailQueueModule } from '../mail-queue/mail-queue.module';

@Module({
  imports: [MailQueueModule],
  providers: [NotificationsService]
})
export class NotificationsModule {}
