'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getLocalBooks } from '@/lib/mock-data';
import { Book } from '@/types';
import { DemoBadge } from '@/components/DemoBadge';
import { saveOrderToHistory } from '@/lib/order-storage';
import { ArrowLeft, ShoppingBag, ShieldAlert, CheckCircle, Loader2 } from 'lucide-react';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialBookId = searchParams.get('bookId');

  const books = getLocalBooks();
  const [selectedBookId, setSelectedBookId] = useState<string>(
    initialBookId && books.some((b) => b.id === initialBookId)
      ? initialBookId
      : books[0]?.id || ''
  );

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedBook = books.find((b) => b.id === selectedBookId) || books[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerName.trim()) {
      setErrorMsg('กรุณากรอกชื่อ-นามสกุลของคุณ');
      return;
    }
    if (!customerEmail.trim() || !customerEmail.includes('@')) {
      setErrorMsg('กรุณากรอกอีเมลที่ถูกต้อง (ระบบจะส่งลิงก์ดาวน์โหลดไปยังอีเมลนี้)');
      return;
    }
    if (!selectedBook) {
      setErrorMsg('กรุณาเลือกหนังสือที่ต้องการสั่งซื้อ');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerName.trim(),
          customerEmail: customerEmail.trim().toLowerCase(),
          bookId: selectedBook.id,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'ไม่สามารถสร้างคำสั่งซื้อได้');
      }

      // Save to client order history so it immediately appears in "ประวัติการสั่งซื้อ"
      saveOrderToHistory({
        id: data.orderId,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim().toLowerCase(),
        bookId: selectedBook.id,
        bookTitle: selectedBook.title,
        bookPrice: selectedBook.price,
        coverUrl: selectedBook.coverUrl,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
      });

      // Redirect to mock payment page with orderId
      router.push(`/payment/${encodeURIComponent(data.orderId)}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          กลับสู่หน้าร้าน
        </Link>
      </div>

      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          สั่งซื้อ E-book & สรุปรายการ
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          กรอกข้อมูลเพื่อสร้างคำสั่งซื้อ จากนั้นจะเข้าสู่ขั้นตอนจำลองการชำระเงิน (Mock Payment)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Form Column */}
        <div className="md:col-span-3 space-y-6">
          <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <h2 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
              ข้อมูลผู้สั่งซื้อ
            </h2>

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                {errorMsg}
              </div>
            )}

            {/* Select Book dropdown */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                เลือกหนังสือที่ต้องการสั่งซื้อ
              </label>
              <select
                value={selectedBookId}
                onChange={(e) => setSelectedBookId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {books.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.title} - ฿{b.price.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>

            {/* Customer Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                ชื่อ-นามสกุล ผู้รับสิทธิ์ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="เช่น สมชาย ใจดี"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Customer Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                อีเมลสำหรับรับลิงก์ดาวน์โหลด <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="เช่น somchai@example.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <p className="text-[11px] text-slate-500">
                * สำคัญ: ต้องเป็นอีเมลที่คุณสามารถเปิดตรวจสอบได้เพื่อดูผลการส่งมอบ E-book
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-sm shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  กำลังสร้างคำสั่งซื้อ (PENDING)...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  ยืนยันการสั่งซื้อ & เข้าสู่หน้าชำระเงิน
                </>
              )}
            </button>
          </form>
        </div>

        {/* Order Summary Column */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              สรุปรายการสั่งซื้อ
            </h3>

            {selectedBook && (
              <div className="flex gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <img
                  src={selectedBook.coverUrl}
                  alt={selectedBook.title}
                  className="w-16 h-22 object-cover rounded-lg shadow border border-slate-200 dark:border-slate-700 flex-shrink-0"
                />
                <div className="flex flex-col justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 line-clamp-2">
                      {selectedBook.title}
                    </h4>
                    <span className="text-slate-400 mt-1 block">
                      รูปแบบ: Digital PDF
                    </span>
                  </div>
                  <div className="font-bold text-blue-600 dark:text-blue-400 text-sm">
                    ฿{selectedBook.price.toLocaleString()}
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex justify-between">
                <span>ราคารวมหนังสือ:</span>
                <span>฿{selectedBook?.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                <span>ส่วนลด DEMO:</span>
                <span>฿0</span>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between font-bold text-base text-slate-900 dark:text-white">
                <span>ยอดสุทธิที่ต้องชำระ:</span>
                <span className="text-blue-600 dark:text-blue-400">
                  ฿{selectedBook?.price.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <DemoBadge />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>
              คำสั่งซื้อจะเริ่มต้นด้วยสถานะ <strong>PENDING</strong> และจะเปลี่ยนเป็น <strong>PAID</strong> เมื่อคุณกดปุ่มจำลองการชำระเงินในขั้นตอนถัดไป
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-slate-500">กำลังโหลดข้อมูลการสั่งซื้อ...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
