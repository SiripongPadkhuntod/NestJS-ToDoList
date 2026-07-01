import { ApiProperty } from '@nestjs/swagger';
import { Task } from '@prisma/client';

export class TaskEntity implements Task {
  @ApiProperty({ example: 1, description: 'ไอดีของ Task' })
  id: number;

  @ApiProperty({ example: 'Task 1', description: 'ชื่อ Task' })
  title: string;

  @ApiProperty({ example: 'รายละเอียดของ Task 1', description: 'รายละเอียด Task' })
  description: string;

  @ApiProperty({ example: 'OPEN', description: 'สถานะของ Task' })
  status: string;

  @ApiProperty({ example: '2026-07-01T10:00:00.000Z', description: 'เวลาที่สร้าง' })
  createdAt: Date;

  @ApiProperty({ example: 1, description: 'ไอดีของผู้สร้าง (ถ้ามี)', required: false, nullable: true })
  userId: number | null;
}
