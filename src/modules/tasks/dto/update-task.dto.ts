import { PartialType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';
import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'IN_PROGRESS',
    description: 'สถานะของ Task (เช่น OPEN, IN_PROGRESS, DONE)',
    required: false,
  })
  status?: string;
}
