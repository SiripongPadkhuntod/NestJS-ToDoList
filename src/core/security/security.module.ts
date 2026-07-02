import { Module, Global } from '@nestjs/common';
import { Argon2PasswordHasher } from './adapters/argon2-password-hasher.adapter';
import { PASSWORD_HASHER } from './ports/password-hasher.port';

@Global()
@Module({
  providers: [
    {
      provide: PASSWORD_HASHER,
      useClass: Argon2PasswordHasher,
    },
  ],
  exports: [PASSWORD_HASHER],
})
export class SecurityModule {}
