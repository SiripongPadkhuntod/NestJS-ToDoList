import { ApiProperty } from '@nestjs/swagger';

export class TaskEntity {
  @ApiProperty({ description: 'รหัสอ้างอิง Task', example: 'uuid-string' })
  id: string;

  @ApiProperty({ example: 'Task 1', description: 'ชื่อ Task' })
  title: string;

  @ApiProperty({
    example: 'รายละเอียดของ Task 1',
    description: 'รายละเอียด Task',
  })
  description: string;

  @ApiProperty({ example: 'OPEN', description: 'สถานะของ Task' })
  status: string;

  @ApiProperty({
    example: '2026-07-01T10:00:00.000Z',
    description: 'เวลาที่สร้าง',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'รหัสผู้ใช้งานที่เป็นเจ้าของ Task',
    example: 'uuid-string',
  })
  userId: string | null;

  constructor(partial: Partial<TaskEntity>) {
    Object.assign(this, partial);
  }
}
