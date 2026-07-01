import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// หัวข้อ 2.7 Guard — ป้องกัน Route: สร้าง Guard ขึ้นมาหุ้ม Guard พื้นฐาน
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
