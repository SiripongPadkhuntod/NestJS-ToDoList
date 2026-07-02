import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

// 0. ตั้งค่า Database Connection เหมือนกับในโค้ดหลัก
const connectionString = `postgresql://${process.env.DB_USER || 'admin'}:${process.env.DB_PASSWORD || 'password123'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5433'}/${process.env.DB_NAME || 'phase_one_db'}?schema=${process.env.DB_SCHEMA || 'public'}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log(' Starting database seeding...');

  // 1. สร้างรหัสผ่านที่เข้ารหัสแล้ว (argon2)
  const plainPassword = 'SuperSecretPassword!@#';
  const hashedPassword = await argon2.hash(plainPassword);

  // 2. ใช้ upsert เพื่อให้สคริปต์รันซ้ำได้โดยไม่ Error (ถ้ามีอยู่แล้วให้ข้าม/อัปเดต)
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@phaseone.com' },
    update: {}, // ถ้ามีอยู่แล้ว ไม่ต้องอัปเดตอะไร
    create: {
      email: 'admin@phaseone.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log(` Default Admin user created: ${adminUser.email}`);
  console.log(` Password is: ${plainPassword}`);
  console.log(' Seeding completed!');
}

main()
  .catch((e) => {
    console.error(' Seeding failed:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // ปิด Connection เมื่อเสร็จสิ้น
    await prisma.$disconnect();
    await pool.end();
  });
