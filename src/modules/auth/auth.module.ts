import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '@modules/users/users.module';
import { AuthController } from './auth.controller';

import { BcryptPasswordHasher } from './adapters/bcrypt-password-hasher.adapter';
import { JwtTokenGenerator } from './adapters/jwt-token-generator.adapter';
import { NestEventPublisher } from './adapters/nest-event-publisher.adapter';
import { PASSWORD_HASHER } from './ports/password-hasher.port';
import { TOKEN_GENERATOR } from './ports/token-generator.port';
import { EVENT_PUBLISHER } from './ports/event-publisher.port';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    // หัวข้อ 2.8 JWT Authentication: ตั้งค่า JWT Module
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'super-secret', // หัวข้อ 2.10: ควรดึงจาก env
      signOptions: { expiresIn: '60m' },
    }),
  ],
  providers: [
    AuthService, 
    JwtStrategy,
    { provide: PASSWORD_HASHER, useClass: BcryptPasswordHasher },
    { provide: TOKEN_GENERATOR, useClass: JwtTokenGenerator },
    { provide: EVENT_PUBLISHER, useClass: NestEventPublisher },
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
