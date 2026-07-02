import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../ports/user.repository';
import { PrismaService } from '@core/prisma/prisma.service';
import { UserModel } from '../domain/user.model';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<UserModel> {
    const user = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        password: createUserDto.password,
        role: createUserDto.role || 'USER',
      },
    });
    return new UserModel(user.id, user.email, user.role, user.password);
  }

  async findByEmail(email: string): Promise<UserModel | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    return new UserModel(user.id, user.email, user.role, user.password);
  }

  async findAll(): Promise<UserModel[]> {
    const users = await this.prisma.user.findMany();
    return users.map(user => new UserModel(user.id, user.email, user.role, user.password));
  }

  async findOne(id: number): Promise<UserModel | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    return new UserModel(user.id, user.email, user.role, user.password);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserModel> {
    const user = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
    return new UserModel(user.id, user.email, user.role, user.password);
  }

  async remove(id: number): Promise<UserModel> {
    const user = await this.prisma.user.delete({ where: { id } });
    return new UserModel(user.id, user.email, user.role, user.password);
  }
}
