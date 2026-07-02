// src/tasks/tasks.module.ts
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { GetTasksHandler } from './handlers/get-tasks.handler';
import { CreateTaskHandler } from './handlers/create-task.handler';

// หัวข้อ 3.6 CQRS: ลงทะเบียน Handlers ทั้งหมด
export const CommandHandlers = [CreateTaskHandler];
export const QueryHandlers = [GetTasksHandler];

@Module({
  imports: [CqrsModule],
  controllers: [TasksController],
  providers: [TasksService, ...CommandHandlers, ...QueryHandlers],
})
export class TasksModule {}