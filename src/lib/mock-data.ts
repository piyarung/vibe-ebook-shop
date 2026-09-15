import { Book, Order } from '@/types';

export const BOOKS_DATA: Book[] = [
  {
    id: 'book-1',
    title: 'Mastering Vibe Coding: สร้างเว็บและโมบายแอปยุคใหม่ด้วย AI',
    author: 'กิตติศักดิ์ พัฒนาการ',
    description: 'เรียนรู้วิธีการทำงานร่วมกับ AI Coding Assistant อย่างมีเป้าหมาย พัฒนาเว็บและแอปตั้งแต่ 0 ถึง Deploy ได้เร็วขึ้น 10 เท่า',
    detail: 'หนังสือเล่มนี้จะพาคุณเจาะลึกกระบวนการ Vibe Coding อย่างเป็นระบบ ไม่ใช่แค่การ prompt สุ่มสี่สุ่มห้า แต่คือการออกแบบสถาปัตยกรรม กำกับ AI ตรวจสอบความถูกต้องของโค้ด และส่งมอบผลงานจริงด้วย Next.js, Supabase และการ Wrap เป็น Mobile App',
    price: 290,
    coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    category: 'AI & Software Engineering',
    pageCount: 280,
    sampleChapter: 'บทที่ 1: กรอบความคิด Vibe Coding และการควบคุมคุณภาพโค้ด\nบทที่ 2: สถาปัตยกรรม Next.js App Router สมัยใหม่\nบทที่ 3: การจัดการ State และ Database RLS บน Supabase\nบทที่ 4: การแปลง Web App สู่ Android Wrapper ด้วย MIT App Inventor',
    filePath: 'ebooks/mastering-vibe-coding.pdf'
  },
  {
    id: 'book-2',
    title: 'Fullstack Next.js & Supabase ฉบับปฏิบัติการจริง',
    author: 'วรวิทย์ เทคโนโลยี',
    description: 'คู่มือพัฒนาเว็บแอปพลิเคชันสมัยใหม่ด้วย Next.js, TypeScript, Tailwind CSS และระบบจัดการฐานข้อมูล Supabase',
    detail: 'ครอบคลุมเทคนิคการสร้าง API Routes, Server Actions, Authentication, Row Level Security (RLS) และการจัดการ Storage สำหรับไฟล์ขนาดใหญ่ พร้อมกรณีศึกษา E-commerce และ SaaS',
    price: 350,
    coverUrl: 'https://images.unsplash.com/photo-1532012164546-f432f2e37271?auto=format&fit=crop&w=800&q=80',
    category: 'Web Development',
    pageCount: 340,
    sampleChapter: 'บทที่ 1: ติดตั้งและวางโครงสร้าง Next.js ให้รองรับ Scale\nบทที่ 2: เชื่อมต่อ Supabase Client & Server Role\nบทที่ 3: ออกแบบฐานข้อมูล Orders และ Transactions\nบทที่ 4: ความปลอดภัยและการตรวจสอบสิทธิ์ด้วย RLS',
    filePath: 'ebooks/fullstack-nextjs-supabase.pdf'
  },
  {
    id: 'book-3',
    title: 'Modern Cloud & Vercel Deployment Guide',
    author: 'ณัฐพงษ์ คลาวด์มาสเตอร์',
    description: 'แนวทางการนำโปรเจกต์ขึ้นสู่ Production อย่างมั่นใจ พร้อมระบบ CI/CD, Environment Variables และ Performance Tuning',
    detail: 'เรียนรู้วิธีการเชื่อมต่อ GitHub กับ Vercel, การจัดการ Environment Variables ทั้งสำหรับ staging และ production, การตรวจสอบ Edge Functions และการ optimize ภาพและ assets',
    price: 240,
    coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
    category: 'DevOps & Cloud',
    pageCount: 220,
    sampleChapter: 'บทที่ 1: พื้นฐาน Cloud Native และ Serverless\nบทที่ 2: GitHub Workflow สู่ Vercel Production\nบทที่ 3: การจัดการ Secret Key และ Security Checklist\nบทที่ 4: การมอนิเตอร์และวิเคราะห์ Logs',
    filePath: 'ebooks/modern-cloud-deployment.pdf'
  },
  {
    id: 'book-4',
    title: 'Android WebView & MIT App Inventor Pro',
    author: 'สมชาย โมบายเดฟ',
    description: 'เปลี่ยนเว็บของคุณให้กลายเป็นแอปพลิเคชันมือถือ Android พร้อมใช้งาน ส่งต่อและเผยแพร่ได้อย่างง่ายดาย',
    detail: 'สอนตั้งแต่การสร้างโปรเจกต์ใน MIT App Inventor การควบคุม WebViewer การจัดการปุ่มย้อนกลับ (Back Navigation) การตั้งค่าความปลอดภัย SSL ไปจนถึงการ Build เป็นไฟล์ .apk และ Export .aia เพื่อนำส่งงาน',
    price: 199,
    coverUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    category: 'Mobile Application',
    pageCount: 190,
    sampleChapter: 'บทที่ 1: ทำความเข้าใจ WebView Wrapper vs Native App\nบทที่ 2: การออกแบบ Screen1 และบล็อกคำสั่ง CanGoBack\nบทที่ 3: การกำหนดเงื่อนไขความปลอดภัย SSL และ Location\nบทที่ 4: การทดสอบบน AI Companion และการ Build APK',
    filePath: 'ebooks/android-webview-guide.pdf'
  }
];

// Fallback in-memory order store for local dev / demo when Supabase isn't configured yet
const globalOrders: Record<string, Order> = {};

export function getLocalBooks(): Book[] {
  return BOOKS_DATA;
}

export function getLocalBookById(id: string): Book | undefined {
  return BOOKS_DATA.find((b) => b.id === id);
}

export function createLocalOrder(customerName: string, customerEmail: string, bookId: string): Order {
  const book = getLocalBookById(bookId);
  if (!book) {
    throw new Error('ไม่พบหนังสือที่ระบุ');
  }

  const orderId = 'ORD-' + Math.random().toString(36).substring(2, 7).toUpperCase() + '-' + Date.now().toString().slice(-4);
  const newOrder: Order = {
    id: orderId,
    customerName,
    customerEmail: customerEmail.trim().toLowerCase(),
    bookId: book.id,
    bookTitle: book.title,
    bookPrice: book.price,
    coverUrl: book.coverUrl,
    status: 'PENDING',
    createdAt: new Date().toISOString()
  };

  globalOrders[orderId] = newOrder;
  return newOrder;
}

export function getLocalOrder(orderId: string): Order | undefined {
  return globalOrders[orderId];
}

export function markLocalOrderPaid(orderId: string): Order | undefined {
  const order = globalOrders[orderId];
  if (!order) return undefined;

  order.status = 'PAID';
  order.paidAt = new Date().toISOString();
  // Simulated temporary signed download URL (expires in 24 hours)
  order.downloadUrl = `/api/download?orderId=${encodeURIComponent(order.id)}&token=${Buffer.from(order.id + ':' + order.customerEmail).toString('base64')}`;
  return order;
}
