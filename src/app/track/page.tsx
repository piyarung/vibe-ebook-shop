'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ShieldAlert, ArrowLeft, Download, CreditCard, Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { DemoBadge } from '@/components/DemoBadge';

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [resultOrder, setResultOrder] = useState<any>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setResultOrder(null);

    if (!orderId.trim() || !email.trim()) {
      setErrorMsg('กรุณากรอกทั้งรหัสคำสั่งซื้อและอีเมลเพื่อยืนยันตัวตน');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: orderId.trim(),
          email: email.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'ไม่พบคำสั่งซื้อ หรือข้อมูลอีเมลไม่ตรงกับคำสั่งซื้อ');
      }

      setResultOrder(data.order);
    } catch (err: any) {
      setErrorMsg(err.message || 'เกิดข้อผิดพลาดในการค้นหา');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          กลับสู่หน้าร้าน
        </Link>
      </div>

      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          ติดตามสถานะคำสั่งซื้อ
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          ค้นหาและตรวจสอบสถานะ พร้อมรับลิงก์ดาวน์โหลดสำหรับคำสั่งซื้อของคุณ
        </p>
      </div>

      {/* Search Form */}
      <form
        onSubmit={handleSearch}
        className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
      >
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            รหัสคำสั่งซื้อ (Order ID) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="เช่น ORD-XXXXX-XXXX"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 uppercase font-mono"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            อีเมลที่ใช้สั่งซื้อ <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            required
            placeholder="เช่น somchai@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-[11px] text-slate-400">
            * เพื่อความปลอดภัยและป้องกันการเปิดเผยข้อมูลแก่ผู้อื่น ระบบจำเป็นต้องตรวจสอบความถูกต้องของทั้งรหัสคำสั่งซื้อและอีเมล
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              กำลังค้นหา...
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              ตรวจสอบสถานะ
            </>
          )}
        </button>
      </form>

      {/* Result Card */}
      {resultOrder && (
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-xs text-slate-400">คำสั่งซื้อ:</span>
              <h3 className="font-mono font-bold text-lg text-slate-900 dark:text-white">
                {resultOrder.id}
              </h3>
            </div>
            <div>
              {resultOrder.status === 'PAID' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  PAID (ชำระเงินเรียบร้อย)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800">
                  <Clock className="w-3.5 h-3.5" />
                  PENDING (รอชำระเงิน)
                </span>
              )}
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/50">
              <span className="text-slate-500">ชื่อผู้สั่งซื้อ:</span>
              <span className="font-semibold text-slate-900 dark:text-white">{resultOrder.customerName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/50">
              <span className="text-slate-500">อีเมล:</span>
              <span className="font-semibold text-slate-900 dark:text-white">{resultOrder.customerEmail}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/50">
              <span className="text-slate-500">รายการ E-book:</span>
              <span className="font-semibold text-slate-900 dark:text-white">{resultOrder.bookTitle}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/50">
              <span className="text-slate-500">ยอดเงิน (จำลอง):</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">฿{resultOrder.bookPrice?.toLocaleString()}</span>
            </div>
          </div>

          {/* Action based on status */}
          <div className="pt-2">
            {resultOrder.status === 'PAID' ? (
              <div className="space-y-2">
                <a
                  href={`/api/download?orderId=${encodeURIComponent(resultOrder.id)}`}
                  download
                  className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  ดาวน์โหลดไฟล์ E-book (PDF)
                </a>
                <p className="text-[11px] text-slate-400 text-center">
                  * ลิงก์ดาวน์โหลดมีอายุการใช้งาน 24 ชั่วโมง
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  href={`/payment/${encodeURIComponent(resultOrder.id)}`}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  เข้าสู่หน้าจำลองชำระเงิน (Mock Payment)
                </Link>
                <p className="text-[11px] text-slate-400 text-center">
                  * คลิกเพื่อเปลี่ยนสถานะเป็น PAID และรับลิงก์ดาวน์โหลด
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
