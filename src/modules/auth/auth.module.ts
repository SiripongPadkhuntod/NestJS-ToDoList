import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '@modules/users/users.module';
import { AuthController } from './auth.controller';

import { JwtTokenGenerator } from './adapters/jwt-token-generator.adapter';
import { NestEventPublisher } from './adapters/nest-event-publisher.adapter';
import { TOKEN_GENERATOR } from './ports/token-generator.port';
import { EVENT_PUBLISHER } from './ports/event-publisher.port';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    // หัวข้อ 2.8 JWT Authentication: ตั้งค่า JWT Module
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET || 'super-secret',
        signOptions: {
          expiresIn: (process.env.JWT_EXPIRES_IN || '60m') as any,
        },
      }),
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    { provide: TOKEN_GENERATOR, useClass: JwtTokenGenerator },
    { provide: EVENT_PUBLISHER, useClass: NestEventPublisher },
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
