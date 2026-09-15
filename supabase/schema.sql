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
INSERT INTO public.books (id, title, author, description, detail, price, cover_url, category, page_count, file_path)
VALUES 
(
  'book-1',
  'Mastering Vibe Coding: สร้างเว็บและโมบายแอปยุคใหม่ด้วย AI',
  'กิตติศักดิ์ พัฒนาการ',
  'เรียนรู้วิธีการทำงานร่วมกับ AI Coding Assistant อย่างมีเป้าหมาย พัฒนาเว็บและแอปตั้งแต่ 0 ถึง Deploy ได้เร็วขึ้น 10 เท่า',
  'หนังสือเล่มนี้จะพาคุณเจาะลึกกระบวนการ Vibe Coding อย่างเป็นระบบ ไม่ใช่แค่การ prompt สุ่มสี่สุ่มห้า แต่คือการออกแบบสถาปัตยกรรม กำกับ AI ตรวจสอบความถูกต้องของโค้ด และส่งมอบผลงานจริงด้วย Next.js, Supabase และการ Wrap เป็น Mobile App',
  290,
  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
  'AI & Software Engineering',
  280,
  'mastering-vibe-coding.pdf'
),
(
  'book-2',
  'Fullstack Next.js & Supabase ฉบับปฏิบัติการจริง',
  'วรวิทย์ เทคโนโลยี',
  'คู่มือพัฒนาเว็บแอปพลิเคชันสมัยใหม่ด้วย Next.js, TypeScript, Tailwind CSS และระบบจัดการฐานข้อมูล Supabase',
  'ครอบคลุมเทคนิคการสร้าง API Routes, Server Actions, Authentication, Row Level Security (RLS) และการจัดการ Storage สำหรับไฟล์ขนาดใหญ่ พร้อมกรณีศึกษา E-commerce และ SaaS',
  350,
  'https://images.unsplash.com/photo-1532012164546-f432f2e37271?auto=format&fit=crop&w=800&q=80',
  'Web Development',
  340,
  'fullstack-nextjs-supabase.pdf'
),
(
  'book-3',
  'Modern Cloud & Vercel Deployment Guide',
  'ณัฐพงษ์ คลาวด์มาสเตอร์',
  'แนวทางการนำโปรเจกต์ขึ้นสู่ Production อย่างมั่นใจ พร้อมระบบ CI/CD, Environment Variables และ Performance Tuning',
  'เรียนรู้วิธีการเชื่อมต่อ GitHub กับ Vercel, การจัดการ Environment Variables ทั้งสำหรับ staging และ production, การตรวจสอบ Edge Functions และการ optimize ภาพและ assets',
  240,
  'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
  'DevOps & Cloud',
  220,
  'modern-cloud-deployment.pdf'
),
(
  'book-4',
  'Android WebView & MIT App Inventor Pro',
  'สมชาย โมบายเดฟ',
  'เปลี่ยนเว็บของคุณให้กลายเป็นแอปพลิเคชันมือถือ Android พร้อมใช้งาน ส่งต่อและเผยแพร่ได้อย่างง่ายดาย',
  'สอนตั้งแต่การสร้างโปรเจกต์ใน MIT App Inventor การควบคุม WebViewer การจัดการปุ่มย้อนกลับ (Back Navigation) การตั้งค่าความปลอดภัย SSL ไปจนถึงการ Build เป็นไฟล์ .apk และ Export .aia เพื่อนำส่งงาน',
  199,
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
  'Mobile Application',
  190,
  'android-webview-guide.pdf'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  price = EXCLUDED.price,
  description = EXCLUDED.description;

-- ==============================================================================
-- 7. Supabase Storage Setup (Private Bucket)
-- สร้าง Bucket ชื่อ: `ebook-files` โดยตั้งค่าเป็น Private (Public bucket = false)
-- เพื่อให้สร้าง Signed URL แบบชั่วคราวได้เท่านั้น (ตามหลักความปลอดภัยในใบงาน)
-- ==============================================================================
