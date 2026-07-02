import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateTaskCommand } from '../commands/create-task.command';
import { ITaskRepository, TASK_REPOSITORY } from '../ports/task.repository';
import type { ITaskRepository as ITaskRepositoryType } from '../ports/task.repository';
import { Task } from '@prisma/client';

@CommandHandler(CreateTaskCommand)
export class CreateTaskHandler implements ICommandHandler<CreateTaskCommand> {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: ITaskRepositoryType,
  ) {}

  async execute(command: CreateTaskCommand): Promise<Task> {
    const { createTaskDto, userId } = command;
    return this.taskRepository.createTask(createTaskDto, userId);
  }
}
