import { NextRequest, NextResponse } from 'next/server';
import { getLocalOrder } from '@/lib/mock-data';
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get('orderId');
  const forceDownload = searchParams.get('download') === '1';

  if (!orderId) {
    return new NextResponse('Invalid order request', { status: 400 });
  }

  let order: {
    id: string;
    customerName: string;
    customerEmail?: string;
    bookTitle: string;
    bookPrice?: number;
    status: string;
  } | null = null;

  const supabaseAdmin = getSupabaseAdmin();
  if (isSupabaseConfigured() && supabaseAdmin) {
    const { data } = await supabaseAdmin
      .from('orders')
      .select('id, customer_name, customer_email, book_title, book_price, status')
      .eq('id', orderId)
      .single();
    if (data) {
      order = {
        id: data.id,
        customerName: data.customer_name,
        customerEmail: data.customer_email,
        bookTitle: data.book_title,
        bookPrice: data.book_price,
        status: data.status,
      };
    }
  }

  if (!order) {
    const local = getLocalOrder(orderId);
    if (local) {
      order = {
        id: local.id,
        customerName: local.customerName,
        customerEmail: local.customerEmail,
        bookTitle: local.bookTitle,
        bookPrice: local.bookPrice,
        status: local.status,
      };
    }
  }

  // Stateless Token Fallback for Serverless / Cloud deployments (Vercel)
  const token = searchParams.get('token');
  if (!order && token) {
    try {
      const raw = Buffer.from(token, 'base64').toString('utf-8');
      if (raw.startsWith('{')) {
        const decoded = JSON.parse(raw);
        if (decoded && (decoded.id === orderId || decoded.status === 'PAID')) {
          order = {
            id: decoded.id || orderId,
            customerName: decoded.name || decoded.customerName || 'ผู้สั่งซื้อ E-book',
            customerEmail: decoded.email,
            bookTitle: decoded.title || decoded.bookTitle || 'Vibe Coding E-book Digital Edition',
            bookPrice: decoded.price || 290,
            status: 'PAID',
          };
        }
      }
    } catch (e) {
      console.warn('Token decode error in download:', e);
    }
  }

  // Graceful fallback for demo orders (starts with ORD-)
  if (!order && orderId.startsWith('ORD-')) {
    order = {
      id: orderId,
      customerName: 'ผู้สั่งซื้อ E-book',
      bookTitle: 'Vibe Coding E-book Digital Edition',
      status: 'PAID',
    };
  }

  if (!order || order.status !== 'PAID') {
    return new NextResponse('ขออภัย ลิงก์ดาวน์โหลดไม่ถูกต้อง หรือคำสั่งซื้อนี้ยังไม่ได้รับการชำระเงิน', {
      status: 403,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  try {
    // Generate a 100% valid, standard PDF using pdf-lib
    const pdfDoc = await PDFDocument.create();
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const timesBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
    const courierFont = await pdfDoc.embedFont(StandardFonts.Courier);

    // Page 1: Cover & License
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 size in points
    const { width, height } = page.getSize();

    // Top Header Banner
    page.drawRectangle({
      x: 0,
      y: height - 100,
      width: width,
      height: 100,
      color: rgb(0.12, 0.35, 0.85),
    });

    page.drawText('VIBE CODING E-BOOK READER', {
      x: 50,
      y: height - 55,
      size: 20,
      font: timesBoldFont,
      color: rgb(1, 1, 1),
    });

    page.drawText('Official Digital Edition - DEMO ONLY', {
      x: 50,
      y: height - 78,
      size: 11,
      font: timesRomanFont,
      color: rgb(0.85, 0.9, 1),
    });

    // Content Card
    page.drawRectangle({
      x: 45,
      y: height - 260,
      width: width - 90,
      height: 130,
      color: rgb(0.96, 0.97, 0.99),
      borderColor: rgb(0.85, 0.88, 0.92),
      borderWidth: 1,
    });

    page.drawText('Order Information & Verification', {
      x: 65,
      y: height - 160,
      size: 14,
      font: timesBoldFont,
      color: rgb(0.1, 0.15, 0.25),
    });

    page.drawText(`Order ID: ${order.id}`, {
      x: 65,
      y: height - 185,
      size: 12,
      font: courierFont,
      color: rgb(0.12, 0.35, 0.85),
    });

    page.drawText(`Licensed to: ${order.customerName || 'Customer'}`, {
      x: 65,
      y: height - 208,
      size: 11,
      font: timesRomanFont,
      color: rgb(0.2, 0.25, 0.3),
    });

    page.drawText(`Payment Status: PAID (Verified Digital Copy)`, {
      x: 65,
      y: height - 230,
      size: 11,
      font: timesBoldFont,
      color: rgb(0.1, 0.6, 0.3),
    });

    // Book Title Section
    page.drawText('BOOK TITLE:', {
      x: 50,
      y: height - 310,
      size: 12,
      font: timesBoldFont,
      color: rgb(0.4, 0.45, 0.5),
    });

    // Clean ascii-safe display for standard PDF font
    page.drawText(`${order.bookTitle}`, {
      x: 50,
      y: height - 335,
      size: 14,
      font: timesBoldFont,
      color: rgb(0.1, 0.1, 0.1),
    });

    // Chapter Preview / Sample content
    page.drawText('CHAPTER HIGHLIGHTS & CONTENT SUMMARY', {
      x: 50,
      y: height - 390,
      size: 12,
      font: timesBoldFont,
      color: rgb(0.2, 0.3, 0.5),
    });

    const lines = [
      'Chapter 1: Modern Cloud Architecture & Vibe Coding Workflow',
      'Chapter 2: Fullstack Next.js App Router and Server-side API Integration',
      'Chapter 3: Database Security with Supabase Row Level Security (RLS)',
      'Chapter 4: Packaging Web Applications into Android WebView with MIT App Inventor',
      'Chapter 5: Production Deployment, Environment Variables, and Security Checklist',
      '',
      'Thank you for using Vibe Coding E-book Shop!',
      'This verified PDF file was generated for mobile reading and compliance testing.',
    ];

    let currentY = height - 420;
    for (const line of lines) {
      page.drawText(line, {
        x: 50,
        y: currentY,
        size: 10,
        font: timesRomanFont,
        color: rgb(0.25, 0.25, 0.3),
      });
      currentY -= 20;
    }

    // Footer
    page.drawText('Generated by Vibe Coding E-book Shop Platform - MIT App Inventor & Mobile Ready', {
      x: 50,
      y: 40,
      size: 9,
      font: timesRomanFont,
      color: rgb(0.6, 0.65, 0.7),
    });

    const pdfBytes = await pdfDoc.save();

    const disposition = forceDownload ? 'attachment' : 'inline';

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `${disposition}; filename="Ebook-${order.id}.pdf"`,
        'Cache-Control': 'no-cache',
      },
    });
  } catch (err: any) {
    console.error('PDF generation error:', err);
    return new NextResponse('Error generating PDF file: ' + err.message, { status: 500 });
  }
}
