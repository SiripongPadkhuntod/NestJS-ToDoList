import { Injectable } from '@nestjs/common';
import { ITaskRepository } from '../ports/task.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { Task } from '@prisma/client';
import { CreateTaskDto } from '../dto/create-task.dto';

@Injectable()
export class PrismaTaskRepository implements ITaskRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByUserId(userId: number): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: { userId },
    });
  }

  async createTask(createTaskDto: CreateTaskDto, userId: number): Promise<Task> {
    return this.prisma.task.create({
      data: {
        ...createTaskDto,
        userId,
      },
    });
  }
}
