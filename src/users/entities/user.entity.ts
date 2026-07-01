import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';

// หัวข้อ 2.2 Entity — แปลง Class เป็น Table: 
// นี่คือคลาสที่เป็นตัวแทนข้อมูล (Entity) เพื่อใช้จัดการตอนก่อนจะส่งออกไป (Serialization)
export class UserEntity implements User {
  id: number;
  email: string;
  role: string;

  // หัวข้อ 2.2: ยกตัวอย่างการใช้ @Exclude() เพื่อซ่อนฟิลด์รหัสผ่านไม่ให้เผลอส่งกลับไปใน Response
  @Exclude()
  password: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
