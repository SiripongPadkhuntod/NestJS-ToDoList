export class TaskModel {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly status: string,
    public readonly createdAt: Date,
    public readonly userId: string | null,
  ) {}
}
