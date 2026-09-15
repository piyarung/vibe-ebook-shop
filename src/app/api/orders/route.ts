import { NextRequest, NextResponse } from 'next/server';
import { getLocalBookById, createLocalOrder } from '@/lib/mock-data';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { sendOrderCreatedEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerName, customerEmail, bookId } = body;

    if (!customerName || !customerEmail || !bookId) {
      return NextResponse.json(
        { success: false, error: 'กรุณากรอกข้อมูลให้ครบถ้วน (ชื่อ, อีเมล, และหนังสือที่ต้องการสั่งซื้อ)' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      return NextResponse.json(
        { success: false, error: 'รูปแบบอีเมลไม่ถูกต้อง' },
        { status: 400 }
      );
    }

    const book = getLocalBookById(bookId);
    if (!book) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบหนังสือที่ระบุ' },
        { status: 404 }
      );
    }

    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    const baseUrl = `${protocol}://${host}`;

    let createdOrderId = '';
    let source = 'local-store';

    // Try Supabase if configured
    if (isSupabaseConfigured() && supabase) {
      const orderId = 'ORD-' + Math.random().toString(36).substring(2, 7).toUpperCase() + '-' + Date.now().toString().slice(-4);
      const { data, error } = await supabase
        .from('orders')
        .insert([
          {
            id: orderId,
            customer_name: customerName.trim(),
            customer_email: customerEmail.trim().toLowerCase(),
            book_id: book.id,
            book_title: book.title,
            book_price: book.price,
            cover_url: book.coverUrl,
            status: 'PENDING',
          },
        ])
        .select()
        .single();

      if (!error && data) {
        createdOrderId = data.id;
        source = 'supabase';
      } else {
        console.warn('[Supabase] Insert failed, falling back to local store:', error);
      }
    }

    // Fallback to local store if not already created
    if (!createdOrderId) {
      const localOrder = createLocalOrder(customerName, customerEmail, bookId);
      createdOrderId = localOrder.id;
      source = 'local-store';
    }

    // ส่งอีเมลแจ้งเตือนรหัสคำสั่งซื้อไปยัง Gmail/อีเมลที่กรอกทันที
    const paymentUrl = `${baseUrl}/payment/${encodeURIComponent(createdOrderId)}`;
    const emailResult = await sendOrderCreatedEmail({
      toEmail: customerEmail.trim().toLowerCase(),
      customerName: customerName.trim(),
      orderId: createdOrderId,
      bookTitle: book.title,
      bookPrice: book.price,
      paymentUrl,
    });

    return NextResponse.json({
      success: true,
      orderId: createdOrderId,
      status: 'PENDING',
      source,
      emailResult,
    });
  } catch (err: any) {
    console.error('Order creation error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ' },
      { status: 500 }
    );
  }
}
