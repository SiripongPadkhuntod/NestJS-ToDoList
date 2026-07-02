import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ITokenGenerator } from '../ports/token-generator.port';

@Injectable()
export class JwtTokenGenerator implements ITokenGenerator {
  constructor(private readonly jwtService: JwtService) {}

  generateToken(payload: Record<string, any>): string {
    return this.jwtService.sign(payload);
  }
}
