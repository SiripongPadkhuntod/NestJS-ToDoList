import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HttpHealthIndicator,
  HealthCheck,
  PrismaHealthIndicator,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import { PrismaService } from '../prisma/prisma.service';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private prismaHealth: PrismaHealthIndicator,
    private prisma: PrismaService,
    private memory: MemoryHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      // 1. ตรวจสอบสถานะการเชื่อมต่อ Database (Prisma)
      () => this.prismaHealth.pingCheck('database', this.prisma),

      // 2. ตรวจสอบว่าแอปเรายังออกเน็ตเวิร์กได้ปกติ (ยิงไป Google หรือหน้าเว็บตัวเอง)
      () => this.http.pingCheck('network', 'https://1.1.1.1'),

      // 3. ตรวจสอบว่ากิน Memory (Heap) เกิน 200MB หรือยัง (ถ้าเกินแสดงว่าอาจมี Memory Leak)
      () => this.memory.checkHeap('memory_heap', 200 * 1024 * 1024),
    ]);
  }
}
