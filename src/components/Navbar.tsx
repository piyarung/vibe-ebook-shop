'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BookOpen, History, Menu, X } from 'lucide-react';
import { DemoBadge } from './DemoBadge';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <DemoBadge banner />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-extrabold text-lg sm:text-xl text-slate-900 dark:text-white tracking-tight">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="flex items-center gap-1.5">
            Vibe<span className="text-blue-600">E-Books</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            หน้าร้าน E-book
          </Link>
          <Link href="/track" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5">
            <History className="w-4 h-4" />
            ประวัติการสั่งซื้อ
          </Link>
          <DemoBadge />
        </nav>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-slate-800 dark:text-slate-200 hover:text-blue-600 py-1"
          >
            หน้าร้าน E-book
          </Link>
          <Link
            href="/track"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-slate-800 dark:text-slate-200 hover:text-blue-600 py-1 flex items-center gap-2"
          >
            <History className="w-4 h-4" />
            ประวัติการสั่งซื้อ
          </Link>
        </div>
      )}
    </header>
  );
}
