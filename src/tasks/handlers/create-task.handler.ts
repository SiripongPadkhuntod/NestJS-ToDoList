import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateTaskCommand } from '../commands/create-task.command';
import { PrismaService } from '../../prisma/prisma.service';
import { Task } from '@prisma/client';

@CommandHandler(CreateTaskCommand)
export class CreateTaskHandler implements ICommandHandler<CreateTaskCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(command: CreateTaskCommand): Promise<Task> {
    const { createTaskDto, userId } = command;
    return this.prisma.task.create({
      data: {
        ...createTaskDto,
        userId: userId,
      },
    });
  }
}
