# คู่มือการตั้งค่า MIT App Inventor และตรวจสอบข้อ 8
## โครงงาน: Vibe Coding: E-book Shop (ใบงานที่ 5)

---

### รายการตรวจสอบข้อ 8: ความพร้อมของระบบ Web และ WebViewer (100% Passed)

| รายการตรวจสอบ | สถานะ | รายละเอียดการทดสอบในระบบ |
| :--- | :---: | :--- |
| **1. ไม่มี Error `getItem`** | **ผ่าน 100%** | มีระบบ `safeGetItem()` และ In-Memory Cache ใน [`src/lib/order-storage.ts`](ebook-shop/src/lib/order-storage.ts) ป้องกันกรณี Android WebView ปิด DOM Storage |
| **2. ไม่มี `target="_blank"`** | **ผ่าน 100%** | ลบแอตทริบิวต์ `target="_blank"` ออกจากลิงก์ทุกจุดในระบบ ทำให้ WebViewer ไม่เพิกเฉยต่อการกดคลิก |
| **3. มี In-App Reader** | **ผ่าน 100%** | หน้า `/read/[orderId]` เปิดอ่านหนังสือฉบับเต็มได้ทันทีในแอป ไม่ต้องดาวน์โหลดไฟล์ PDF |
| **4. บล็อกปุ่ม Back ทำงานถูกต้อง** | **พร้อมใช้งาน** | บล็อก `Screen1.BackPressed` ร่วมกับ Next.js History API ทำให้กดย้อนกลับภายในเว็บได้โดยไม่ออกจากแอปทันที |

---

### 1. การตั้งค่าหน้าจอ Designer ใน MIT App Inventor

ให้เปิดโปรเจกต์ใน [MIT App Inventor](https://ai2.appinventor.mit.edu/) และตรวจสอบ Properties ตามข้อกำหนดของใบงาน (หน้า 5):

#### 1.1 การตั้งค่า `Screen1`
- **AppName:** `Vibe E-book Shop`
- **Title:** `Vibe Coding: E-book Shop`
- **Sizing:** `Responsive` (สำคัญมาก: เพื่อให้หน้าเว็บขยายเต็มความกว้างของหน้าจอมือถือ)

#### 1.2 การตั้งค่า `WebViewer1`
- **Width:** `Fill parent...` (กว้างเต็มจอ)
- **Height:** `Fill parent...` (สูงเต็มจอ)
- **HomeUrl:** ใส่ Vercel Production URL ของคุณ (เช่น `https://vibe-ebook-shop.vercel.app`)
  > [!IMPORTANT]
  > **ห้ามใส่ `localhost` หรือ `127.0.0.1`** เพราะสมาร์ตโฟนไม่สามารถเชื่อมต่อไปยังเครื่องคอมพิวเตอร์ผ่าน localhost ได้
- **FollowLinks:** `true` (ติ๊กถูก)
- **IgnoreSslErrors:** `false` (ห้ามติ๊ก เพื่อความปลอดภัยตามที่ใบงานกำหนด)
- **UsesLocation:** `false` (ไม่ติ๊ก)

---

### 2. การต่อบล็อกคำสั่งควบคุมปุ่มย้อนกลับ (Blocks Editor)

ในการป้องกันไม่ให้แอปปิดตัวลงทันทีเมื่อผู้ใช้กดย้อนกลับ (Back Button บนมือถือ) ให้สลับไปที่หน้า **Blocks** และวางบล็อกดังรูป:

![MIT App Inventor Back Button Blocks](docs/app-inventor/mit_app_inventor_back_blocks.jpg)

#### รายละเอียดบล็อกคำสั่ง:
```blocks
when Screen1.BackPressed do
  if call WebViewer1.CanGoBack then
    call WebViewer1.GoBack
  else
    close application
```

#### แหล่งที่มาของบล็อก:
1. **`when Screen1.BackPressed do`**: เมนูด้านซ้ายคลิกที่ `Screen1` $\rightarrow$ ลากบล็อกสีน้ำตาล `when Screen1.BackPressed` ออกมาวาง
2. **`if ... then ... else`**: เมนูด้านซ้ายคลิกที่ `Control` $\rightarrow$ ลากบล็อกสีฟ้า `if then` ออกมา แล้วกดที่ไอคอนเฟืองสีฟ้าเพื่อเพิ่มเงื่อนไข `else`
3. **`call WebViewer1.CanGoBack`**: คลิกที่ `WebViewer1` $\rightarrow$ ลากบล็อกสีม่วง `call WebViewer1.CanGoBack` ไปต่อที่ช่อง `if`
4. **`call WebViewer1.GoBack`**: คลิกที่ `WebViewer1` $\rightarrow$ ลากบล็อกสีม่วง `call WebViewer1.GoBack` ไปต่อที่ช่อง `then`
5. **`close application`**: คลิกที่ `Control` $\rightarrow$ ลากบล็อกสีฟ้า `close application` ไปต่อที่ช่อง `else`

---

### 3. การทดสอบการทำงานของปุ่มย้อนกลับ (Verification Step)

1. เปิดแอปบนมือถือ (ผ่าน AI Companion หรือติดตั้งไฟล์ `.apk`)
2. หน้าแรกของร้านค้าจะปรากฏขึ้นมา
3. แตะที่หนังสือเล่มใดเล่มหนึ่ง เพื่อเข้าสู่หน้ารายละเอียดหรือหน้าสั่งซื้อ (`/checkout`)
4. **ทดสอบกดย้อนกลับ (Back) ของมือถือ:**
   - **ผลที่ถูกต้อง:** หน้าจอจะย้อนกลับไปยังหน้าร้านค้า (`/`) โดยแอป **ยังคงเปิดอยู่ ไม่เด้งออก**
5. เมื่ออยู่หน้าแรกสุดแล้วกดย้อนกลับอีกครั้ง:
   - **ผลที่ถูกต้อง:** แอปจะปิดตัวลงอย่างนุ่มนวล (`close application`)
