import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        password: hashedPassword,
        role: createUserDto.role || 'USER',
      },
    });
    return new UserEntity(user);
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    return users.map((user) => new UserEntity(user));
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`ไม่พบผู้ใช้ ID ${id}`);
    }
    return new UserEntity(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.findOne(id); // ตรวจสอบว่ามีอยู่จริง
    
    // ถ้ามีการเปลี่ยนรหัสผ่าน ให้เข้ารหัสใหม่
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
    return new UserEntity(updatedUser);
  }

  async remove(id: number) {
    await this.findOne(id);
    const deletedUser = await this.prisma.user.delete({ where: { id } });
    return new UserEntity(deletedUser);
  }
}

