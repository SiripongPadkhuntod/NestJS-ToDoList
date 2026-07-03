import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetTaskInspirationQuery } from '../queries/get-task-inspiration.query';
import {
  IExternalTaskProvider,
  EXTERNAL_TASK_PROVIDER,
} from '../ports/external-task-provider.port';
import type { IExternalTaskProvider as IExternalTaskProviderType } from '../ports/external-task-provider.port';

@QueryHandler(GetTaskInspirationQuery)
export class GetTaskInspirationHandler implements IQueryHandler<GetTaskInspirationQuery> {
  constructor(
    @Inject(EXTERNAL_TASK_PROVIDER)
    private readonly externalTaskProvider: IExternalTaskProviderType,
  ) {}

  async execute(query: GetTaskInspirationQuery): Promise<any> {
    // ดึงข้อมูลผ่าน Port (ไม่สนว่าข้างในจะใช้ Axios หรือใช้ Circuit Breaker)
    return this.externalTaskProvider.fetchTaskInspiration();
  }
}
