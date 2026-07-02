import { UserModel } from '../domain/user.model';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

export const USER_REPOSITORY = 'USER_REPOSITORY';

export interface IUserRepository {
  create(createUserDto: CreateUserDto): Promise<UserModel>;
  findByEmail(email: string): Promise<UserModel | null>;
  findAll(): Promise<UserModel[]>;
  findOne(id: number): Promise<UserModel | null>;
  update(id: number, updateUserDto: UpdateUserDto): Promise<UserModel>;
  remove(id: number): Promise<UserModel>;
}
