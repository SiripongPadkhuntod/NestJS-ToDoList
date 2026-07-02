import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetTasksQuery } from '../queries/get-tasks.query';
import { ITaskRepository, TASK_REPOSITORY } from '../ports/task.repository';
import type { ITaskRepository as ITaskRepositoryType } from '../ports/task.repository';
import { TaskModel } from '../domain/task.model';

@QueryHandler(GetTasksQuery)
export class GetTasksHandler implements IQueryHandler<GetTasksQuery> {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: ITaskRepositoryType,
  ) {}

  async execute(query: GetTasksQuery): Promise<TaskModel[]> {
    const { userId } = query;
    return this.taskRepository.findAllByUserId(userId);
  }
}
