'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Download, CheckCircle2, ShieldCheck, Printer, Share2, Smartphone } from 'lucide-react';
import { getLocalOrder, getLocalBookById, getLocalBooks } from '@/lib/mock-data';
import { DemoBadge } from '@/components/DemoBadge';

import { getOrderHistory } from '@/lib/order-storage';

interface PageProps {
  params: Promise<{ orderId: string }>;
}

export default function EbookReaderPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.orderId;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');

  useEffect(() => {
    // Check local storage history first using safe helper
    try {
      const history = getOrderHistory();
      const found = history.find((o: any) => o.id === orderId);
      if (found) {
        setOrder(found);
        setLoading(false);
        return;
      }
    } catch (e) {
      console.warn('Error reading order from history in reader:', e);
    }

    // Check in-memory store
    const local = getLocalOrder(orderId);
    if (local) {
      setOrder(local);
    } else {
      // Fallback order for viewing
      const books = getLocalBooks();
      setOrder({
        id: orderId,
        customerName: 'ผู้อ่าน E-book',
        bookTitle: books[0]?.title || 'E-book Digital Edition',
        bookId: books[0]?.id || 'book-1',
        status: 'PAID',
      });
    }
    setLoading(false);
  }, [orderId]);

  if (loading) {
    return <div className="p-12 text-center text-slate-500">กำลังโหลดเนื้อหาหนังสือ...</div>;
  }

  const bookInfo = getLocalBookById(order?.bookId || 'book-1') || getLocalBooks()[0];

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      {/* Top navigation */}
      <div className="flex items-center justify-between gap-3">
        <Link
          href={`/success/${encodeURIComponent(orderId)}`}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          ย้อนกลับ
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFontSize(fontSize === 'normal' ? 'large' : 'normal')}
            className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            ขนาดตัวอักษร: {fontSize === 'normal' ? 'ก' : 'ก+'}
          </button>
          <a
            href={`/api/download?orderId=${encodeURIComponent(orderId)}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            เปิดไฟล์ PDF
          </a>
        </div>
      </div>

      {/* Reader Container */}
      <article className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        {/* Cover Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white p-6 sm:p-10">
          <div className="flex flex-col sm:flex-row gap-6 items-center">
            {bookInfo?.coverUrl && (
              <img
                src={bookInfo.coverUrl}
                alt={bookInfo.title}
                className="w-28 sm:w-36 aspect-[3/4] object-cover rounded-xl shadow-2xl border-2 border-white/20 flex-shrink-0"
              />
            )}
            <div className="space-y-2 text-center sm:text-left">
              <span className="inline-block bg-white/20 backdrop-blur-md px-3 py-0.5 rounded-full text-xs font-semibold text-blue-100">
                ดิจิทัล E-book ฉบับเต็ม (Mobile Reader)
              </span>
              <h1 className="text-xl sm:text-3xl font-extrabold leading-tight">
                {bookInfo?.title || order?.bookTitle}
              </h1>
              <p className="text-xs sm:text-sm text-blue-200">
                ผู้แต่ง: <span className="font-semibold text-white">{bookInfo?.author || 'กองบรรณาธิการ'}</span>
              </p>
              <div className="pt-1 flex flex-wrap gap-2 justify-center sm:justify-start">
                <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-0.5 rounded-full font-mono">
                  <CheckCircle2 className="w-3 h-3" />
                  Order: {orderId}
                </span>
                <span className="inline-flex items-center gap-1 bg-blue-500/20 text-blue-200 text-xs px-2.5 py-0.5 rounded-full">
                  <Smartphone className="w-3 h-3" />
                  เปิดอ่านได้ทุกอุปกรณ์
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Book Content Body */}
        <div className={`p-6 sm:p-10 space-y-8 text-slate-800 dark:text-slate-200 ${fontSize === 'large' ? 'text-base leading-relaxed' : 'text-sm leading-relaxed'}`}>
          {/* Chapter 1 */}
          <section className="space-y-3 border-b border-slate-100 dark:border-slate-800 pb-6">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <BookOpen className="w-5 h-5" />
              บทนำ & ภาพรวมเนื้อหา
            </h2>
            <p>
              ยินดีต้อนรับสู่หนังสือ <strong>{bookInfo?.title}</strong> ดิจิทัลอีบุ๊กฉบับนี้ถูกจัดเตรียมให้อ่านได้อย่างสะดวกสบายบนทุกแพลตฟอร์ม ไม่ว่าจะเป็นบนคอมพิวเตอร์, สมาร์ตโฟนผ่านเบราว์เซอร์ หรือเปิดผ่านโมบายแอปพลิเคชัน Android (WebViewer Wrapper)
            </p>
            <p>
              {bookInfo?.detail || bookInfo?.description}
            </p>
          </section>

          {/* Chapter 2 */}
          <section className="space-y-3 border-b border-slate-100 dark:border-slate-800 pb-6">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white text-blue-600 dark:text-blue-400">
              สารบัญและเนื้อหาสำคัญ
            </h2>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800 font-mono text-xs sm:text-sm whitespace-pre-line leading-loose text-slate-700 dark:text-slate-300">
              {bookInfo?.sampleChapter || '1. สถาปัตยกรรมระบบเว็บและแอปพลิเคชัน\n2. การเชื่อมต่อฐานข้อมูลและการรักษาความปลอดภัย\n3. การสร้างระบบ Mock Payment และการแจ้งเตือน\n4. การ Deploy บน Vercel และการทำ Android App Wrapper'}
            </div>
          </section>

          {/* Chapter 3 */}
          <section className="space-y-3 border-b border-slate-100 dark:border-slate-800 pb-6">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white text-blue-600 dark:text-blue-400">
              บทเรียนที่ 1: การทำงานกับระบบ Digital E-book
            </h2>
            <p>
              ในยุคของการพัฒนาซอฟต์แวร์สมัยใหม่ การส่งมอบเนื้อหาดิจิทัลให้แก่ผู้ใช้จำเป็นต้องคำนึงถึงความสะดวกและการเข้าถึงได้ง่าย (Accessibility) การเปิดอ่านผ่านเว็บเบราว์เซอร์หรือแอปพลิเคชันโดยตรงทำให้ผู้ใช้ไม่ต้องกังวลเรื่องแอปอ่าน PDF ภายนอก หรือปัญหาการดาวน์โหลดไฟล์ในระบบจำลอง
            </p>
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-200 space-y-1">
              <strong>ข้อแนะนำสำหรับผู้ใช้ Mobile App:</strong>
              <p>
                ในแอปพลิเคชันที่สร้างด้วย WebViewer ของ MIT App Inventor หน้านี้ได้รับการออกแบบให้แสดงผลเต็มหน้าจอโดยไม่ต้องดาวน์โหลดไฟล์ คุณสามารถเลื่อนอ่านเนื้อหาได้ทันทีและกดปุ่ม Back เพื่อย้อนกลับได้ตลอดเวลา
              </p>
            </div>
          </section>

          {/* End of book / certificate */}
          <div className="pt-4 text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs text-slate-500 font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              ใบอนุญาตการอ่านสำหรับ: {order?.customerName || 'ผู้สั่งซื้อ'} (คำสั่งซื้อ: {orderId})
            </div>
            <p className="text-xs text-slate-400">
              Vibe Coding E-book Shop &bull; ระบบจำลองการสั่งซื้อและอ่านหนังสือออนไลน์
            </p>
          </div>
        </div>
      </article>
    </div>
  );
}
