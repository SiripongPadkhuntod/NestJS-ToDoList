import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUserRepository, USER_REPOSITORY } from './ports/user.repository';
import type { IUserRepository as IUserRepositoryType } from './ports/user.repository';
import * as bcrypt from 'bcrypt';
import { UserModel } from './domain/user.model';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepositoryType,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserModel> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    return this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
  }

  async findAll(): Promise<UserModel[]> {
    return this.userRepository.findAll();
  }

  async findOne(id: number): Promise<UserModel> {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException(`ไม่พบผู้ใช้ ID ${id}`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserModel> {
    await this.findOne(id); // ตรวจสอบว่ามีอยู่จริง
    
    // ถ้ามีการเปลี่ยนรหัสผ่าน ให้เข้ารหัสใหม่
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    return this.userRepository.update(id, updateUserDto);
  }

  async remove(id: number): Promise<UserModel> {
    await this.findOne(id);
    return this.userRepository.remove(id);
  }
}

