'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface DemoBadgeProps {
  banner?: boolean;
  className?: string;
}

export function DemoBadge({ banner = false, className = '' }: DemoBadgeProps) {
  if (banner) {
    return (
      <div className={`bg-amber-500 text-slate-950 font-semibold px-4 py-2 text-center text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm ${className}`}>
        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
        <span>
          <strong>DEMO ONLY:</strong> โครงงานนี้เป็นระบบสาธิตการเชื่อมต่อ E-book Shop เท่านั้น ไม่ใช่ร้านค้าจริงและห้ามโอนเงินจริง
        </span>
      </div>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${className}`}>
      <AlertTriangle className="w-3 h-3" />
      DEMO ONLY
    </span>
  );
}
