import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaUserRepository } from './adapters/prisma-user.repository';
import { USER_REPOSITORY } from './ports/user.repository';
import { PrismaModule } from '@core/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    }
  ],
  exports: [UsersService, USER_REPOSITORY],
})
export class UsersModule {}
