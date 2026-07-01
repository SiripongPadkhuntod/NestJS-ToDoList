// src/tasks/tasks.service.ts
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Task } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: number): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: { userId },
    });
  }

  async findOne(id: number, userId: number): Promise<Task> {
    const task = await this.prisma.task.findUnique({
      where: { id: id },
    });
    if (!task) {
      throw new NotFoundException(`ไม่พบ Task หมายเลข ${id}`);
    }
    if (task.userId !== userId) {
      throw new UnauthorizedException('You do not have access to this task');
    }
    return task;
  }

  async create(createTaskDto: CreateTaskDto, userId: number): Promise<Task> {
    return this.prisma.task.create({
      data: {
        title: createTaskDto.title,
        description: createTaskDto.description,
        userId: userId,
      },
    });
  }

  async update(id: number, updateTaskDto: UpdateTaskDto, userId: number): Promise<Task> {
    await this.findOne(id, userId); // Check if task exists & belongs to user

    return this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
    });
  }

  async remove(id: number, userId: number): Promise<Task> {
    await this.findOne(id, userId); // Check if task exists & belongs to user

    return this.prisma.task.delete({
      where: { id },
    });
  }
}