import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private pool: Pool;

  constructor() {
    // สร้าง Connection String จาก Env Variables แบบแยกชิ้น (Fallback ด้วยค่า Default)
    const user = process.env.DB_USER || 'admin';
    const password = process.env.DB_PASSWORD || 'password123';
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || '5433';
    const dbName = process.env.DB_NAME || 'phase_one_db';
    const schema = process.env.DB_SCHEMA || 'public';
    const maxConnections = parseInt(process.env.DB_POOL_MAX || '10', 10);

    const connectionString = `postgresql://${user}:${password}@${host}:${port}/${dbName}?schema=${schema}`;
    const pool = new Pool({
      connectionString,
      max: maxConnections, // จำกัดจำนวน Connection สูงสุด (Default คือ 10)
    });
    const adapter = new PrismaPg(pool);
    super({
      adapter,
      log: ['error'],
    });
    this.pool = pool;
  }

  // ฟังก์ชันนี้จะทำงานอัตโนมัติเมื่อ NestJS สตาร์ท
  async onModuleInit() {
    await this.$connect(); // สั่งเชื่อมต่อ Database
  }

  private readonly logger = new Logger(PrismaService.name);

  async onModuleDestroy() {
    this.logger.log('Disconnecting from Database (Graceful Shutdown)...');
    await this.$disconnect();
    await this.pool.end();
    this.logger.log('Database disconnected successfully.');
  }
}
