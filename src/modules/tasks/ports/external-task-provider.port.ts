export const EXTERNAL_TASK_PROVIDER = 'EXTERNAL_TASK_PROVIDER';

export interface IExternalTaskProvider {
  fetchTaskInspiration(): Promise<any>;
}
