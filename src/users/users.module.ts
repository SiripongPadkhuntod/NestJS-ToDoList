import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  // หัวข้อ 2.3 Repository Pattern: ประกาศใช้ Repository
  providers: [UsersService, UsersRepository],
  exports: [UsersService, UsersRepository], // เผื่อให้ AuthModule เรียกใช้
})
export class UsersModule {}
