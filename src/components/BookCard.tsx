'use client';

import React from 'react';
import Link from 'next/link';
import { Book } from '@/types';
import { ShoppingCart, ArrowRight } from 'lucide-react';

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  return (
    <div className="flex flex-col bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300 group">
      {/* Cover Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
        <img
          src={book.coverUrl}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
            {book.category}
          </span>
        </div>
        <div className="absolute bottom-3 right-3">
          <span className="bg-blue-600 text-white font-bold text-sm sm:text-base px-3 py-1 rounded-xl shadow-md">
            ฿{book.price.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
          ผู้แต่ง: {book.author}
        </div>
        <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg line-clamp-2 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {book.title}
        </h3>
        <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm line-clamp-3 mb-4 flex-1">
          {book.description}
        </p>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center gap-2">
          <Link
            href={`/book/${book.id}`}
            className="flex-1 text-center text-xs sm:text-sm font-semibold py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
          >
            ดูรายละเอียด
          </Link>
          <Link
            href={`/checkout?bookId=${book.id}`}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all hover:-translate-y-0.5"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            สั่งซื้อทันที
          </Link>
        </div>
      </div>
    </div>
  );
}
