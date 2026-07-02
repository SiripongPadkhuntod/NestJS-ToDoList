import { TaskModel } from '../domain/task.model';
import { CreateTaskDto } from '../dto/create-task.dto';

export const TASK_REPOSITORY = 'TASK_REPOSITORY'; // Token สำหรับ Injection

export interface ITaskRepository {
  findAllByUserId(userId: number): Promise<TaskModel[]>;
  findOne(id: number): Promise<TaskModel | null>;
  createTask(createTaskDto: CreateTaskDto, userId: number): Promise<TaskModel>;
  updateTask(id: number, updateTaskDto: Partial<CreateTaskDto>): Promise<TaskModel>;
  removeTask(id: number): Promise<TaskModel>;
}
