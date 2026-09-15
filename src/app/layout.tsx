import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Vibe Coding: E-book Shop (DEMO ONLY)',
  description: 'ระบบจำลองการสั่งซื้อ E-book สำหรับงานวิชาเลือกสรร โดยใช้ Next.js, Supabase และ Vercel',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-blue-500 selection:text-white">
        <Navbar />
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {children}
        </main>
        <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8 text-center text-xs text-slate-500 dark:text-slate-400">
          <div className="max-w-6xl mx-auto px-4 space-y-2">
            <p className="font-semibold text-slate-700 dark:text-slate-300">
              Vibe Coding: E-book Shop &bull; ใบงานที่ 5
            </p>
            <p>
              ระบบนี้เป็นโครงงานเพื่อการศึกษา สาธิตการเชื่อมต่อ Next.js + Supabase + Resend + Vercel + MIT App Inventor
            </p>
            <p className="text-amber-600 dark:text-amber-400 font-medium">
              * ข้อมูลและการชำระเงินทั้งหมดเป็นการจำลอง (DEMO ONLY) ห้ามโอนเงินจริง
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
