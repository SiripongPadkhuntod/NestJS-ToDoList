import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';

// หัวข้อ 2.3 Repository Pattern: แยกชั้นเชื่อมต่อ Database ออกมา
@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  // หัวข้อ 2.6 Transaction: ตัวอย่างการใช้ Transaction
  async createWithTask(userData: Prisma.UserCreateInput, taskTitle: string) {
    // คำสั่งทุกอย่างในนี้จะต้องสำเร็จทั้งหมด หรือล้มเหลวทั้งหมด (All-or-nothing)
    return this.prisma.$transaction(async (prisma) => {
      const user = await prisma.user.create({ data: userData });
      const task = await prisma.task.create({
        data: { title: taskTitle, description: '', userId: user.id },
      });
      return { user, task };
    });
  }
}
