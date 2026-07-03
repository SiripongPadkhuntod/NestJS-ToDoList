import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

// หัวข้อ 2.8 JWT Authentication: กลยุทธ์ในการตรวจสอบ Token
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // รับ Token จาก Header Bearer
      ignoreExpiration: false, // ห้าม Token หมดอายุ
      secretOrKey: process.env.JWT_SECRET || 'super-secret', // รหัสลับ
    });
  }

  validate(payload: any) {
    // ข้อมูลที่ Return จะถูกแนบไปกับ Request (req.user)
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
