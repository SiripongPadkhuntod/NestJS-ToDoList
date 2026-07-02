// src/tasks/tasks.module.ts
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { GetTasksHandler } from './handlers/get-tasks.handler';
import { CreateTaskHandler } from './handlers/create-task.handler';
import { PrismaTaskRepository } from './adapters/prisma-task.repository';
import { TASK_REPOSITORY } from './ports/task.repository';

// หัวข้อ 3.6 CQRS: ลงทะเบียน Handlers ทั้งหมด
export const CommandHandlers = [CreateTaskHandler];
export const QueryHandlers = [GetTasksHandler];

@Module({
  imports: [CqrsModule],
  controllers: [TasksController],
  providers: [
    TasksService,
    // หัวข้อ 3.7 Hexagonal Architecture: ลงทะเบียน Adapter
    {
      provide: TASK_REPOSITORY,
      useClass: PrismaTaskRepository,
    },
    ...CommandHandlers,
    ...QueryHandlers,
  ],
})
export class TasksModule {}