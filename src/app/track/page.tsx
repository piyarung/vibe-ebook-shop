'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getOrderHistory, saveOrderToHistory } from '@/lib/order-storage';
import { Order } from '@/types';
import { 
  History, 
  Search, 
  ArrowLeft, 
  Download, 
  CreditCard, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ShoppingBag,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { DemoBadge } from '@/components/DemoBadge';

export default function OrderHistoryPage() {
  const [historyOrders, setHistoryOrders] = useState<Order[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Search form state for looking up external / other orders
  const [searchOrderId, setSearchOrderId] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [showSearchForm, setShowSearchForm] = useState(false);

  useEffect(() => {
    // Load local order history on mount
    const list = getOrderHistory();
    setHistoryOrders(list);
    setIsLoaded(true);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');

    if (!searchOrderId.trim() || !searchEmail.trim()) {
      setSearchError('กรุณากรอกทั้งรหัสคำสั่งซื้อและอีเมลเพื่อความปลอดภัย');
      return;
    }

    setSearchLoading(true);

    try {
      const res = await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: searchOrderId.trim(),
          email: searchEmail.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'ไม่พบคำสั่งซื้อ หรือข้อมูลอีเมลไม่ตรงกับคำสั่งซื้อ');
      }

      // Add found order to local history so it stays in the list!
      saveOrderToHistory(data.order);
      setHistoryOrders(getOrderHistory());
      setSearchOrderId('');
      setSearchEmail('');
      setShowSearchForm(false);
    } catch (err: any) {
      setSearchError(err.message || 'เกิดข้อผิดพลาดในการค้นหา');
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          กลับสู่หน้าร้าน
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
              <History className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              ประวัติการสั่งซื้อ
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            รายการคำสั่งซื้อทั้งหมดของคุณ สามารถชำระเงินหรือดาวน์โหลด E-book ได้ทันที
          </p>
        </div>

        <button
          onClick={() => setShowSearchForm(!showSearchForm)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors self-start sm:self-auto"
        >
          <Search className="w-3.5 h-3.5" />
          {showSearchForm ? 'ซ่อนแบบฟอร์มค้นหา' : 'ค้นหาคำสั่งซื้ออื่น'}
          {showSearchForm ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Optional Search Form for other orders / teacher evaluation */}
      {showSearchForm && (
        <form
          onSubmit={handleSearch}
          className="bg-white dark:bg-slate-900 p-6 rounded-3xl border-2 border-blue-500/30 shadow-sm space-y-4 animate-in fade-in duration-200"
        >
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <Search className="w-4 h-4 text-blue-600" />
            ค้นหาคำสั่งซื้อ (ด้วยรหัส Order ID และอีเมล)
          </div>
          <p className="text-xs text-slate-500">
            ใช้กรณีสั่งซื้อจากอุปกรณ์อื่น หรือต้องการดึงประวัติคำสั่งซื้อเข้ามายังหน้านี้
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              required
              placeholder="รหัสคำสั่งซื้อ (เช่น ORD-XXXXX-XXXX)"
              value={searchOrderId}
              onChange={(e) => setSearchOrderId(e.target.value)}
              className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs uppercase font-mono focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              required
              placeholder="อีเมลที่ใช้สั่งซื้อ (เช่น test@example.com)"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {searchError && (
            <div className="p-2.5 rounded-lg bg-red-50 dark:bg-red-950/50 text-red-600 text-xs flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{searchError}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={searchLoading}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-xs shadow transition-all flex items-center justify-center gap-2"
          >
            {searchLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
            ค้นหาและเพิ่มลงในประวัติ
          </button>
        </form>
      )}

      {/* Order List */}
      {!isLoaded ? (
        <div className="p-12 text-center text-slate-400 text-sm">
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
          กำลังโหลดประวัติการสั่งซื้อ...
        </div>
      ) : historyOrders.length === 0 ? (
        /* Empty State */
        <div className="bg-white dark:bg-slate-900 p-10 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
              ยังไม่มีประวัติการสั่งซื้อ
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              เมื่อคุณกดสั่งซื้อหนังสือ รายการคำสั่งซื้อจะถูกบันทึกและแสดงที่หน้านี้โดยอัตโนมัติ
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all hover:-translate-y-0.5"
            >
              เลือกดูหนังสือในร้าน
            </Link>
          </div>
        </div>
      ) : (
        /* Orders List */
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>พบทั้งหมด {historyOrders.length} รายการ</span>
            <span>เรียงจากล่าสุดไปเก่าสุด</span>
          </div>

          {historyOrders.map((order) => {
            const isPaid = order.status === 'PAID';
            return (
              <div
                key={order.id}
                className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-4"
              >
                {/* Top Row: Order ID, Date, Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">คำสั่งซื้อ:</span>
                      <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                        {order.id}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      สั่งซื้อเมื่อ: {new Date(order.createdAt).toLocaleString('th-TH')}
                    </div>
                  </div>

                  <div>
                    {isPaid ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        PAID (ชำระแล้ว)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800">
                        <Clock className="w-3.5 h-3.5" />
                        PENDING (รอชำระเงิน)
                      </span>
                    )}
                  </div>
                </div>

                {/* Middle Row: Book Info & Customer */}
                <div className="flex gap-4 items-center">
                  {order.coverUrl && (
                    <img
                      src={order.coverUrl}
                      alt={order.bookTitle}
                      className="w-14 h-20 object-cover rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex-shrink-0"
                    />
                  )}
                  <div className="space-y-1 flex-1 min-w-0">
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                      {order.bookTitle}
                    </h3>
                    <p className="text-xs text-slate-500">
                      ผู้สั่งซื้อ: <strong className="text-slate-700 dark:text-slate-300">{order.customerName}</strong> ({order.customerEmail})
                    </p>
                    <p className="text-xs font-bold text-blue-600 dark:text-blue-400">
                      ยอดเงิน (จำลอง): ฿{order.bookPrice?.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Bottom Row: Actions */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-end gap-2">
                  {isPaid ? (
                    <a
                      href={`/api/download?orderId=${encodeURIComponent(order.id)}`}
                      download
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all hover:-translate-y-0.5"
                    >
                      <Download className="w-4 h-4" />
                      ดาวน์โหลด E-book (PDF)
                    </a>
                  ) : (
                    <Link
                      href={`/payment/${encodeURIComponent(order.id)}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all hover:-translate-y-0.5"
                    >
                      <CreditCard className="w-4 h-4" />
                      ชำระเงินจำลอง (Mock Payment)
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
