import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // @Global() ทำให้ Module อื่นเรียกใช้ PrismaService ได้เลยโดยไม่ต้องมานั่ง Import ทุกครั้ง
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // สำคัญมาก! ต้อง Export ออกไป
})
export class PrismaModule {}
