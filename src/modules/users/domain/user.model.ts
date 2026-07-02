export class UserModel {
  constructor(
    public readonly id: number,
    public readonly email: string,
    public readonly role: string,
    public readonly password?: string,
  ) {}
}
