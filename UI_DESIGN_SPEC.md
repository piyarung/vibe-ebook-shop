# เอกสารการออกแบบหน้าจอระบบ (UI/UX Design Specification)
## โครงงาน: Vibe Coding: E-book Shop (ใบงานที่ 5)

---

### 1. บทนำและแนวคิดการออกแบบ (Design Overview)
การออกแบบหน้าจอระบบ **Vibe Coding: E-book Shop** มุ่งเน้นการใช้งานบนอุปกรณ์พกพาเป็นหลัก (**Mobile-First Design**) เพื่อให้สอดคล้องกับการใช้งานผ่านสมาร์ตโฟนและแอปพลิเคชัน Android WebViewer (MIT App Inventor) โดยมีเกณฑ์การออกแบบสำคัญดังนี้:
1. **Clear Customer Journey:** ขั้นตอนการสั่งซื้อกระชับ ไม่ซับซ้อน (Storefront $\rightarrow$ Checkout $\rightarrow$ Mock Payment $\rightarrow$ Success & Reading)
2. **Safety & Transparency:** ป้ายแจ้งเตือน **DEMO ONLY** มองเห็นชัดเจนในทุกหน้าที่เกี่ยวข้องกับการชำระเงิน
3. **Accessibility & Responsive:** ขนาดตัวอักษรและปุ่มกด (Touch Targets) เหมาะสมกับการใช้นิ้วสัมผัสบนมือถือ มีระยะห่างที่ได้มาตรฐาน
4. **Privacy by Design:** หน้าค้นหาและติดตามสถานะคำสั่งซื้อต้องยืนยันตัวตนด้วย Order ID และ Email เสมอ

---

### 2. บอร์ดภาพร่างการออกแบบ (Figma UI/UX Design Boards)

#### ภาพที่ 1: บอร์ดออกแบบขั้นตอนการสั่งซื้อบนมือถือ (Mobile User Flow Board)
แสดงหน้าจอหลัก 4 ขั้นตอนบนสมาร์ตโฟน: หน้าร้านค้า $\rightarrow$ Checkout $\rightarrow$ จำลองชำระเงิน $\rightarrow$ หน้าสำเร็จและเปิดอ่าน
- ตำแหน่งไฟล์ภาพ: `docs/ui-design/figma_mobile_user_flow.jpg`

![Figma Mobile User Flow Board](docs/ui-design/figma_mobile_user_flow.jpg)

---

#### ภาพที่ 2: บอร์ดระบบการออกแบบและหน้าจอเสริม (Design System & Desktop/Modal Board)
แสดงระบบสี (Color Palette), ลำดับชั้นฟอนต์ (Typography), หน้าร้านค้าบนคอมพิวเตอร์, หน้าติดตามคำสั่งซื้อ (Privacy Protection) และหน้าต่าง E-book Reader
- ตำแหน่งไฟล์ภาพ: `docs/ui-design/figma_desktop_and_design_system.jpg`

![Figma Design System Board](docs/ui-design/figma_desktop_and_design_system.jpg)

---

### 3. ระบบการออกแบบ (Design System Standards)

#### 3.1 จานสีหลัก (Color Palette)
- **Primary Brand (Blue):** `#2563EB` (Tailwind `blue-600`) - ใช้กับปุ่ม Call to Action, ลิงก์ และหัวข้อสำคัญ
- **Accent / Highlight (Indigo / Violet):** `#4F46E5` (Tailwind `indigo-600`) - เสริมความพรีเมียมของหมวดหมู่หนังสือเทคโนโลยี
- **Warning / Demo Alert (Amber / Yellow):** `#F59E0B` (Tailwind `amber-500`) และ `#FEF08A` (Tailwind `yellow-200`) - สำหรับป้ายเตือน **DEMO ONLY: ห้ามโอนเงินจริง**
- **Success / Paid Status (Emerald):** `#10B981` (Tailwind `emerald-500`) - สำหรับสถานะคำสั่งซื้อ `PAID` และการยืนยันความปลอดภัย
- **Surface & Background:**
  - Light Mode: พื้นหลังขาวสะอาด `#FFFFFF`, การ์ดข้อมูล `#F8FAFC` (Slate 50), เส้นขอบ `#E2E8F0` (Slate 200)
  - Dark Mode: พื้นหลัง `#0F172A` (Slate 900), การ์ดข้อมูล `#1E293B` (Slate 800)

#### 3.2 ลำดับชั้นตัวอักษร (Typography Hierarchy)
- **Font Family:** `Inter`, `Noto Sans Thai`, sans-serif
- **Heading 1 (Main Hero Title):** ขนาด 30-36px, Weight: Bold (700-800)
- **Heading 2 (Section Title):** ขนาด 20-24px, Weight: Bold (700)
- **Heading 3 (Book Title / Card Title):** ขนาด 16-18px, Weight: Semi-Bold (600)
- **Body Text (Paragraph / Description):** ขนาด 14-16px, Weight: Regular (400), Line-Height: 1.6
- **Caption / Meta / Badge:** ขนาด 11-12px, Weight: Medium (500)

---

### 4. รายละเอียดโครงสร้างหน้าจอหลักทั้ง 5 หน้า (Screen Specifications)

```
+-----------------------------------------------------------------------------------+
|                                  USER JOURNEY MAP                                 |
+-----------------------------------------------------------------------------------+
|  [Screen 1: หน้าร้าน]  -->  [Screen 2: Checkout]  -->  [Screen 3: Mock Payment]   |
|         |                                                      |                  |
|         v                                                      v                  |
|  [Screen 5: ติดตามผล]  <----------------------------  [Screen 4: Success/Reader] |
+-----------------------------------------------------------------------------------+
```

#### หน้าที่ 1: หน้าร้านค้าและแคตตาล็อกหนังสือ (`/`)
- **Header:** โลโก้ร้าน Vibe E-book, เมนูค้นหา, ปุ่มไปยังหน้าติดตามคำสั่งซื้อ (`/track`) และปุ่มสลับ Dark/Light Mode
- **Hero Banner:** ข้อความต้อนรับสู่งานจำหน่าย E-book ดิจิทัล พร้อมระบุป้ายเตือนสถานะจำลอง
- **Book Grid (3 เล่มจากแลป 4):**
  - แสดงภาพปกหนังสืออัตราส่วน 3:4
  - ชื่อหนังสือ, ผู้แต่ง, คำอธิบายเนื้อหาย่อ
  - ป้ายราคาเป็นสกุลเงินไทย (฿199, ฿249, ฿290)
  - ปุ่ม Action: "ดูรายละเอียด" และ "สั่งซื้อด่วน"

#### หน้าที่ 2: หน้าสั่งซื้อและสรุปรายการ (`/checkout`)
- **Order Summary Card:** แสดงปกหนังสือที่เลือก, ชื่อเรื่อง, และยอดรวมสุทธิ
- **Customer Form:**
  - ช่องกรอก **ชื่อ-นามสกุล**
  - ช่องกรอก **อีเมลสำหรับรับไฟล์ E-book** (พร้อมคำอธิบาย: ระบบจะส่งลิงก์ดาวน์โหลดไปยังอีเมลนี้)
- **Payment Method Preview:** แสดงตัวเลือกชำระเงินจำลอง (PromptPay Mock)
- **CTA Button:** ปุ่ม "ยืนยันการสั่งซื้อ" ขนาดใหญ่ กดง่ายบนจอมือถือ

#### หน้าที่ 3: หน้าจำลองชำระเงิน (`/payment/[orderId]`)
- **Security Warning Banner:** กล่องข้อความสีเหลืองเด่นชัดระบุ **"DEMO ONLY: การจำลองชำระเงินเพื่อการศึกษาเท่านั้น ห้ามโอนเงินจริง"**
- **Order Details:** รหัสคำสั่งซื้อ (`ORD-XXXXX-XXXX`) และยอดชำระ
- **Mock QR Card:** กรอบสี่เหลี่ยมแสดงภาพ QR Code จำลอง
- **Action Button:** ปุ่มสีเขียว **"จำลองชำระเงินสำเร็จ (คลิกเพื่อเปลี่ยนเป็น PAID)"**

#### หน้าที่ 4: หน้าสั่งซื้อสำเร็จและอ่านหนังสือ (`/success/[orderId]`)
- **Status Icon:** ไอคอนติ๊กถูกสีเขียวขนาดใหญ่ พร้อมข้อความ "การสั่งซื้อเสร็จสมบูรณ์! สถานะ: PAID"
- **Delivery Notice:** กล่องสีฟ้าแจ้งเตือนการส่งอีเมลลิงก์ดาวน์โหลด
- **Action Group (สำหรับ Mobile App & Web):**
  - ปุ่มหลัก: **"เปิดอ่าน E-book ในแอปทันที"** (นำไปยัง `/read/[orderId]`)
  - ปุ่มรอง: **"เปิดอ่าน PDF ทันที (ในแอป)"** (เปิด Modal Google Docs Viewer)
  - ปุ่มตัวช่วย: **"เปิดใน Chrome"** เพื่อเริ่มดาวน์โหลดไฟล์ PDF เข้าเครื่องอัตโนมัติ
  - ปุ่ม **"คัดลอกลิงก์ดาวน์โหลด"**

#### หน้าที่ 5: หน้าค้นหาและติดตามสถานะคำสั่งซื้อ (`/track`)
- **Privacy Gate:** ฟอร์มบังคับกรอกข้อมูลคู่กัน ได้แก่ **Order ID** และ **Email**
- **Privacy Check Logic:**
  - หากระบุถูกต้อง: แสดงรายละเอียดคำสั่งซื้อ วันที่ สถานะ PAID และปุ่มเข้าอ่านหนังสือ
  - หากระบุไม่ตรงกัน: ระบบปฏิเสธการแสดงผลทันที เพื่อปกป้องข้อมูลส่วนบุคคลของผู้ซื้อรายอื่น
