'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, 
  ArrowLeft, 
  Download, 
  CreditCard, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ShieldCheck, 
  Lock,
  Mail,
  FileText,
  History
} from 'lucide-react';
import { DemoBadge } from '@/components/DemoBadge';
import { getOrderHistory } from '@/lib/order-storage';
import { Order } from '@/types';

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [resultOrder, setResultOrder] = useState<Order | null>(null);

  // Quick session fill for convenience on this device
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [showRecent, setShowRecent] = useState(false);

  useEffect(() => {
    const list = getOrderHistory();
    setRecentOrders(list);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setResultOrder(null);

    const cleanOrderId = orderId.trim();
    const cleanEmail = email.trim();

    if (!cleanOrderId || !cleanEmail) {
      setErrorMsg('กรุณากรอกทั้งรหัสคำสั่งซื้อและอีเมลเพื่อยืนยันสิทธิ์');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: cleanOrderId,
          email: cleanEmail,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'ไม่พบคำสั่งซื้อ หรืออีเมลไม่ตรงกับคำสั่งซื้อนี้');
      }

      setResultOrder(data.order);
    } catch (err: any) {
      setErrorMsg(err.message || 'ไม่สามารถค้นหาข้อมูลคำสั่งซื้อได้');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRecent = (recent: Order) => {
    setOrderId(recent.id);
    setEmail(recent.customerEmail);
    setErrorMsg('');
    setShowRecent(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          กลับสู่หน้าร้าน E-book
        </Link>
      </div>

      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
            <Search className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            ติดตามสถานะคำสั่งซื้อ
          </h1>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          ตรวจสอบสถานะคำสั่งซื้อ ชำระเงินจำลอง หรือดาวน์โหลดไฟล์ E-book
        </p>
      </div>

      {/* Privacy Guarantee Banner */}
      <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex items-start gap-3 text-xs sm:text-sm text-blue-900 dark:text-blue-200">
        <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold block">ระบบรักษาความเป็นส่วนตัว (Privacy Protected)</span>
          <p className="text-xs text-blue-800/80 dark:text-blue-300/80 leading-relaxed">
            เพื่อความปลอดภัยและป้องกันการเปิดเผยข้อมูลแก่ผู้อื่น ระบบจะไม่แสดงรายการคำสั่งซื้อสาธารณะ คุณต้องระบุทั้ง <strong>รหัสคำสั่งซื้อ (Order ID)</strong> และ <strong>อีเมล</strong> ที่ตรงกันเท่านั้นจึงจะเข้าถึงข้อมูลได้
          </p>
        </div>
      </div>

      {/* Search Form */}
      <form
        onSubmit={handleSearch}
        className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5"
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
            อีเมลที่ใช้สั่งซื้อ (Gmail / Email) <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            required
            placeholder="เช่น your-email@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs flex items-center gap-2.5">
            <Lock className="w-4 h-4 flex-shrink-0 text-red-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              กำลังตรวจสอบข้อมูลและความปลอดภัย...
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              ค้นหาและยืนยันข้อมูลคำสั่งซื้อ
            </>
          )}
        </button>

        {/* Optional quick autofill for current session */}
        {recentOrders.length > 0 && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
            <button
              type="button"
              onClick={() => setShowRecent(!showRecent)}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 font-medium"
            >
              <History className="w-3.5 h-3.5" />
              {showRecent ? 'ซ่อนรายการคำสั่งซื้อล่าสุดบนเครื่องนี้' : `ดึงรหัสที่เคยสั่งซื้อบนเครื่องนี้ (${recentOrders.length} รายการ)`}
            </button>

            {showRecent && (
              <div className="mt-3 text-left bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="text-[11px] text-slate-500 font-semibold">
                  คลิกเพื่อใส่รหัสและอีเมลลงในฟอร์มด้านบนโดยอัตโนมัติ:
                </div>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {recentOrders.map((ro) => (
                    <button
                      key={ro.id}
                      type="button"
                      onClick={() => handleSelectRecent(ro)}
                      className="w-full text-left p-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs transition-colors"
                    >
                      <div>
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{ro.id}</span>
                        <div className="text-[11px] text-slate-500 truncate max-w-[200px] sm:max-w-xs">{ro.bookTitle}</div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ro.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {ro.status}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </form>

      {/* Result Order Card - Only shown when authorized */}
      {resultOrder && (
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border-2 border-emerald-500/30 shadow-xl space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-xs text-slate-400">รหัสคำสั่งซื้อ:</span>
              <h3 className="font-mono font-bold text-xl text-slate-900 dark:text-white">
                {resultOrder.id}
              </h3>
            </div>
            <div>
              {resultOrder.status === 'PAID' ? (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                  <CheckCircle2 className="w-4 h-4" />
                  PAID (ชำระเงินเรียบร้อย)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800">
                  <Clock className="w-4 h-4" />
                  PENDING (รอชำระเงิน)
                </span>
              )}
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500">ชื่อผู้สั่งซื้อ:</span>
              <span className="font-semibold text-slate-900 dark:text-white">{resultOrder.customerName}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500">อีเมลที่แจ้งเตือน:</span>
              <span className="font-semibold text-slate-900 dark:text-white">{resultOrder.customerEmail}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500">รายการหนังสือ E-book:</span>
              <span className="font-semibold text-slate-900 dark:text-white text-right">{resultOrder.bookTitle}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500">ยอดชำระ (จำลอง):</span>
              <span className="font-bold text-blue-600 dark:text-blue-400 text-base">฿{resultOrder.bookPrice?.toLocaleString()}</span>
            </div>
          </div>

          {/* Action based on status */}
          <div className="pt-2">
            {resultOrder.status === 'PAID' ? (
              <div className="space-y-2.5">
                <a
                  href={`/api/download?orderId=${encodeURIComponent(resultOrder.id)}`}
                  download
                  className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
                >
                  <Download className="w-4 h-4" />
                  ดาวน์โหลดไฟล์ E-book (PDF) ทันที
                </a>
                <p className="text-[11px] text-slate-400 text-center">
                  * ลิงก์ดาวน์โหลดมีความปลอดภัยและมีอายุ 24 ชั่วโมง
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                <Link
                  href={`/payment/${encodeURIComponent(resultOrder.id)}`}
                  className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
                >
                  <CreditCard className="w-4 h-4" />
                  เข้าสู่หน้าจำลองชำระเงิน (Mock Payment)
                </Link>
                <p className="text-[11px] text-slate-400 text-center">
                  * เมื่อกดชำระเงิน สถานะจะเปลี่ยนเป็น PAID และสามารถดาวน์โหลดไฟล์ได้ทันที
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
