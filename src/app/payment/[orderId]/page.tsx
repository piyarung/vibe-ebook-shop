'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DemoBadge } from '@/components/DemoBadge';
import { updateOrderStatusInHistory } from '@/lib/order-storage';
import { CreditCard, AlertTriangle, CheckCircle, Loader2, ArrowLeft, ShieldCheck, QrCode } from 'lucide-react';

interface PageProps {
  params: Promise<{ orderId: string }>;
}

export default function MockPaymentPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.orderId;
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSimulatePayment = async () => {
    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'จำลองการชำระเงินไม่สำเร็จ');
      }

      // Update status in local order history
      updateOrderStatusInHistory(orderId, 'PAID', data.order?.downloadUrl);

      // Redirect to success page
      router.push(`/success/${encodeURIComponent(orderId)}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ');
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          ยกเลิก & กลับสู่หน้าร้าน
        </Link>
      </div>

      {/* Prominent Demo Notice */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500 text-amber-900 dark:text-amber-200 space-y-2">
        <div className="flex items-center gap-2 font-black text-base text-amber-600 dark:text-amber-400 uppercase tracking-wider">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>ระบบจำลองการชำระเงิน (DEMO ONLY)</span>
        </div>
        <p className="text-xs sm:text-sm leading-relaxed text-amber-800 dark:text-amber-300">
          หน้านี้เป็นระบบสาธิตสถานะคำสั่งซื้อสำหรับระบบจำลองเท่านั้น <strong>ห้ามโอนเงินจริง</strong> และไม่มีการตัดบัตรเครดิตใด ๆ ทั้งสิ้น
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 text-center">
        {/* Header */}
        <div className="space-y-1">
          <span className="inline-block bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs px-3 py-1 rounded-full font-mono">
            รหัสคำสั่งซื้อ: {orderId}
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white pt-2">
            ขั้นตอนจำลองการชำระเงิน
          </h1>
          <p className="text-xs text-slate-500">
            สถานะปัจจุบัน: <span className="font-bold text-amber-600 dark:text-amber-400">PENDING (รอชำระเงิน)</span>
          </p>
        </div>

        {/* Mock QR / Card illustration */}
        <div className="bg-slate-50 dark:bg-slate-800/40 p-6 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 space-y-3">
          <div className="w-24 h-24 mx-auto rounded-xl bg-white dark:bg-slate-800 p-2 shadow-inner border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center">
            <QrCode className="w-16 h-16 text-slate-700 dark:text-slate-300" />
          </div>
          <div>
            <span className="inline-block bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 font-bold text-xs px-3 py-0.5 rounded-full">
              ห้ามสแกนโอนเงินจริง - DEMO QR
            </span>
            <p className="text-[11px] text-slate-400 mt-1">
              คลิกปุ่มด้านล่างเพื่อทดสอบการเปลี่ยนสถานะเป็น PAID และส่งอีเมลจำลอง
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 text-red-600 text-xs text-left">
            {errorMsg}
          </div>
        )}

        {/* Action Button */}
        <div className="space-y-3 pt-2">
          <button
            onClick={handleSimulatePayment}
            disabled={isLoading}
            className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-black text-base sm:text-lg shadow-lg shadow-emerald-600/25 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                กำลังเปลี่ยนสถานะเป็น PAID & ยิงอีเมล...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                จำลองชำระเงินสำเร็จ (คลิกเพื่อเปลี่ยนเป็น PAID)
              </>
            )}
          </button>

          <p className="text-[11px] text-slate-400">
            * เมื่อคลิก ระบบจะอัปเดตสถานะเป็น PAID และออก Token ลิงก์ดาวน์โหลดชั่วคราว
          </p>
        </div>
      </div>
    </div>
  );
}
