import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;

  constructor() {
    const connectionString = process.env.DATABASE_URL || 'postgresql://admin:password123@localhost:5433/phase_one_db?schema=public';
    const pool = new Pool({ connectionString });
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

  async onModuleDestroy() {
    await this.$disconnect();
    await this.pool.end();
  }
}