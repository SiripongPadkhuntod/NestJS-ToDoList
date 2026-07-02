// src/tasks/tasks.service.ts
import { Injectable, NotFoundException, UnauthorizedException, Inject } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ITaskRepository, TASK_REPOSITORY } from './ports/task.repository';
import type { ITaskRepository as ITaskRepositoryType } from './ports/task.repository';
import { TaskModel } from './domain/task.model';

@Injectable()
export class TasksService {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: ITaskRepositoryType,
  ) {}

  async findAll(userId: string): Promise<TaskModel[]> {
    return this.taskRepository.findAllByUserId(userId);
  }

  async findOne(id: string, userId: string): Promise<TaskModel> {
    const task = await this.taskRepository.findOne(id);
    
    if (!task) {
      throw new NotFoundException(`ไม่พบ Task หมายเลข ${id}`);
    }
    if (task.userId !== userId) {
      throw new UnauthorizedException('You do not have access to this task');
    }
    return task;
  }

  async create(createTaskDto: CreateTaskDto, userId: string): Promise<TaskModel> {
    return this.taskRepository.createTask(createTaskDto, userId);
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userId: string): Promise<TaskModel> {
    await this.findOne(id, userId); // Check if task exists & belongs to user
    return this.taskRepository.updateTask(id, updateTaskDto);
  }

  async remove(id: string, userId: string): Promise<TaskModel> {
    await this.findOne(id, userId); // Check if task exists & belongs to user
    return this.taskRepository.removeTask(id);
  }
}