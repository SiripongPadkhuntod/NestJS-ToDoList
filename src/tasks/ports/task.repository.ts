import { Task } from '@prisma/client';
import { CreateTaskDto } from '../dto/create-task.dto';

export const TASK_REPOSITORY = 'TASK_REPOSITORY'; // Token สำหรับ Injection

export interface ITaskRepository {
  findAllByUserId(userId: number): Promise<Task[]>;
  createTask(createTaskDto: CreateTaskDto, userId: number): Promise<Task>;
}
