'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Download,
  BookOpen,
  ExternalLink,
  Copy,
  Check,
  FileText,
  Smartphone,
  Eye,
  X,
  Loader2,
  Printer
} from 'lucide-react';

interface DownloadOptionsProps {
  orderId: string;
  bookTitle?: string;
  variant?: 'full' | 'compact' | 'reader';
}

export function DownloadOptions({
  orderId,
  bookTitle = 'E-book',
  variant = 'full',
}: DownloadOptionsProps) {
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const getDownloadUrl = (download: boolean = true) => {
    if (typeof window === 'undefined') {
      return `/api/download?orderId=${encodeURIComponent(orderId)}${download ? '&download=1' : ''}`;
    }
    return `${window.location.origin}/api/download?orderId=${encodeURIComponent(orderId)}${download ? '&download=1' : ''}`;
  };

  // 1. Direct Blob Download (Fetches stream in JS, triggers download without target="_blank")
  const handleDirectDownload = async () => {
    setDownloading(true);
    setStatusMessage('กำลังสร้างและเตรียมไฟล์ PDF...');
    try {
      const url = `/api/download?orderId=${encodeURIComponent(orderId)}&download=1`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`ดาวน์โหลดไม่สำเร็จ (${res.status})`);
      }
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const tempLink = document.createElement('a');
      tempLink.href = blobUrl;
      tempLink.download = `Ebook-${orderId}.pdf`;
      // DO NOT set target="_blank" so WebView doesn't discard it
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 10000);
      setStatusMessage('เริ่มดาวน์โหลดไฟล์แล้ว!');
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      console.error(err);
      setStatusMessage('ไม่สามารถดาวน์โหลดตรงในแอปได้ แนะนำเลือก "เปิดในเบราว์เซอร์มือถือ" ด้านล่าง');
    } finally {
      setDownloading(false);
    }
  };

  // 2. Open in External Browser (Chrome / System Browser) via Android Intent Scheme
  const handleOpenExternalBrowser = () => {
    if (typeof window === 'undefined') return;
    const downloadPath = `/api/download?orderId=${encodeURIComponent(orderId)}&download=1`;
    const fullUrl = window.location.origin + downloadPath;

    // Check if running on Android
    const isAndroid = /android/i.test(navigator.userAgent);
    if (isAndroid) {
      // Use Android Intent to force opening in Chrome or default external browser
      const hostAndPath = window.location.host + downloadPath;
      const intentUrl = `intent://${hostAndPath}#Intent;scheme=https;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;end;`;
      window.location.href = intentUrl;
    } else {
      // Desktop or iOS: navigate directly
      window.location.href = fullUrl;
    }
  };

  // 3. Copy Link to Clipboard
  const handleCopyLink = async () => {
    const fullUrl = getDownloadUrl(true);
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(fullUrl);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = fullUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setStatusMessage('คัดลอกลิงก์สำเร็จ! นำไปวางในเบราว์เซอร์ Chrome บนมือถือเพื่อดาวน์โหลดได้ทันที');
      setTimeout(() => {
        setCopied(false);
        setStatusMessage(null);
      }, 5000);
    } catch (e) {
      alert(`ลิงก์ดาวน์โหลด: ${fullUrl}`);
    }
  };

  // Compact variant (e.g. for header inside Reader)
  if (variant === 'reader') {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 shadow-sm transition-colors"
          title="พิมพ์หรือบันทึกเป็น PDF ลงเครื่อง"
        >
          <Printer className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span className="hidden sm:inline">บันทึกเป็น</span> PDF
        </button>

        <button
          onClick={handleDirectDownload}
          disabled={downloading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-sm transition-colors disabled:opacity-50"
        >
          {downloading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Download className="w-3.5 h-3.5" />
          )}
          <span>โหลดไฟล์ PDF</span>
        </button>

        <button
          onClick={handleOpenExternalBrowser}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-xs font-semibold hover:bg-blue-100 transition-colors"
          title="เปิดในเบราว์เซอร์ภายนอก"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">เปิดใน</span> Chrome
        </button>
      </div>
    );
  }

  // Compact variant for order tracking
  if (variant === 'compact') {
    return (
      <div className="space-y-2">
        <Link
          href={`/read/${encodeURIComponent(orderId)}`}
          className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
        >
          <BookOpen className="w-4 h-4" />
          เปิดอ่าน E-book ทันที (ไม่ต้องโหลดไฟล์)
        </Link>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleDirectDownload}
            disabled={downloading}
            className="py-2.5 px-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
          >
            {downloading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            ดาวน์โหลด PDF
          </button>
          <button
            onClick={handleOpenExternalBrowser}
            className="py-2.5 px-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            เปิดใน Chrome
          </button>
        </div>
        {statusMessage && (
          <p className="text-[11px] text-blue-600 dark:text-blue-400 text-center font-medium animate-pulse">
            {statusMessage}
          </p>
        )}
      </div>
    );
  }

  // Full Variant for Success Page
  const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(
    getDownloadUrl(false)
  )}&embedded=true`;

  return (
    <div className="space-y-4 text-left">
      {/* Primary recommendation: Read in App without downloading */}
      <Link
        href={`/read/${encodeURIComponent(orderId)}`}
        className="w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 text-center"
      >
        <BookOpen className="w-5 h-5" />
        เปิดอ่าน E-book ในแอปทันที (เสถียรที่สุด ไม่ต้องโหลดไฟล์)
      </Link>

      {/* APK / Mobile Download Box */}
      <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-700 space-y-3">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
            ตัวเลือกไฟล์ PDF สำหรับ Mobile APK & อุปกรณ์มือถือ
          </h4>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          หากใช้งานผ่านแอป <strong>.apk (MIT App Inventor)</strong> แนะนำเลือก <strong>"เปิดอ่านผ่าน PDF Viewer ในแอป"</strong> หรือ <strong>"เปิดใน Chrome เพื่อโหลดลงเครื่อง"</strong> เพื่อป้องกันข้อจำกัดของ WebViewer
        </p>

        {statusMessage && (
          <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-200 text-xs font-medium border border-blue-200 dark:border-blue-900">
            {statusMessage}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {/* Button 1: In-App PDF Viewer (Google Docs Viewer) */}
          <button
            type="button"
            onClick={() => setShowPreviewModal(true)}
            className="py-3 px-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-600 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <Eye className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            เปิดอ่าน PDF ทันที (ในแอป)
          </button>

          {/* Button 2: Direct Blob Download */}
          <button
            type="button"
            onClick={handleDirectDownload}
            disabled={downloading}
            className="py-3 px-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-600 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
          >
            {downloading ? (
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            ) : (
              <Download className="w-4 h-4 text-blue-600" />
            )}
            ดาวน์โหลด PDF ลงเครื่อง
          </button>

          {/* Button 3: Force Open in External Browser (Chrome) */}
          <button
            type="button"
            onClick={handleOpenExternalBrowser}
            className="py-3 px-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-600 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <ExternalLink className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            เปิดใน Chrome (ดาวน์โหลดอัตโนมัติ)
          </button>

          {/* Button 4: Copy Direct Download Link */}
          <button
            type="button"
            onClick={handleCopyLink}
            className="py-3 px-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-600 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <Copy className="w-4 h-4 text-amber-600" />
            )}
            {copied ? 'คัดลอกลิงก์สำเร็จ!' : 'คัดลอกลิงก์ดาวน์โหลด PDF'}
          </button>
        </div>
      </div>

      {/* Embedded PDF Viewer Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-4xl h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/80">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span className="font-bold text-sm text-slate-800 dark:text-slate-100 truncate">
                  {bookTitle} (PDF Viewer)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleOpenExternalBrowser}
                  className="px-2.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300 text-xs font-semibold hover:bg-blue-100 flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  เปิดใน Chrome
                </button>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Iframe */}
            <div className="flex-1 w-full bg-slate-100 dark:bg-slate-950 relative">
              <iframe
                src={googleViewerUrl}
                className="w-full h-full border-0"
                title="Ebook PDF Preview"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
