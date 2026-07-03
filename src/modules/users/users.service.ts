import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUserRepository, USER_REPOSITORY } from './ports/user.repository';
import type { IUserRepository as IUserRepositoryType } from './ports/user.repository';
import {
  IPasswordHasher,
  PASSWORD_HASHER,
} from '@core/security/ports/password-hasher.port';
import type { IPasswordHasher as IPasswordHasherType } from '@core/security/ports/password-hasher.port';
import { UserModel } from './domain/user.model';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepositoryType,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: IPasswordHasherType,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserModel> {
    const hashedPassword = await this.passwordHasher.hash(
      createUserDto.password,
    );
    return this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
  }

  async findAll(): Promise<UserModel[]> {
    return this.userRepository.findAll();
  }

  async findOne(id: string): Promise<UserModel> {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException(`ไม่พบผู้ใช้ ID ${id}`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserModel> {
    await this.findOne(id); // ตรวจสอบว่ามีอยู่จริง

    // ถ้ามีการเปลี่ยนรหัสผ่าน ให้เข้ารหัสใหม่
    if (updateUserDto.password) {
      updateUserDto.password = await this.passwordHasher.hash(
        updateUserDto.password,
      );
    }

    return this.userRepository.update(id, updateUserDto);
  }

  async remove(id: string): Promise<UserModel> {
    await this.findOne(id);
    return this.userRepository.remove(id);
  }
}
