# ==========================================
# Stage 1: Build Stage (เตรียมและคอมไพล์โค้ด)
# ==========================================
FROM node:20-alpine AS builder

# ตั้งค่า Directory ทำงาน
WORKDIR /app

# ก็อปปี้ไฟล์ที่เกี่ยวกับการติดตั้ง Package ก่อน (เพื่อใช้ประโยชน์จาก Docker Cache)
COPY package*.json ./
COPY prisma ./prisma/

# ติดตั้ง Dependencies ทั้งหมด (รวม devDependencies เพราะต้องใช้ในการ Build)
RUN npm ci

# ทำการ Generate Prisma Client ใหม่
RUN npx prisma generate

# ก็อปปี้ซอร์สโค้ดที่เหลือทั้งหมด (ยกเว้นที่ระบุใน .dockerignore)
COPY . .

# คอมไพล์ TypeScript ให้กลายเป็น JavaScript (จะไปอยู่ในโฟลเดอร์ dist/)
RUN npm run build

# ==========================================
# Stage 2: Production Stage (เอาเฉพาะของที่จำเป็นไปรันจริง)
# ==========================================
FROM node:20-alpine AS production

WORKDIR /app

# ก็อปปี้ไฟล์ Package และ Prisma
COPY package*.json ./
COPY prisma ./prisma/

# ติดตั้งเฉพาะ Dependencies สำหรับ Production เท่านั้น (--omit=dev ช่วยลดขนาด Image ได้เยอะมาก)
RUN npm ci --omit=dev

# Generate Prisma Client (สำหรับรันบน Production)
RUN npx prisma generate

# ก็อปปี้โฟลเดอร์ dist ที่คอมไพล์เสร็จแล้วจาก Stage 1 มาใช้งาน
COPY --from=builder /app/dist ./dist

# ตั้งค่า Environment ให้อยู่ในโหมด Production
ENV NODE_ENV=production

# ประกาศว่า Container นี้จะเปิดพอร์ต 3000
EXPOSE 3000

# คำสั่งเริ่มต้นตอนรัน Container
CMD ["node", "dist/src/main.js"]
