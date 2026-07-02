import { Injectable } from '@nestjs/common';
import { ITaskRepository } from '../ports/task.repository';
import { PrismaService } from '@core/prisma/prisma.service';
import { TaskModel } from '../domain/task.model';
import { CreateTaskDto } from '../dto/create-task.dto';

@Injectable()
export class PrismaTaskRepository implements ITaskRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByUserId(userId: number): Promise<TaskModel[]> {
    const tasks = await this.prisma.task.findMany({
      where: { userId },
    });
    return tasks.map(t => new TaskModel(t.id, t.title, t.description, t.status, t.createdAt, t.userId));
  }

  async createTask(createTaskDto: CreateTaskDto, userId: number): Promise<TaskModel> {
    const task = await this.prisma.task.create({
      data: {
        ...createTaskDto,
        userId,
      },
    });
    return new TaskModel(task.id, task.title, task.description, task.status, task.createdAt, task.userId);
  }

  async findOne(id: number): Promise<TaskModel | null> {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });
    if (!task) return null;
    return new TaskModel(task.id, task.title, task.description, task.status, task.createdAt, task.userId);
  }

  async updateTask(id: number, updateTaskDto: Partial<CreateTaskDto>): Promise<TaskModel> {
    const task = await this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
    });
    return new TaskModel(task.id, task.title, task.description, task.status, task.createdAt, task.userId);
  }

  async removeTask(id: number): Promise<TaskModel> {
    const task = await this.prisma.task.delete({
      where: { id },
    });
    return new TaskModel(task.id, task.title, task.description, task.status, task.createdAt, task.userId);
  }
}
