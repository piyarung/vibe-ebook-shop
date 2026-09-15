# Vibe Coding: E-book Shop (ใบงานที่ 5)

โครงงานระบบร้านค้าจำหน่าย E-book อย่างง่าย (Customer-Facing) สร้างด้วย Next.js (App Router, Tailwind CSS, TypeScript), เชื่อมต่อฐานข้อมูล Supabase และระบบแจ้งเตือนอีเมล Resend พร้อมรองรับการเปิดใช้งานบนสมาร์ตโฟนผ่าน Android WebViewer Wrapper (MIT App Inventor)

---

## สรุปข้อกำหนดและขอบเขตของระบบ (Scope)
- **Customer-Facing เท่านั้น:** พัฒนาเฉพาะหน้าสำหรับผู้ซื้อทั่วไป ไม่รวมระบบ Admin/จัดการหลังบ้าน
- **Mock Payment (DEMO ONLY):** ระบบจำลองการชำระเงินเพื่อทดสอบสถานะคำสั่งซื้อ มีป้ายแจ้งเตือน DEMO ONLY ชัดเจน ห้ามใช้รับเงินจริง
- **ระบบความปลอดภัย (Security & Privacy):**
  - หน้าค้นหา/ติดตามคำสั่งซื้อ (`/track`) บังคับกรอกทั้ง **Order ID** และ **Email** เพื่อป้องกันการเข้าถึงข้อมูลของผู้อื่น
  - ลิงก์ดาวน์โหลดไฟล์ E-book เป็น **Temporary Signed URL** หลังสถานะเปลี่ยนเป็น `PAID`
  - ไม่เก็บ Secret Key หรือ Credentials ลับไว้บนฝั่ง Browser หรือ Git Repository
- **Mobile Wrapper:** ใช้คอมโพเนนต์ `WebViewer` ใน MIT App Inventor โหลด Production URL โดยตรง

---

## โครงสร้างโปรเจกต์ (Project Structure)

```
ebook-shop/
├── .env.example              # ตัวอย่างตัวแปรแวดล้อม
├── .env.local                # ค่า Secrets จริง (ห้าม Commit ขึ้น Git)
├── .gitignore
├── package.json
├── supabase/
│   └── schema.sql            # โค้ด SQL สำหรับสร้างตาราง books, orders, RLS policies
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Layout หลัก พร้อม Navbar และ Banner DEMO ONLY
│   │   ├── page.tsx          # หน้าร้าน (Storefront) แสดงรายการ E-book 4 เล่ม
│   │   ├── book/[id]/        # หน้ารายละเอียดหนังสือและสารบัญ
│   │   ├── checkout/         # หน้ากรอกข้อมูลผู้สั่งซื้อและสรุปยอด
│   │   ├── payment/[orderId]/# หน้าจำลองการชำระเงิน (Mock Payment)
│   │   ├── success/[orderId]/# หน้าแสดงผลการสั่งซื้อสำเร็จ & ลิงก์ดาวน์โหลด
│   │   ├── track/            # หน้าติดตามสถานะคำสั่งซื้อ (Order ID + Email)
│   │   └── api/
│   │       ├── orders/       # API สร้างคำสั่งซื้อ (สถานะเริ่มต้น PENDING)
│   │       ├── pay/          # API เปลี่ยนสถานะเป็น PAID และยิงส่งอีเมล
│   │       ├── track/        # API ตรวจสอบคำสั่งซื้ออย่างปลอดภัย
│   │       └── download/     # API ให้บริการดาวน์โหลดไฟล์ E-book (PDF)
│   ├── components/
│   │   ├── Navbar.tsx        # Responsive navigation bar
│   │   ├── BookCard.tsx      # การ์ดแสดงหนังสือ ปก ราคา รายละเอียด
│   │   └── DemoBadge.tsx     # ป้ายเตือน DEMO ONLY
│   ├── lib/
│   │   ├── mock-data.ts      # ข้อมูลหนังสือและการทำงานสำรอง (Local Fallback)
│   │   ├── supabase.ts       # Supabase Client & Service Role Admin
│   │   └── email.ts          # ระบบส่งอีเมลแจ้งเตือน Resend
│   └── types/
│       └── index.ts          # TypeScript interfaces
```

---

## ขั้นตอนการรันและทดสอบบนเครื่อง (Local Development)

```bash
# 1. ติดตั้ง Dependencies
npm install

# 2. รันโหมด Development
npm run dev

# 3. เปิดเว็บในเบราว์เซอร์
# http://localhost:3000
```

> **หมายเหตุ:** ตัวระบบมี Local Fallback ในตัว ทำให้สามารถทดสอบ Flow การสั่งซื้อ, Mock Payment, และการดาวน์โหลดได้ครบถ้วนทันที แม้ยังไม่ได้ใส่ Credentials ของ Supabase / Resend

---

## การเชื่อมต่อ Supabase (Database & Storage)

1. สมัครหรือเข้าสู่ระบบที่ [Supabase.com](https://supabase.com) แล้วสร้างโปรเจกต์ใหม่
2. ไปที่เมนู **SQL Editor** ใน Supabase แล้วคัดลอกโค้ดจากไฟล์ `supabase/schema.sql` ไปวางและกด **Run**
   - คำสั่งจะสร้างตาราง `books`, `orders`
   - กำหนดนโยบายความปลอดภัย **Row Level Security (RLS)**
   - เพิ่มข้อมูลหนังสือตัวอย่างให้ครบถ้วน
3. ไปที่เมนู **Storage** $\rightarrow$ **New bucket**
   - ตั้งชื่อ Bucket: `ebook-files`
   - ปิดสวิตช์ Public bucket (ให้เป็น **Private Bucket**)
   - อัปโหลดไฟล์ตัวอย่าง (เช่น `mastering-vibe-coding.pdf`)
4. คัดลอกไฟล์ `.env.example` เป็น `.env.local` แล้วใส่ API Keys:
   - `NEXT_PUBLIC_SUPABASE_URL`: Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Project Anon Key (ฝั่ง Client)
   - `SUPABASE_SERVICE_ROLE_KEY`: Service Role Secret Key (ฝั่ง Server เท่านั้น)

---

## การเชื่อมต่อระบบอีเมล (Resend)

1. สมัครบัญชีที่ [Resend.com](https://resend.com)
2. ไปที่ **API Keys** $\rightarrow$ สร้าง API Key แล้วนำมาใส่ใน `.env.local`:
   ```env
   RESEND_API_KEY=re_xxxxxxxxxxxxxxxx
   RESEND_FROM_EMAIL=onboarding@resend.dev
   ```
   *(หมายเหตุ: โดเมนทดสอบ `onboarding@resend.dev` สามารถส่งอีเมลเข้าหาเฉพาะอีเมลที่คุณใช้สมัครบัญชี Resend เท่านั้น)*

---

## การ Deploy ขึ้น Vercel

1. สร้าง GitHub Repository ใหม่ และ Push โค้ดทั้งหมดขึ้น GitHub:
   ```bash
   git add .
   git commit -m "feat: complete vibe coding e-book shop"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```
   *(ตรวจทานว่าไม่มีไฟล์ `.env.local` ติดขึ้นไปเด็ดขาด)*
2. เข้าสู่ [Vercel.com](https://vercel.com) $\rightarrow$ กด **Add New Project** $\rightarrow$ Import Repository จาก GitHub
3. ในส่วน **Environment Variables** บน Vercel ให้เพิ่มตัวแปรให้ครบถ้วน:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `RESEND_API_KEY`
   - `RESEND_FROM_EMAIL`
4. กด **Deploy** จะได้ **Production URL** (เช่น `https://ebook-shop-xxx.vercel.app`)

---

## การทำ Mobile App Wrapper บน Android ด้วย MIT App Inventor

### 1. การตั้งค่าหน้าจอ (Designer)
1. เข้าไปที่ [MIT App Inventor](https://ai2.appinventor.mit.edu) แล้วสร้าง New Project (เช่น `EbookShop`)
2. ที่ **Screen1** ในหน้าต่าง Properties ทางขวามือ:
   - `Title`: ตั้งเป็น `Vibe E-Books` หรือชื่อร้านของคุณ
   - `Sizing`: เลือก **Responsive**
3. ลากคอมโพเนนต์ **WebViewer** จากแท็บ User Interface ด้านซ้ายมาวางบน Screen1
4. ที่ **WebViewer1** ในหน้าต่าง Properties:
   - `Width`: **Fill parent**
   - `Height`: **Fill parent**
   - `HomeUrl`: วาง **Vercel Production URL** (ตัวอย่าง: `https://your-app.vercel.app`)
   - `FollowLinks`: **Checked (true)**
   - `IgnoreSslErrors`: **Unchecked (false)** *(ห้ามเปิด เพื่อความปลอดภัย)*
   - `UsesLocation`: **Unchecked (false)**

### 2. การต่อโค้ดบล็อกจัดการปุ่มย้อนกลับ (Blocks)
สลับไปที่หน้าต่าง **Blocks** ด้านขวาบน:
- ลากบล็อกเหตุการณ์: `when Screen1.BackPressed do`
- ภายในบล็อก ให้ใส่เงื่อนไข:
  ```
  if WebViewer1.CanGoBack then
      call WebViewer1.GoBack
  else
      call close application
  ```
*(การต่อบล็อกนี้จะทำให้เมื่อผู้ใช้กดปุ่ม Back บนมือถือ เว็บจะย้อนกลับหน้าที่แล้ว แทนที่จะเด้งออกจากแอปทันที)*

### 3. การทดสอบและ Build
- **ทดสอบ:** เมนู `Connect` $\rightarrow$ `AI Companion` แล้วสแกน QR Code บนมือถือ
- **สร้างไฟล์ติดตั้ง:** เมนู `Build` $\rightarrow$ `Android App (.apk)` เพื่อดาวน์โหลดไฟล์ `.apk` ติดตั้งบนสมาร์ตโฟน
- **สำรองไฟล์โปรเจกต์:** เมนู `Projects` $\rightarrow$ `Export selected project (.aia) to my computer`

---

## Checklist ตรวจสอบก่อนส่งงาน (ตามใบงานที่ 5)

| ตรวจแล้ว | รายการตรวจสอบ | สถานะในระบบ |
| :---: | :--- | :---: |
| [x] | ออกแบบหน้าจอระบบ (Responsive UI สวยงามทันสมัย) | สมบูรณ์ |
| [x] | หน้าร้านแสดง E-book อย่างน้อย 3 รายการ (ระบบมี 4 รายการ) และใช้งานบนมือถือได้ | สมบูรณ์ |
| [x] | หน้า Checkout สรุปยอดและสร้างสถานะ PENDING ได้ | สมบูรณ์ |
| [x] | หน้า Mock Payment มีคำว่า DEMO ONLY ชัดเจน และเปลี่ยนสถานะเป็น PAID ได้ | สมบูรณ์ |
| [x] | หน้าติดตามคำสั่งซื้อ ตรวจสอบด้วย Order ID + Email เพื่อไม่ให้เปิดเผยข้อมูลผู้อื่น | สมบูรณ์ |
| [x] | แสดงผลการส่งอีเมลและมีกลไกลิงก์ดาวน์โหลดชั่วคราวหลัง PAID | สมบูรณ์ |
| [x] | โครงสร้างพร้อม Deploy บน Vercel และ Git ไม่มี Secret หลุด | สมบูรณ์ |
| [x] | มีขั้นตอนตั้งค่า MIT App Inventor ชัดเจน พร้อมบล็อก CanGoBack | สมบูรณ์ |
