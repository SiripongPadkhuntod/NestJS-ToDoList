import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import type { SentMessageInfo } from 'nodemailer';

interface WelcomeEmailJobData {
  email: string;
}

@Processor('mail')
export class MailQueueProcessor extends WorkerHost {
  private readonly logger = new Logger(MailQueueProcessor.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    super();
    this.initMailer();
  }

  // สร้างบัญชีอีเมลจำลอง (Ethereal) อัตโนมัติเวลาแอปเปิด
  private async initMailer() {
    try {
      const testAccount = await nodemailer.createTestAccount();
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      this.logger.log(
        `[Queue Worker] ระบบจำลองอีเมล Ethereal พร้อมแล้ว! (User: ${testAccount.user})`,
      );
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `[Queue Worker] ไม่สามารถสร้าง Ethereal Mail ได้: ${err.message}`,
      );
    }
  }

  async process(job: Job<WelcomeEmailJobData, any, string>): Promise<any> {
    this.logger.log(
      `[Queue Worker] กำลังเริ่มประมวลผลงานรหัส: ${job.id ?? 'unknown'}`,
    );

    switch (job.name) {
      case 'welcome-email':
        this.logger.log(
          `[Queue Worker] กำลังเตรียมส่งอีเมลต้อนรับไปยัง: ${job.data.email}`,
        );

        if (!this.transporter) {
          throw new Error('ระบบส่งเมลยังไม่พร้อมทำงาน');
        }

        try {
          const htmlTemplate = `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #ffffff;">
              <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #0056b3;">
                <h1 style="color: #0056b3; margin: 0; font-size: 24px;">PRJ E-Procurement</h1>
              </div>
              <div style="padding: 30px 20px; color: #333333; line-height: 1.6;">
                <h2 style="font-size: 20px; margin-top: 0;">Welcome to the System</h2>
                <p>Dear <strong>${job.data.email}</strong>,</p>
                <p>We are thrilled to welcome you to the PRJ E-Procurement System. Your account has been successfully created and is ready for use.</p>
                <p>Our platform is designed to streamline your workflow and enhance your procurement operations with enterprise-grade security and reliability.</p>
                <div style="text-align: center; margin: 40px 0;">
                  <a href="#" style="background-color: #0056b3; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 16px;">Access Dashboard</a>
                </div>
                <p style="margin-bottom: 0;">If you have any questions, please contact our IT Support Team.</p>
              </div>
              <div style="background-color: #f8f9fa; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #666666;">
                <p style="margin: 0;">&copy; ${new Date().getFullYear()} PRJ Corporation. All rights reserved.</p>
                <p style="margin: 5px 0 0 0;">This is an automated message, please do not reply.</p>
              </div>
            </div>
          `;

          // สั่งส่งอีเมลจริงๆ ผ่าน SMTP
          const info = await this.transporter.sendMail({
            from: '"PRJ E-Procurement" <noreply@prj-corp.com>', // ผู้ส่งที่เป็นทางการ
            to: job.data.email,
            subject: 'Account Registration Successful - PRJ E-Procurement',
            text: `Dear ${job.data.email}, Welcome to the PRJ E-Procurement System. Your account has been successfully created.`,
            html: htmlTemplate,
          });

          this.logger.log(
            `[Queue Worker] ส่งอีเมลสำเร็จ! Message ID: ${info.messageId}`,
          );

          // ไฮไลท์ของ Ethereal: เราสามารถดูอีเมลที่เราเพิ่งส่งไปได้ผ่าน URL นี้!
          const previewUrl = nodemailer.getTestMessageUrl(info); // .getTestMessageUrl() เป็นฟังก์ชันของ Ethereal ที่ใช้สำหรับดูอีเมลที่ส่งไป สำคัญมากเวลาทดสอบ
          if (previewUrl) {
            this.logger.log(
              `[Queue Worker] คลิกลิงก์นี้เพื่อดูอีเมลที่ส่งไป (จำลอง): ${previewUrl}`,
            );
          }
        } catch (error) {
          const err = error as Error;
          this.logger.error(`[Queue Worker] ส่งอีเมลล้มเหลว: ${err.message}`);
          throw err; // โยน Error กลับไปให้คิว (BullMQ) จัดการ (อาจจะ retry ใหม่)
        }
        break;
      default:
        this.logger.warn(`[Queue Worker] ไม่รู้จักงานชื่อ: ${job.name}`);
    }
  }
}
