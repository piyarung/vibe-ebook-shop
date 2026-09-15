import { NextRequest, NextResponse } from 'next/server';
import { getLocalOrder } from '@/lib/mock-data';
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, email } = body;

    if (!orderId || !email) {
      return NextResponse.json(
        { success: false, error: 'กรุณากรอกทั้งรหัสคำสั่งซื้อและอีเมลเพื่อความปลอดภัย' },
        { status: 400 }
      );
    }

    const cleanOrderId = orderId.trim().toUpperCase();
    const cleanEmail = email.trim().toLowerCase();

    const supabaseAdmin = getSupabaseAdmin();

    // Check Supabase
    if (isSupabaseConfigured() && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('orders')
        .select('id, customer_name, customer_email, book_title, book_price, cover_url, status, download_url, created_at, paid_at')
        .eq('id', cleanOrderId)
        .eq('customer_email', cleanEmail)
        .single();

      if (!error && data) {
        return NextResponse.json({
          success: true,
          order: {
            id: data.id,
            customerName: data.customer_name,
            customerEmail: data.customer_email,
            bookTitle: data.book_title,
            bookPrice: data.book_price,
            coverUrl: data.cover_url,
            status: data.status,
            downloadUrl: data.download_url,
            createdAt: data.created_at,
            paidAt: data.paid_at,
          },
        });
      }
    }

    // Check Local store
    const localOrder = getLocalOrder(cleanOrderId);
    if (localOrder && localOrder.customerEmail.toLowerCase() === cleanEmail) {
      return NextResponse.json({
        success: true,
        order: localOrder,
      });
    }

    return NextResponse.json(
      { success: false, error: 'ไม่พบคำสั่งซื้อ หรืออีเมลไม่ตรงกับคำสั่งซื้อนี้ (เพื่อความปลอดภัยของข้อมูล)' },
      { status: 404 }
    );
  } catch (err: any) {
    console.error('Track order error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'เกิดข้อผิดพลาดในการตรวจสอบคำสั่งซื้อ' },
      { status: 500 }
    );
  }
}
