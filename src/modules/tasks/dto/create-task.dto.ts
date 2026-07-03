// src/tasks/create-task.dto.ts
import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'ชื่อ Task ต้องมีความยาวอย่างน้อย 3 ตัวอักษร' })
  @ApiProperty({
    example: 'Task 1',
    description: 'ชื่อ Task',
    required: true,
  })
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Task 1',
    description: 'รายละเอียด Task',
    required: true,
  })
  description: string;
}
