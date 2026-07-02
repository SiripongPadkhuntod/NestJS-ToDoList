import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTasksQuery } from '../queries/get-tasks.query';
import { PrismaService } from '../../prisma/prisma.service';
import { Task } from '@prisma/client';

@QueryHandler(GetTasksQuery)
export class GetTasksHandler implements IQueryHandler<GetTasksQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetTasksQuery): Promise<Task[]> {
    const { userId } = query;
    const tasks = await this.prisma.task.findMany({
      where: { userId },
    });
    return tasks;
  }
}
