# 🚀 Phase One App (Enterprise-Grade NestJS)

โปรเจกต์นี้เป็นแอปพลิเคชัน NestJS ที่ถูกออกแบบและพัฒนาขึ้นมาด้วยมาตรฐาน **Production-Ready** และ **Enterprise-Grade** อย่างแท้จริง โดยยึดหลักการพัฒนาซอฟต์แวร์ที่ทันสมัย เช่น Hexagonal Architecture, CQRS และ 12-Factor App Methodology

## 🌟 คุณสมบัติเด่น (Key Features)

*   **Hexagonal Architecture (Ports & Adapters):** โครงสร้างที่แยก Core Business Logic ออกจากเครื่องมือภายนอก (Database, API, Storage) อย่างเด็ดขาด ทำให้โค้ดทดสอบได้ง่ายและเปลี่ยนเครื่องมือได้โดยไม่กระทบระบบหลัก
*   **CQRS (Command Query Responsibility Segregation):** แยกเส้นทางการอ่าน (Query) และการเขียน (Command) ข้อมูลออกจากกัน รองรับการขยายสเกลระบบในอนาคต
*   **12-Factor App Ready:** โครงสร้างพร้อมลุย Cloud-Native (Stateless, Configuration via ENV, Logs as Streams)
*   **Resiliency (ความทนทานต่อความล้มเหลว):** ป้องกันระบบล่มด้วย **Circuit Breaker** (Opossum) เมื่อเชื่อมต่อกับ API ภายนอก
*   **Graceful Shutdown:** ระบบสามารถปิดตัวเองได้อย่างปลอดภัย (ดักจับ SIGINT/SIGTERM) ปิด Connection ของ Database และ Redis อย่างหมดจด
*   **Observability:** 
    *   **Logs:** ใช้ `Pino` สำหรับจัดการ Structured JSON Logs แบบรวดเร็วปานสายฟ้า
    *   **Metrics:** มี `Prometheus` Endpoint เพื่อนำข้อมูลไปวาดกราฟบน Grafana
    *   **Health Checks:** ใช้ `@nestjs/terminus` (ตรวจสอบสถานะ DB, Network, Memory)
*   **Security & Rate Limiting:** ปกป้องแอปพลิเคชันด้วย `Helmet` และ `@nestjs/throttler`

## 🛠️ Tech Stack

*   **Framework:** [NestJS](https://nestjs.com/) (TypeScript) - ทำงานอยู่บนเอนจิน **Express** เพื่อความเสถียรและรองรับ Library อย่างครอบคลุม
*   **Database:** PostgreSQL ผ่าน [Prisma ORM](https://www.prisma.io/)
*   **Caching & Queue:** Redis (ผ่าน `BullMQ` และ `CacheManager`)
*   **Storage:** [MinIO](https://min.io/) (S3-Compatible Object Storage)
*   **Authentication:** JWT (JSON Web Tokens) กับ Argon2 (สำหรับการเข้ารหัสรหัสผ่าน)

---

## 🚦 วิธีการติดตั้งและรันโปรเจกต์ (Getting Started)

### 1. ความต้องการของระบบ (Prerequisites)
*   Node.js (v20+)
*   Docker และ Docker Compose

### 2. ติดตั้ง Dependencies
```bash
npm install
```

### 3. ตั้งค่า Environment Variables
ทำการก๊อปปี้ไฟล์ `.env.example` แล้วเปลี่ยนชื่อเป็น `.env` (ค่าพื้นฐานถูกตั้งค่าไว้พร้อมใช้งานสำหรับเครื่อง Local แล้ว)
```bash
cp .env.example .env
```

### 4. รัน Backing Services (Database, Redis, MinIO)
เราใช้ Docker Compose ในการจำลองสภาพแวดล้อมที่จำเป็นทั้งหมด:
```bash
docker-compose up -d
```
*(หากต้องการปิดบริการ ให้รันคำสั่ง `docker-compose down`)*

### 5. ซิงค์ Database Schema (Prisma)
ดันโครงสร้างฐานข้อมูลไปยัง PostgreSQL และสร้าง Prisma Client:
```bash
npx prisma db push
npx prisma generate
```

### 6. รันแอปพลิเคชัน (Development)
```bash
npm run start:dev
```
ตอนนี้ API ของคุณพร้อมให้บริการแล้วที่ `http://localhost:3000`

---

## 🐳 การรันโหมด Production ด้วย Docker

โปรเจกต์นี้มาพร้อมกับ Multi-stage `Dockerfile` ซึ่งรีดขนาดของอิมเมจให้เล็กที่สุดและปลอดภัยที่สุด 

รันคำสั่งด้านล่างเพื่อสร้างคอนเทนเนอร์ของแอปพลิเคชันไปพร้อมๆ กับเซอร์วิสอื่นๆ:
```bash
# การใส่ --profile prod จะไปกระตุ้นให้ docker-compose.yml ทำการบิลด์และรันเซอร์วิส 'api'
docker-compose --profile prod up -d --build
```

---

## 📚 API Documentation (Swagger)

เมื่อเซิร์ฟเวอร์รันอยู่ คุณสามารถเข้าไปดูและทดสอบ API ทั้งหมดได้ผ่านหน้าต่าง Swagger:
👉 **[http://localhost:3000/api/docs](http://localhost:3000/api/docs)**

## 🩺 System Endpoints

*   **Health Check:** `GET /v1/health` (ตรวจสอบว่าแอปยังหายใจอยู่ไหม และต่อ DB/Redis ติดหรือไม่)
*   **Prometheus Metrics:** `GET /metrics` (ข้อมูลดิบสำหรับให้ระบบ Monitoring มาดูดไปทำกราฟ)

---

## 👨‍💻 สำหรับนักพัฒนา (Developer Experience)

โปรเจกต์นี้มีไฟล์ `.vscode` ติดตั้งมาให้แล้ว คุณสามารถใช้คำสั่งลัดจากใน VSCode ได้ทันที:
1. กด `Cmd+Shift+P` (หรือ `Ctrl+Shift+P`)
2. พิมพ์ `Tasks: Run Task`
3. เลือกคำสั่งที่คุณต้องการ เช่น *Start All Services (Docker)*, *Start Dev Server*, หรือ *Prisma Studio* เป็นต้น 
4. สำหรับการ Debug สามารถกดปุ่ม **Run and Debug** ใน VSCode ได้ทันที (มีคอนฟิก `launch.json` ให้แล้ว)
