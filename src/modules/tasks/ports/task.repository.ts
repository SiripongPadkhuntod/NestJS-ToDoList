import { TaskModel } from '../domain/task.model';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';

export const TASK_REPOSITORY = 'TASK_REPOSITORY'; // Token สำหรับ Injection

export interface ITaskRepository {
  findAllByUserId(userId: string): Promise<TaskModel[]>;
  findOne(id: string): Promise<TaskModel | null>;
  createTask(createTaskDto: CreateTaskDto, userId: string): Promise<TaskModel>;
  updateTask(id: string, updateTaskDto: UpdateTaskDto): Promise<TaskModel>;
  removeTask(id: string): Promise<TaskModel>;
}
