# 🔄 System Lifecycle: เจาะลึกการเดินทางของระบบ (แบบแยกส่วนให้เข้าใจง่าย)

เพื่อให้เห็นภาพที่ชัดเจนที่สุดและไม่ปวดหัวกับ "เส้นที่พันกันยุ่งเหยิง" เราจะซอยย่อยระบบออกเป็น 3 ส่วนหลัก ได้แก่ **1. ด่านหน้า (Global Pipeline)**, **2. โครงสร้างหลัก (Core Architecture)**, และ **3. สถานการณ์จำลอง (Sequence Flow)** ครับ

---

## 1️⃣ ด่านหน้า: Global Request Pipeline
นี่คือสิ่งที่เกิดขึ้น **"ก่อนที่ข้อมูลจะไปถึง Controller"** ระบบจะทำการกรองและตรวจสอบความปลอดภัยเป็นลำดับชั้น (เรียงจากบนลงล่าง):

```mermaid
flowchart TD
    Client(("🧑‍💻 ลูกค้า / Client"))
    
    subgraph Security ["🛡️ ด่านที่ 1: Security & Observability"]
        direction TB
        H["Helmet<br>(ใส่เกราะกันแฮก)"]
        T["Throttler<br>(จำกัดคิว กันสแปม)"]
        L["Pino Logger<br>(บันทึกประวัติการเข้าออก)"]
        H --> T --> L
    end
    
    subgraph GuardsPipes ["🛂 ด่านที่ 2: Validation & Auth"]
        direction TB
        G{"Auth Guard<br>(ตรวจบัตร JWT)"}
        C{"Cache Interceptor<br>(เช็คว่าเคยถามคำถามนี้ไหม?)"}
        P{"Validation Pipe<br>(ตรวจแบบฟอร์ม DTO)"}
        G --> C --> P
    end
    
    Client --> H
    L --> G
    
    G -- "ไม่มีบัตร / บัตรปลอม" --> E401["❌ 401 Unauthorized"]
    C -- "มีข้อมูลในความจำ" --> Res(("📩 ส่งข้อมูลกลับทันที"))
    P -- "กรอกฟอร์มผิดรูปแบบ" --> E400["❌ 400 Bad Request"]
    
    P -- "ผ่านทุกด่าน" --> Ctrl["👩‍💼 Controller (แผนกต้อนรับ)"]
```

---

## 2️⃣ โครงสร้างหลัก: Core Architecture (CQRS & Hexagonal)
เมื่อคำสั่งทะลุด่านหน้ามาถึง **Controller** นี่คือภาพรวมการทำงานของ "แก่นของแอปพลิเคชัน (Domain)" ที่แยกส่วนประกอบต่างๆ ออกจากกันอย่างเด็ดขาด (อ่านจากซ้ายไปขวา):

```mermaid
flowchart LR
    Ctrl["👩‍💼 Controller<br>(แผนกต้อนรับ)"]
    
    subgraph CQRS ["🔀 CQRS (ผู้แจกแจงงาน)"]
        direction TB
        CBus["Command Bus<br>(สายงานเขียนข้อมูล)"]
        QBus["Query Bus<br>(สายงานอ่านข้อมูล)"]
    end
    
    subgraph Domain ["⚙️ Business Logic (สมองของระบบ)"]
        direction TB
        CH["Command Handler<br>(คนสร้าง/ลบ/แก้)"]
        QH["Query Handler<br>(คนค้นหาข้อมูล)"]
    end
    
    subgraph Ports ["🔌 Ports (เต้าเสียบ Interface)"]
        direction TB
        IRepo["ITaskRepository<br>(พอร์ตเซฟข้อมูล)"]
        IAPI["IExternalAPI<br>(พอร์ตต่อเน็ต)"]
    end
    
    subgraph Adapters ["🔌 Adapters (หัวปลั๊กเครื่องมือจริง)"]
        direction TB
        Prisma["Prisma Adapter<br>(คุยกับ SQL)"]
        Http["Http Adapter<br>(คุยกับ API ชาวบ้าน)"]
    end
    
    Ctrl --> CBus & QBus
    CBus --> CH
    QBus --> QH
    
    CH --> IRepo & IAPI
    QH --> IRepo
    
    IRepo -. "Implement" .-> Prisma
    IAPI -. "Implement" .-> Http
    
    Prisma <--> DB[("💾 PostgreSQL / Redis")]
    Http <--> Ext["🌍 External API"]
```

---

## 3️⃣ สถานการณ์จำลอง (Sequence Diagrams)

เพื่อให้เห็นภาพเวลาทำงานจริงว่า "ใครคุยกับใครก่อนหลัง" เรามาดู **3 สถานการณ์ยอดฮิต** ที่เกิดขึ้นในระบบของเรากันครับ:

### Flow A: การสร้างงานใหม่ (มี Circuit Breaker ป้องกัน API ล่ม)
**สถานการณ์:** ลูกค้าส่งคำสั่ง `POST /tasks` เพื่อสร้างงานใหม่ ซึ่งเราต้องไปขอ "คำคม (Inspiration)" จากเว็บอื่นมาแปะไว้ด้วย

```mermaid
sequenceDiagram
    autonumber
    actor C as 🧑‍💻 Client
    participant Ctrl as 👩‍💼 Controller
    participant Bus as 🔀 Command Bus
    participant H as ⚙️ CreateTaskHandler
    participant API as 🔌 HttpAdapter (Opossum)
    participant Repo as 🔌 PrismaAdapter
    
    C->>Ctrl: POST /tasks
    Ctrl->>Bus: โยนคำสั่ง (CreateTaskCommand)
    Bus->>H: จ่ายงานให้ Handler
    
    Note right of H: 💡 1. เริ่มไปดึงคำคมจากเน็ต
    H->>API: getInspiration()
    
    alt 🟢 API ภายนอกทำงานปกติ
        API-->>H: "Just do it!" (ได้คำคม)
    else 🔴 API ภายนอกค้าง/ล่ม (Circuit Open)
        API-->>H: ❌ สะพานไฟตัด (Fail Fast) โดยไม่รอให้ระบบเราค้าง
    end
    
    Note right of H: 💾 2. นำข้อมูลทั้งหมดไปเซฟลง DB
    H->>Repo: create(Task + Inspiration)
    Repo-->>H: ยืนยันการเซฟสำเร็จ
    
    H-->>Bus: งานเสร็จแล้ว
    Bus-->>Ctrl: ส่งข้อมูลกลับ
    Ctrl-->>C: 📩 201 Created (สำเร็จ!)
```

### Flow B: การดึงข้อมูลที่มีแคช (Cache Hit & Query Flow)
**สถานการณ์:** ลูกค้าเรียกดูรายการ Task (`GET /tasks`) ซึ่งข้อมูลนี้เคยถูกดึงไปแล้วเมื่อ 5 วินาทีก่อน

```mermaid
sequenceDiagram
    autonumber
    actor C as 🧑‍💻 Client
    participant Cache as 🧠 Cache Interceptor
    participant Ctrl as 👩‍💼 Controller
    participant Bus as 🔀 Query Bus
    participant H as ⚙️ GetTasksHandler
    participant Repo as 🔌 PrismaAdapter
    
    C->>Cache: GET /tasks
    
    alt ⚡ จำได้ (มีใน Redis Cache)
        Cache-->>C: 📩 ส่งข้อมูลกลับทันที (ไม่กวน Controller เลย)
    else 🐢 จำไม่ได้ (แคชหมดอายุ / ไม่มีแคช)
        Cache->>Ctrl: ปล่อยผ่านให้เข้าสู่ระบบ
        Ctrl->>Bus: โยนคำสั่ง (GetTasksQuery)
        Bus->>H: จ่ายงานให้ Handler
        
        H->>Repo: findAll()
        Repo-->>H: ข้อมูล Tasks
        
        H-->>Bus: งานเสร็จแล้ว
        Bus-->>Ctrl: ส่งข้อมูลกลับ
        Ctrl->>Cache: ขอส่งให้ลูกค้า
        
        Note right of Cache: 🧠 แอบจดจำข้อมูลลง Redis (TTL 60 วิ)
        Cache-->>C: 📩 200 OK (ส่งข้อมูลรอบแรก)
    end
```

### Flow C: การจัดการเมื่อเจอข้อผิดพลาด (Exception Handling)
**สถานการณ์:** ลูกค้าพยายามค้นหา Task ที่ไม่มีอยู่จริงในฐานข้อมูล

```mermaid
sequenceDiagram
    autonumber
    actor C as 🧑‍💻 Client
    participant Ctrl as 👩‍💼 Controller
    participant H as ⚙️ Handler
    participant Repo as 🔌 PrismaAdapter
    participant Filter as 🚑 Exception Filter
    
    C->>Ctrl: GET /tasks/999
    Ctrl->>H: ขอข้อมูล Task ID: 999
    H->>Repo: findById(999)
    
    Note right of Repo: ❌ หาไม่เจอใน Database
    Repo-->>H: return null
    
    H-->>Ctrl: 💣 throw NotFoundException("Task not found")
    
    Note right of Filter: 🚑 Filter ดักจับ Error ไว้ไม่ให้แอปแครช
    Ctrl-->>Filter: โยน Exception ให้จัดการ
    Filter-->>C: 📩 404 Not Found (แปลงเป็น JSON สวยงาม)
```
