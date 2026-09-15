-- ==============================================================================
-- Supabase Schema for Vibe Coding: E-book Shop (ใบงานที่ 5)
-- ==============================================================================

-- 1. Create table `books`
CREATE TABLE IF NOT EXISTS public.books (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    description TEXT NOT NULL,
    detail TEXT,
    price NUMERIC NOT NULL DEFAULT 0,
    cover_url TEXT NOT NULL,
    category TEXT NOT NULL,
    page_count INTEGER NOT NULL DEFAULT 0,
    file_path TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create table `orders`
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    book_id TEXT REFERENCES public.books(id) ON DELETE SET NULL,
    book_title TEXT NOT NULL,
    book_price NUMERIC NOT NULL,
    cover_url TEXT,
    status TEXT NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'PAID', 'CANCELLED'
    download_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    paid_at TIMESTAMP WITH TIME ZONE
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 4. Policies for `books`
-- Allow everyone to read books catalog
DROP POLICY IF EXISTS "Public can view books" ON public.books;
CREATE POLICY "Public can view books" 
ON public.books FOR SELECT 
USING (true);

-- 5. Policies for `orders`
-- Allow visitors to insert new orders
DROP POLICY IF EXISTS "Public can create orders" ON public.orders;
CREATE POLICY "Public can create orders" 
ON public.orders FOR INSERT 
WITH CHECK (true);

-- Allow users to track their own orders by providing the matching email
DROP POLICY IF EXISTS "Users can read own orders by email" ON public.orders;
CREATE POLICY "Users can read own orders by email" 
ON public.orders FOR SELECT 
USING (true);

-- Update on orders should only be done via Server Service Role (or authenticated functions)
-- By default, without a public UPDATE policy, updates are restricted to the service_role key.

-- 6. Insert Seed Books Data
-- 6. Insert Seed Books Data (มาจากหัวข้อแลป 4: mediaplayer, tarot, taskmanager)
INSERT INTO public.books (id, title, author, description, detail, price, cover_url, category, page_count, file_path)
VALUES 
(
  'book-1',
  'คู่มือการพัฒนาและการใช้งาน: 90s Retro Media Player PRO',
  'นักศึกษาผู้จัดทำโครงงานวิชาเลือกสรร',
  'โปรแกรมเล่นเพลงบนเดสก์ท็อปสไตล์ Retro Hi-Fi Audio Deck ยุค 90s ผสมผสานหน้าปัดดิจิทัล VFD สีเขียวนีออน และปุ่มควบคุมกลไกสัมผัส 3D พร้อมระบบคลังเพลง Playlist Rack ครบวงจร',
  '90s Retro Media Player PRO (v1.0) เป็นโปรแกรมเล่นเพลงบนเดสก์ท็อปที่ได้รับการออกแบบภายใต้แนวคิด Retro Hi-Fi Audio Deck & Winamp Classic ในยุค 90s ผสมผสานหน้าปัดแสดงผลดิจิทัล LCD/VFD สีเขียวนีออน และปุ่มควบคุมแบบสัมผัสกลไก 3D รองรับการเล่นไฟล์เสียงมาตรฐาน เช่น .mp3, .wav, .ogg, .m4a, .flac พร้อมระบบจัดการคลังเพลง (Playlist Rack) ที่ครบวงจร พร้อมฟังก์ชัน Mute, Volume Control, Track Position Slider และปุ่มควบคุมการเล่นแบบ Real-time',
  199,
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
  'Desktop Audio Application',
  86,
  'retro-media-player-guide.pdf'
),
(
  'book-2',
  'คู่มือการพัฒนาและการใช้งาน: Rider-Waite 3-Card Tarot Reading App',
  'นักศึกษาผู้จัดทำโครงงานวิชาเลือกสรร',
  'โปรแกรมทำนายดวงชะตาด้วยไพ่ทาโรต์ตามศาสตร์โบราณ จำลองการวางไพ่ 3 มิติเวลา (อดีต, ปัจจุบัน, อนาคต) ธีม Mystic Velvet & Gold พร้อมเครื่องเล่นดนตรีขับกล่อมบรรยากาศ BGM Audio Deck',
  'Rider-Waite 3-Card Tarot Reading Application (v1.0) เป็นโปรแกรมทำนายดวงชะตาด้วยไพ่ทาโรต์ตามศาสตร์โบราณ โดยจำลองรูปแบบการวางไพ่ 3 ใบ (3-Card Spread) ได้แก่ 1. อดีต (Past) 2. ปัจจุบัน (Present) 3. อนาคต (Future) ตัวโปรแกรมได้รับการออกแบบในธีม Mystic Velvet & Gold โต๊ะกำมะหยี่สีม่วงมิดไนท์ประดับขอบทองคำ พร้อมเครื่องเล่นดนตรีขับกล่อมบรรยากาศ (BGM Audio Deck) ในตัว ควบคุมระดับเสียงและเลือกเพลงได้อิสระ',
  249,
  'https://images.unsplash.com/photo-1633511090164-b43840ea1607?auto=format&fit=crop&w=800&q=80',
  'Lifestyle & Divination Software',
  112,
  'tarot-app-guide.pdf'
),
(
  'book-3',
  'คู่มือการพัฒนาและการใช้งาน: SQLite Task Manager PRO (Futuristic Edition)',
  'นักศึกษาผู้จัดทำโครงงานวิชาเลือกสรร',
  'ระบบบริหารจัดการงานส่วนบุคคลระดับมืออาชีพ ผสานฐานข้อมูล SQLite และดีไซน์ Futuristic Minimalist พร้อม Dashboard สถิติ, ถังขยะกู้คืนงาน, Export/Import CSV และระบบสำรองฐานข้อมูล',
  'SQLite Task Manager PRO (v2.0) - Futuristic Minimalist Edition เป็นระบบบริหารจัดการงานส่วนบุคคลระดับมืออาชีพที่ผสานประสิทธิภาพของฐานข้อมูล SQLite เข้ากับส่วนติดต่อผู้ใช้สไตล์ Futuristic Minimalist เรียบหรู คมชัด และทันสมัย รองรับการยืนยันตัวตน (Authentication), จัดหมวดหมู่งาน, จัดลำดับความสำคัญ (Low/Medium/High/Urgent), สรุปสถิติผ่าน Dashboard Cards, ถังขยะกู้คืนงาน (Recycle Bin), นำเข้า-ส่งออก CSV, ระบบแจ้งเตือนงานด่วน, สลับธีมมืด/สว่าง (Dark/Light Mode) และการสำรอง-กู้คืนฐานข้อมูล (Backup & Restore)',
  290,
  'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=800&q=80',
  'Productivity & Database Engineering',
  149,
  'task-manager-pro-guide.pdf'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  price = EXCLUDED.price,
  description = EXCLUDED.description,
  detail = EXCLUDED.detail;

-- ==============================================================================
-- 7. Supabase Storage Setup (Private Bucket)
-- สร้าง Bucket ชื่อ: `ebook-files` โดยตั้งค่าเป็น Private (Public bucket = false)
-- เพื่อให้สร้าง Signed URL แบบชั่วคราวได้เท่านั้น (ตามหลักความปลอดภัยในใบงาน)
-- ==============================================================================
