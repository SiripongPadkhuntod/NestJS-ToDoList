# การเรียนรู้ NestJS เบื้องต้น

เอกสารนี้รวบรวมแนวคิดหลักและส่วนประกอบสำคัญของ NestJS เพื่อเป็นพื้นฐานในการทำความเข้าใจและพัฒนาแอปพลิเคชัน

---

# Phase 1 — Foundation (พื้นฐาน NestJS)

## 1.1 NestJS คืออะไร / เปรียบเทียบกับ Express และ Fastify

**NestJS** คือ Framework สำหรับสร้าง Node.js server-side applications ที่มีประสิทธิภาพ ขยายได้ (scalable) และดูแลรักษาง่าย โดยใช้ TypeScript เป็นหลัก (แต่ก็รองรับ JavaScript ปกติ)

จุดเด่นสำคัญของ NestJS คือมันไม่ได้สร้าง HTTP Server ของตัวเองตั้งแต่ศูนย์ แต่ทำหน้าที่เป็น **Abstraction Layer** (ชั้นห่อหุ้ม) ที่ครอบ HTTP Framework ยอดนิยมอย่าง **Express** หรือ **Fastify** ไว้ข้างใต้ ทำให้เราสามารถใช้งานโครงสร้างที่เป็นระเบียบของ NestJS พร้อมกับเลือกเอนจินข้างใต้ที่เหมาะสมกับงานได้

**เปรียบเทียบ 3 ตัวละครหลัก: NestJS, Express, และ Fastify**

1.  **Express**
    *   **เปรียบเสมือน:** "ดินน้ำมัน" หรือกล่องเครื่องมือเปล่าๆ
    *   **ลักษณะเด่น:** เป็นมาตรฐานดั้งเดิม (De facto standard) ของ Node.js มีคอมมูนิตี้ใหญ่มาก แพ็กเกจรองรับเยอะ ให้อิสระสูงสุดในการเขียนโค้ด
    *   **ข้อดี:** เรียบง่าย ยืดหยุ่น หาคำตอบเวลามีปัญหาได้ง่าย
    *   **ข้อเสีย:** ไม่มีโครงสร้างมาตรฐานบังคับ เมื่อโปรเจกต์ใหญ่ขึ้น ถ้าทีมไม่มีวินัย โค้ดจะเละ (Spaghetti code) ได้ง่ายมาก ประสิทธิภาพความเร็วอยู่ในระดับกลางๆ

2.  **Fastify**
    *   **เปรียบเสมือน:** "รถสปอร์ต" ที่เน้นความเร็ว
    *   **ลักษณะเด่น:** เป็น Framework ยุคใหม่ที่ออกแบบมาโดยเน้น **Performance และ Low Overhead** สูงสุด รองรับ Request ได้มากกว่า Express ในเวลาเท่ากัน และมีระบบ Schema-based validation (JSON Schema) ในตัว
    *   **ข้อดี:** เร็วมาก ประสิทธิภาพสูงมาก (เหมาะกับงานที่ต้องการ Throughput สูงๆ หรือ Microservices)
    *   **ข้อเสีย:** คอมมูนิตี้และระบบนิเวศ (Ecosystem) ยังเล็กกว่า Express บางแพ็กเกจของ Express นำมาใช้กับ Fastify ตรงๆ ไม่ได้

3.  **NestJS**
    *   **เปรียบเสมือน:** "ตัวต่อเลโก้ชุดใหญ่พร้อมคู่มือ" หรือ "โครงสร้างตึกที่มีแบบแปลนมาตรฐาน"
    *   **ลักษณะเด่น:** นำเอา Express (ค่าเริ่มต้น) หรือ Fastify มาห่อหุ้มอีกที แล้วเพิ่มระบบสถาปัตยกรรม (Architecture) ที่ชัดเจน (ได้แรงบันดาลใจจาก Angular) เช่น Module, Controller, Service, Dependency Injection
    *   **ข้อดี:**
        *   โค้ดเป็นระบบระเบียบ (Opinionated) ทำให้ทีมใหญ่ทำงานร่วมกันง่าย
        *   ปรับแต่งได้: สามารถสลับเอนจินข้างใต้จาก Express ไปเป็น Fastify ได้ง่ายๆ หากต้องการประสิทธิภาพสูง
    *   **ข้อเสีย:** Learning curve ค่อนข้างสูง (ต้องเรียนรู้คอนเซปต์เยอะ) และมี Overhead เพิ่มขึ้นเล็กน้อยจากตัว Framework เอง

**สรุป:**
หากต้องการอิสระและความเรียบง่าย เลือก **Express**
หากเน้นความเร็วประมวลผลสูงสุดระดับเสี้ยววินาที เลือก **Fastify**
หากต้องการโครงสร้างที่แข็งแรง ยั่งยืน ดูแลรักษาง่ายในระยะยาว ให้ใช้ **NestJS** (โดยสามารถเลือกเสียบ Express หรือ Fastify ไว้ข้างใต้ตามต้องการ)

---

## 1.2 โครงสร้างโปรเจกต์ — ไฟล์ไหนทำอะไร

เมื่อเริ่มต้นโปรเจกต์ NestJS ใหม่ จะมีไฟล์หลักๆ ดังนี้:

*   `src/main.ts`: ไฟล์เริ่มต้น (Entry file) ของแอปพลิเคชัน ใช้สำหรับสร้างอินสแตนซ์ของแอป (bootstrap) และกำหนดพอร์ตที่จะรัน
*   `src/app.module.ts`: โมดูลหลัก (Root module) ของแอปพลิเคชัน เปรียบเสมือนศูนย์กลางที่รวบรวมส่วนต่างๆ ของแอปมาไว้ด้วยกัน
*   `src/app.controller.ts`: คอนโทรลเลอร์หลักที่มี Route พื้นฐาน
*   `src/app.service.ts`: เซอร์วิสหลักที่มี Business logic พื้นฐาน
*   `test/`: โฟลเดอร์สำหรับเก็บไฟล์ทดสอบ (e2e tests)
*   `nest-cli.json`: ไฟล์ตั้งค่าสำหรับ Nest CLI

---

## 1.3 Module — หน่วยพื้นฐาน

**Module** (โมดูล) คือบล็อกพื้นฐานในการสร้างแอปพลิเคชัน NestJS ทำหน้าที่จัดกลุ่มโค้ดที่มีความเกี่ยวข้องกัน (เช่น Controller, Service) เข้าไว้ด้วยกันตามฟีเจอร์การทำงาน (Feature-based)

เราใช้ Decorator `@Module()` ในการกำหนดคลาสให้เป็นโมดูล โดยจะมี properties หลักๆ เช่น:
*   `controllers`: ตัวรับ request ที่อยู่ในโมดูลนี้
*   `providers`: ตัวจัดการ business logic (เช่น Service) ที่จะถูกสร้างด้วย Dependency Injection
*   `imports`: โมดูลอื่นๆ ที่โมดูลนี้ต้องการเรียกใช้
*   `exports`: provider ในโมดูลนี้ที่ต้องการเปิดให้โมดูลอื่น (ที่ import โมดูลนี้ไป) ใช้งานได้

---

## 1.4 Controller — รับ Request / ส่ง Response

**Controller** ทำหน้าที่เป็น "ด่านหน้า" คอยรับ HTTP Requests เข้ามา ประมวลผลเบื้องต้น แล้วส่งต่อให้ Service ทำงาน จากนั้นจึงนำผลลัพธ์ที่ได้ส่งกลับไปเป็น HTTP Response ให้กับผู้ใช้งาน (Client)

ใช้ Decorator `@Controller('path')` ในการกำหนด route prefix ของคอนโทรลเลอร์

**HTTP Method Decorators:**
*   `@Get()`: ดึงข้อมูล (Read)
*   `@Post()`: สร้างข้อมูลใหม่ (Create)
*   `@Put()`: อัปเดตข้อมูลทั้งหมด (Update)
*   `@Delete()`: ลบข้อมูล (Delete)
*   `@Patch()`: อัปเดตข้อมูลบางส่วน

**Decorator สำหรับดึงข้อมูลจาก Request:**
*   `@Param('id')`: ดึงค่าจาก Path Parameter (เช่น `/users/:id`)
*   `@Body()`: ดึงค่าจาก Request Body (มักใช้กับ Post/Put)
*   `@Query('search')`: ดึงค่าจาก Query Parameter (เช่น `/users?search=john`)

---

## 1.5 Service — Business Logic

**Service** คือคลาสที่ทำหน้าที่จัดการ **Business Logic** (กฎเกณฑ์หรือการประมวลผลหลักของแอปพลิเคชัน) คอนโทรลเลอร์ไม่ควรมี logic ที่ซับซ้อน แต่ควรเรียกใช้ Service แทน 

การแยก Service ออกมาทำให้โค้ดเป็นระเบียบ นำไปใช้ซ้ำ (Reusable) ได้ง่าย และทดสอบ (Test) ได้ง่ายขึ้น

Service ใน NestJS มักจะถูกตกแต่งด้วย `@Injectable()` ซึ่งทำให้คลาสนี้สามารถนำไปทำ Dependency Injection ได้

---

## 1.6 Dependency Injection — เชื่อมทุกอย่าง

**Dependency Injection (DI)** คือ Design Pattern อย่างหนึ่ง เป็นกลไกหลักที่ NestJS ใช้จัดการกับการสร้างและการใช้งานอ็อบเจกต์ (Providers/Services)

แทนที่เราจะต้องสร้างอ็อบเจกต์ของ Service ด้วยตัวเอง (`new MyService()`) ใน Controller เราเพียงแค่บอก NestJS ว่าเราต้องการใช้ Service อะไรผ่านทาง Constructor ของ Controller แล้ว NestJS (ผ่านกลไก Inversion of Control - IoC container) จะจัดการสร้างและส่งอินสแตนซ์ของ Service นั้นมาให้เราเองโดยอัตโนมัติ

ข้อดีคือทำให้ลดการผูกมัดกันแน่น (Coupling) ระหว่างคลาส โค้ดยืดหยุ่นและทดสอบได้ง่าย (Mock dependency ได้)

---

## 1.7 DTO — กำหนดรูปร่าง Request

**DTO (Data Transfer Object)** คืออ็อบเจกต์ที่ใช้สำหรับกำหนด "รูปร่าง" (Shape) ของข้อมูลที่จะถูกส่งข้ามกันไปมาระหว่างเน็ตเวิร์ก (เช่น ข้อมูลใน Request Body)

ใน NestJS เรามักสร้าง DTO เป็นคลาส (Class) เพื่อกำหนดว่าข้อมูลที่ส่งเข้ามาเพื่อสร้างหรืออัปเดตควรมีหน้าตาอย่างไร มีฟิลด์อะไรบ้าง และแต่ละฟิลด์เป็นข้อมูลประเภทไหน การใช้คลาสทำให้เรารักษาชนิดข้อมูล (Type) ไว้ได้แม้จะเป็นตอนที่โปรแกรมกำลังทำงาน (Runtime) ซึ่งจะใช้ร่วมกับ Pipe ในการตรวจสอบข้อมูล

---

## 1.8 Pipe & Validation — ตรวจสอบข้อมูล

**Pipe** มีหน้าที่หลัก 2 อย่างคือ:
1.  **Transformation:** แปลงข้อมูลจากรูปแบบหนึ่งไปเป็นอีกรูปแบบหนึ่ง (เช่น แปลงค่า String '1' จากพารามิเตอร์ ให้เป็น Number 1)
2.  **Validation:** ตรวจสอบความถูกต้องของข้อมูล (เช่น ตรวจสอบว่าข้อมูลใน Body ตรงตาม DTO ที่กำหนดหรือไม่) หากข้อมูลไม่ถูกต้อง Pipe จะโยน Error กลับไปหาผู้ใช้ทันที (ตัวอย่างคือ `ValidationPipe`)

การทำ Validation มักใช้ร่วมกับไลบรารี `class-validator` และ `class-transformer` โดยการใส่ Decorator (เช่น `@IsString()`, `@IsNotEmpty()`) ลงใน DTO

---

## 1.9 Exception & Error Handling

NestJS มีชั้น (Layer) สำหรับจัดการ Exception (ข้อผิดพลาด) ที่เรียกว่า **Exception Filter** ซ่อนอยู่ เมื่อแอปพลิเคชันเกิดข้อผิดพลาดที่ไม่ได้ถูกจัดการ (Unhandled exception) ระบบนี้จะจับข้อผิดพลาดนั้นและส่ง Response ที่เป็นมิตรและเป็นมาตรฐานกลับไปให้ผู้ใช้งาน

เราสามารถใช้ Exception คลาสที่ NestJS เตรียมไว้ให้ เช่น `NotFoundException`, `BadRequestException` หรือสร้าง Custom Exception Filter เพื่อจัดการรูปแบบการตอบกลับ error แบบเฉพาะเจาะจงของเราเองก็ได้

---

## 1.10 Middleware

**Middleware** คือฟังก์ชันที่จะถูกเรียกใช้งาน **"ก่อน"** ที่ Request จะเดินทางไปถึง Route handler (Controller)

Middleware สามารถ:
*   รันโค้ดใดๆ ก็ได้
*   ปรับเปลี่ยน Request และ Response object
*   จบการทำงานของ Request-Response cycle (เช่น ส่ง response กลับไปเลยถ้าตรวจสอบสิทธิ์ไม่ผ่าน)
*   เรียกใช้งาน Middleware ตัวถัดไปในระบบ (ผ่านฟังก์ชัน `next()`)

มักใช้กับงานเช่น Logging, การตรวจสอบ Authentication เบื้องต้น (แต่ใน NestJS แนะนำให้ใช้ Guards สำหรับเรื่อง Auth มากกว่า) หรือการแนบข้อมูลเพิ่มเติมเข้าไปใน Request

---

# Phase 2 — Database & Auth

## 2.1 Prisma พื้นฐาน — เชื่อม Database

**Prisma** คือ Next-generation ORM (Object-Relational Mapper) สำหรับ Node.js และ TypeScript ที่ได้รับความนิยมอย่างมากเมื่อใช้คู่กับ NestJS ทำหน้าที่เป็นตัวกลางในการพูดคุยกับฐานข้อมูล (Database) แทนการเขียน SQL query ตรงๆ

**จุดเด่นของ Prisma:**
*   **Type-Safe:** Prisma จะสร้าง Client อัตโนมัติ (Prisma Client) ตาม Schema ที่เรากำหนด ทำให้มี Autocomplete และเช็ค Type error ได้ตั้งแต่ตอนเขียนโค้ด
*   **Prisma Schema:** ใช้ไฟล์ `schema.prisma` เป็นแหล่งความจริงเดียว (Single source of truth) ในการกำหนดโครงสร้าง Database
*   **Prisma Migrate:** มีเครื่องมือจัดการ Database Migration (การเปลี่ยนแปลงโครงสร้างตาราง) ที่ใช้งานง่ายและปลอดภัย

**การใช้งานพื้นฐาน:**
เราจะสร้าง `PrismaService` (สืบทอดมาจาก `PrismaClient`) และทำ Dependency Injection เพื่อให้ Service ต่างๆ นำไปใช้ดึงข้อมูล เช่น `this.prisma.user.findMany()`

---

## 2.2 Entity — แปลง Class เป็น Table

ในบริบทของการใช้ Prisma และสถาปัตยกรรมทั่วไป **Entity** หมายถึงอ็อบเจกต์ที่ใช้เป็นตัวแทน (Representation) ของข้อมูลหนึ่งเรกคอร์ดในฐานข้อมูล

*   **Prisma Model (เสมือน Entity พื้นฐาน):** ในไฟล์ `schema.prisma` เราจะกำหนด `model User { ... }` ซึ่งพรีสมาจะมองสิ่งนี้ว่าเป็นตารางในฐานข้อมูล
*   **NestJS Entity Class:** บางครั้งเราอาจจะสร้าง Class ของ Entity แยกออกมาใน NestJS (เช่น `UserEntity`) เพื่อเป็นจุดศูนย์กลางในการกำหนดว่า หน้าตาข้อมูลของตารางนี้เมื่อดึงมาใช้งานในแอป (หรือส่งกลับไปให้หน้าบ้านผ่าน Controller) จะเป็นอย่างไร
*   **การเชื่อมโยง:** เรามักจะนำ Entity class มาใช้งานร่วมกับ `@nestjs/swagger` หรือเพื่อทำ Serialization (กรองข้อมูลก่อนส่งกลับ เช่น ซ่อนรหัสผ่าน) ผ่านไลบรารี `class-transformer` โดยแปลงผลลัพธ์ที่ได้จาก Prisma ให้กลายเป็น Entity Class เสียก่อน

---

## 2.3 Repository Pattern

**Repository Pattern** เป็น Design Pattern ที่ช่วยแยกชั้นโค้ดส่วนที่มีการดึง/บันทึกข้อมูลในฐานข้อมูล (Data Access Layer) ออกจากส่วนที่เป็นกฎเกณฑ์ทางธุรกิจ (Business Logic / Service)

**ลักษณะการทำงาน:**
1.  **Service:** ไม่เรียกใช้ Prisma ตรงๆ แต่มันจะไปเรียกใช้เมธอดของ `Repository` แทน (เช่น `userRepository.findById(id)`)
2.  **Repository:** เป็นตัวกลางที่คอยคุยกับ Prisma (หรือ ORM ตัวอื่นๆ) โดยตรง เพื่อทำหน้าที่ Query ข้อมูล (CRUD)

**ข้อดี (เมื่อใช้ร่วมกับ NestJS & Prisma):**
*   **ลดความซ้ำซ้อน:** ถ้ามีหลาย Service ที่ต้องการดึงข้อมูลด้วยเงื่อนไขเดียวกัน สามารถเรียกผ่าน Repository ได้
*   **สลับ Database ง่ายขึ้น:** หากในอนาคตเลิกใช้ Prisma ไปใช้ TypeORM แทน เราก็ไปแก้โค้ดแค่ในไฟล์ Repository ส่วนไฟล์ Service และ Controller ยังคงทำงานได้เหมือนเดิมโดยไม่ต้องแก้ (ลดการยึดติด - Decoupling)
*   **ทดสอบง่าย (Testing):** เวลาเขียน Unit Test สำหรับ Service เราสามารถ Mock (จำลอง) ตัว Repository ได้ง่ายมาก

*(หมายเหตุ: Prisma มีลักษณะเป็น Repository ในตัวมันเองอยู่แล้ว (เช่น `prisma.user`) หลายโปรเจกต์จึงเลือกเรียกใช้ Prisma ตรงๆ ใน Service ได้เลยหากไม่ได้ต้องการ Abstract โค้ดให้ซับซ้อนมาก แต่สำหรับสถาปัตยกรรมแบบ Hexagonal การสร้าง Repository แยกจะช่วยรักษาโครงสร้างได้ดีกว่า)*

---

## 2.4 Migration — จัดการ Schema

**Migration** คือการบันทึกประวัติการเปลี่ยนแปลงโครงสร้างฐานข้อมูล (Database Schema) เหมือนเป็นระบบควบคุมเวอร์ชัน (Version Control - คล้าย Git) สำหรับฐานข้อมูล

เมื่อเราเปลี่ยนแปลงไฟล์ `schema.prisma` (เช่น เพิ่มคอลัมน์ใหม่ ลบตาราง) เราจะรันคำสั่ง `npx prisma migrate dev` เพื่อ:
1. สร้างไฟล์ SQL script ที่บันทึกการเปลี่ยนแปลงนั้น
2. นำ SQL script ไปรัน (Apply) ลงในฐานข้อมูลจริงๆ เพื่อให้โครงสร้างอัปเดตตรงกับโค้ด
สิ่งนี้ช่วยให้ทีมสามารถทำงานร่วมกันได้ และป้องกันปัญหา Database ไม่ตรงกันระหว่างเครื่องนักพัฒนาและเซิร์ฟเวอร์บน Production

---

## 2.5 Relation — One-to-Many / Many-to-Many

**Relation** คือการระบุความสัมพันธ์ระหว่างตารางในฐานข้อมูล Prisma ทำให้การจัดการเรื่องนี้ง่ายขึ้นมาก:

*   **One-to-Many (1:N):** ความสัมพันธ์แบบหนึ่งต่อหลาย เช่น ผู้ใช้ 1 คน (User) สามารถมีโพสต์ได้หลายโพสต์ (Post) ใน Prisma เราจะสร้างฟิลด์ `posts Post[]` ในฝั่ง User และ `author User @relation(...)` ในฝั่ง Post
*   **Many-to-Many (M:N):** ความสัมพันธ์แบบหลายต่อหลาย เช่น โพสต์ 1 โพสต์มีได้หลายแท็ก (Tag) และแท็ก 1 แท็กก็อยู่ได้ในหลายโพสต์ Prisma สามารถจัดการตารางเชื่อม (Join table) ให้เราโดยอัตโนมัติ (Implicit) หรือให้เรากำหนดเองก็ได้ (Explicit)

เวลา Query ข้อมูล เราสามารถดึงข้อมูลที่สัมพันธ์กันมาได้ง่ายๆ ด้วยตัวเลือก `include` (เช่น ดึง User พร้อมกับ Post ทั้งหมดของเขา)

---

## 2.6 Transaction

**Transaction** คือชุดของคำสั่งฐานข้อมูลที่ต้องทำงานให้สำเร็จ "ทั้งหมด" หรือ "ยกเลิกทั้งหมด" (All-or-nothing)

ตัวอย่างคลาสสิกคือการโอนเงิน: ตัดเงินจากบัญชี A และเพิ่มเงินเข้าบัญชี B ถ้าขั้นตอนใดขั้นตอนหนึ่งพัง ต้องยกเลิกทั้งหมดเพื่อไม่ให้เงินหายไปในระบบ
ใน Prisma เราใช้ `prisma.$transaction([])` เพื่อรวมชุดคำสั่ง (Queries) หลายๆ ตัวเข้าด้วยกัน หากมีตัวใดตัวหนึ่งล้มเหลว Prisma จะทำการ **Rollback** (ย้อนกลับ) ข้อมูลทั้งหมดให้กลับไปอยู่ในสถานะก่อนเริ่ม Transaction ทันที

---

## 2.7 Guard — ป้องกัน Route

**Guard** ใน NestJS มีหน้าที่หลักคือ "การตัดสินใจว่าจะอนุญาตให้ Request นี้ผ่านเข้าไปทำงานต่อใน Controller หรือไม่" โดยมักจะใช้สำหรับการทำ Authentication และ Authorization

Guard จะถูกเรียกใช้หลังจาก Middleware แต่จะทำงานก่อน Pipe และ Controller เราใช้ Decorator `@UseGuards(MyGuard)` เพื่อแปะไว้ที่ Controller หรือ Method ที่ต้องการป้องกัน หาก Guard return `true` คำขอจะผ่านไปได้ แต่ถ้า return `false` (หรือโยน Exception) NestJS จะปฏิเสธ Request นั้น (มักจะส่งกลับเป็น 401 Unauthorized หรือ 403 Forbidden)

---

## 2.8 JWT Authentication

**JWT (JSON Web Token)** คือมาตรฐานในการส่งข้อมูลอย่างปลอดภัยระหว่างสองฝ่าย (เช่น Client กับ Server) ในรูปแบบ JSON object

**กระบวนการทำงานในแอป (Login Flow):**
1. ผู้ใช้ส่ง Username/Password มาให้ Server
2. Server ตรวจสอบ หากถูกต้อง จะสร้างและเซ็น (Sign) JWT Token (ซึ่งภายในจะมี Payload เช่น User ID หรือ Role) ส่งกลับไปให้ผู้ใช้
3. ในการเรียก API ครั้งต่อไป ผู้ใช้จะต้องแนบ Token นี้มาใน Header (มักจะเป็น `Authorization: Bearer <token>`)
4. Server (โดยใช้ Guard เช่น `JwtAuthGuard`) จะตรวจสอบลายเซ็นของ Token หากถูกต้องและไม่หมดอายุ ก็จะอนุญาตให้เข้าถึง Resource ได้

ใน NestJS มักใช้ร่วมกับโมดูล `@nestjs/jwt` และ `@nestjs/passport`

---

## 2.9 Role-based Authorization

เมื่อเรามีระบบ Authentication (ยืนยันว่าผู้ใช้คือใคร) แล้ว ถัดมาคือ **Authorization** (การตรวจสอบสิทธิ์ว่าผู้ใช้นั้นทำอะไรได้บ้าง)

**Role-based Access Control (RBAC)** เป็นรูปแบบยอดนิยม โดยเราจะกำหนด "บทบาท" (Role) ให้กับผู้ใช้ (เช่น `ADMIN`, `USER`)
ใน NestJS เรามักจะสร้าง:
1. **Custom Decorator:** เช่น `@Roles('admin')` เพื่อระบุว่า Route นี้ต้องการ Role อะไร
2. **RolesGuard:** Guard พิเศษที่จะอ่านค่าจาก Decorator นี้ (ผ่าน `Reflector` class) แล้วนำไปเปรียบเทียบกับ Role ของผู้ใช้ (ซึ่งมักจะถอดรหัสมาจาก JWT) ถ้าตรงกันก็ให้ผ่าน ถ้าไม่ตรงก็ return `false` (403 Forbidden)

---

## 2.10 Config & Environment Variable

**Environment Variables** คือตัวแปรสภาพแวดล้อมที่ใช้เก็บการตั้งค่าต่างๆ ที่อาจเปลี่ยนไปตามสถานที่ที่แอปรันอยู่ (เช่น รันในเครื่องตัวเอง รันบนเซิร์ฟเวอร์ทดสอบ หรือบนเซิร์ฟเวอร์จริง) และใช้เก็บข้อมูลความลับ (เช่น Database Password, JWT Secret) เพื่อไม่ให้ข้อมูลเหล่านี้หลุดเข้าไปใน Source Code (Git)

ใน NestJS เราจะใช้แพ็กเกจ `@nestjs/config` ซึ่งจะทำหน้าที่อ่านไฟล์ `.env`
**ข้อดีของการใช้ ConfigModule ของ NestJS:**
*   สามารถสร้าง Config Service นำไป Inject ใช้ที่ไหนก็ได้ในแอป
*   รองรับการทำ Validation เพื่อตรวจสอบว่ามีตัวแปร .env สำคัญๆ ครบถ้วนและเป็นประเภทที่ถูกต้องหรือไม่ (โดยใช้ร่วมกับ `Joi` หรือ `class-validator`) ก่อนที่แอปจะเริ่มรัน

---
