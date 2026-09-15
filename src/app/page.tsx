import React from 'react';
import { getLocalBooks } from '@/lib/mock-data';
import { BookCard } from '@/components/BookCard';
import { Sparkles, ShieldCheck, Mail, Smartphone } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const books = getLocalBooks();

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 text-white p-6 sm:p-12 shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Vibe Coding: E-book Shop Workshop 2026
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            คลังหนังสือ E-book ยุค AI <br className="hidden sm:inline" />
            <span className="text-blue-200">สั่งซื้อไว รับไฟล์ทันที</span>
          </h1>
          <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed">
            สัมผัสประสบการณ์การสั่งซื้อ E-book จำลอง เชื่อมต่อฐานข้อมูลระบบคลาวด์ พร้อมระบบชำระเงินจำลอง (Mock Payment) และส่งลิงก์ดาวน์โหลดตรงถึงอีเมลของคุณ
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <a
              href="#catalog"
              className="bg-white text-blue-700 hover:bg-blue-50 font-bold px-6 py-3 rounded-xl shadow-lg transition-all hover:-translate-y-0.5 text-sm"
            >
              เลือกดูหนังสือทั้งหมด ({books.length} เล่ม)
            </a>
            <Link
              href="/track"
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-5 py-3 rounded-xl transition-all text-sm"
            >
              ติดตามคำสั่งซื้อ
            </Link>
          </div>
        </div>

        {/* Decorative background shapes */}
        <div className="absolute right-[-10%] top-[-20%] w-96 h-96 rounded-full bg-blue-400/20 blur-3xl pointer-events-none" />
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none hidden md:block">
          <Smartphone className="w-96 h-96" />
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">รับลิงก์ทางอีเมล</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">เมื่อสถานะเป็น PAID ระบบจะส่งลิงก์ดาวน์โหลดให้ทันที</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Mock Payment ปลอดภัย</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">ระบบจำลองการจ่ายเงิน DEMO ONLY ไม่มีการเรียกเก็บเงินจริง</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">รองรับ Mobile App</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">เปิดใช้งานได้ทั้งเว็บบราวเซอร์ และแอป Android APK</p>
          </div>
        </div>
      </section>

      {/* Book Catalog */}
      <section id="catalog" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              รายการ E-book แนะนำ
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              เลือกเล่มที่คุณสนใจ เพื่อทดลองขั้นตอนการสั่งซื้อและรับไฟล์ E-book
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            ทั้งหมด {books.length} รายการ
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>
    </div>
  );
}
