import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// หัวข้อ 3.2 Custom Decorator: สร้าง Decorator ของตัวเองเพื่อดึงข้อมูลผู้ใช้จาก Request ได้ง่ายๆ
export const User = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    
    // ถ้ามีการระบุชื่อฟิลด์ (เช่น @User('email')) ให้ดึงแค่ฟิลด์นั้น
    // ถ้าไม่ระบุ ให้ดึงมาทั้งก้อน
    return data ? user?.[data] : user;
  },
);
