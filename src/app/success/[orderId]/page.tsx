'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { CheckCircle2, Download, Mail, ArrowRight, BookOpen, Clock, ShieldCheck, History } from 'lucide-react';
import { DemoBadge } from '@/components/DemoBadge';

interface PageProps {
  params: Promise<{ orderId: string }>;
}

export default function SuccessPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.orderId;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check order details
    const checkOrder = async () => {
      try {
        const res = await fetch(`/api/download?orderId=${encodeURIComponent(orderId)}`, {
          method: 'HEAD',
        });
        // We can also fetch details or use the download link directly
        setOrder({
          id: orderId,
          downloadUrl: `/api/download?orderId=${encodeURIComponent(orderId)}`,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    checkOrder();
  }, [orderId]);

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-4">
      {/* Success Card */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-3xl flex items-center justify-center mx-auto shadow-md shadow-emerald-500/20">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <span className="inline-block bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
            สถานะ: PAID (ชำระเงินจำลองสำเร็จ)
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            การสั่งซื้อเสร็จสมบูรณ์!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-mono">
            รหัสคำสั่งซื้อ: <strong className="text-slate-800 dark:text-slate-200">{orderId}</strong>
          </p>
        </div>

        {/* Email Delivery Notification Banner */}
        <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 text-left flex items-start gap-3.5 text-xs sm:text-sm text-blue-900 dark:text-blue-300">
          <div className="p-2 rounded-xl bg-blue-600 text-white flex-shrink-0 mt-0.5">
            <Mail className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold">ส่งอีเมลลิงก์ดาวน์โหลดแล้ว</h4>
            <p className="text-xs text-blue-800/80 dark:text-blue-300/80 leading-relaxed">
              ระบบได้ส่งสรุปคำสั่งซื้อและลิงก์ดาวน์โหลดชั่วคราวไปยังอีเมลที่คุณระบุเรียบร้อยแล้ว (หากใช้งาน Resend กับบัญชีทดสอบ โปรดตรวจดูในกล่องจดหมาย หรือ Inbox ของผู้พัฒนา)
            </p>
          </div>
        </div>

        {/* Instant Download Action */}
        <div className="pt-2 space-y-3">
          <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            ดาวน์โหลดไฟล์ E-book ทันทีผ่านเบราว์เซอร์
          </h3>
          <a
            href={`/api/download?orderId=${encodeURIComponent(orderId)}`}
            download
            className="w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
          >
            <Download className="w-5 h-5" />
            ดาวน์โหลดไฟล์ E-book (PDF)
          </a>
          <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            ลิงก์ดาวน์โหลดนี้จะหมดอายุภายใน 24 ชั่วโมง (Temporary Signed Link)
          </p>
        </div>

        <div className="border-t border-slate-100 dark:border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <Link
            href="/track"
            className="hover:text-blue-600 flex items-center gap-1 py-1"
          >
            <History className="w-4 h-4" />
            ดูประวัติการสั่งซื้อทั้งหมด
          </Link>
          <span className="hidden sm:inline text-slate-300">&bull;</span>
          <Link
            href="/"
            className="hover:text-blue-600 flex items-center gap-1 py-1"
          >
            <ArrowRight className="w-4 h-4" />
            กลับสู่หน้าร้าน E-book
          </Link>
        </div>
      </div>
    </div>
  );
}
