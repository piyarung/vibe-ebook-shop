'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getLocalBookById } from '@/lib/mock-data';
import { ArrowLeft, ShoppingCart, BookOpen, Layers, CheckCircle2 } from 'lucide-react';
import { DemoBadge } from '@/components/DemoBadge';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function BookDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const book = getLocalBookById(resolvedParams.id);

  if (!book) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">ไม่พบหนังสือเล่มนี้</h2>
        <p className="text-slate-500 text-sm">หนังสือที่คุณต้องการอาจถูกลบหรือไม่มีอยู่ในระบบ</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700"
        >
          <ArrowLeft className="w-4 h-4" />
          กลับสู่หน้าร้าน
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          กลับสู่หน้าร้าน E-book
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Cover Column */}
        <div className="md:col-span-1 space-y-4">
          <div className="aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800">
            <img
              src={book.coverUrl}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-center space-y-1">
            <DemoBadge />
            <p className="text-xs text-slate-400">รูปแบบไฟล์: PDF (ดาวน์โหลดทันทีหลังชำระเงิน)</p>
          </div>
        </div>

        {/* Info Column */}
        <div className="md:col-span-2 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <span className="inline-block bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-semibold px-3 py-1 rounded-full mb-2">
                {book.category}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                {book.title}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                เขียนโดย: <span className="font-medium text-slate-700 dark:text-slate-300">{book.author}</span>
              </p>
            </div>

            {/* Price Badge */}
            <div className="flex items-baseline gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-500">ราคาพิเศษ (DEMO):</span>
              <span className="text-3xl font-black text-blue-600 dark:text-blue-400">
                ฿{book.price.toLocaleString()}
              </span>
              <span className="text-xs text-slate-400">/ สิทธิ์การดาวน์โหลด</span>
            </div>

            {/* Book specs */}
            <div className="grid grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/30">
                <BookOpen className="w-4 h-4 text-blue-500" />
                <span>จำนวนหน้า: <strong>{book.pageCount} หน้า</strong></span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/30">
                <Layers className="w-4 h-4 text-purple-500" />
                <span>ระบบ: <strong>Digital Download</strong></span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">คำอธิบายหนังสือ</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                {book.detail || book.description}
              </p>
            </div>

            {/* Sample chapters */}
            {book.sampleChapter && (
              <div className="space-y-2 pt-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-base">สารบัญและเนื้อหาย่อ</h3>
                <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed font-mono">
                  {book.sampleChapter}
                </div>
              </div>
            )}
          </div>

          {/* Action button */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
            <Link
              href={`/checkout?bookId=${book.id}`}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-0.5"
            >
              <ShoppingCart className="w-5 h-5" />
              สั่งซื้อเล่มนี้ (฿{book.price.toLocaleString()})
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
