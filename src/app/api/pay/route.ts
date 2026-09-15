import { NextRequest, NextResponse } from 'next/server';
import { getLocalOrder, markLocalOrderPaid } from '@/lib/mock-data';
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { sendOrderPaidEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'กรุณาระบุรหัสคำสั่งซื้อ (orderId)' },
        { status: 400 }
      );
    }

    let orderData: {
      id: string;
      customerName: string;
      customerEmail: string;
      bookTitle: string;
      bookPrice: number;
      coverUrl?: string;
      status: string;
      downloadUrl?: string;
    } | null = null;

    const supabaseAdmin = getSupabaseAdmin();

    // Check if Supabase is active
    if (isSupabaseConfigured() && supabaseAdmin) {
      // 1. Fetch current order
      const { data: order, error: fetchErr } = await supabaseAdmin
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (!fetchErr && order) {
        // 2. Generate signed download URL from private bucket 'ebook-files'
        let downloadUrl = '';
        try {
          const { data: signedData, error: signErr } = await supabaseAdmin
            .storage
            .from('ebook-files')
            .createSignedUrl(order.book_id + '.pdf', 60 * 60 * 24); // 24 hours

          if (!signErr && signedData?.signedUrl) {
            downloadUrl = signedData.signedUrl;
          } else {
            downloadUrl = `/api/download?orderId=${encodeURIComponent(order.id)}&token=${Buffer.from(order.id + ':' + order.customer_email).toString('base64')}`;
          }
        } catch {
          downloadUrl = `/api/download?orderId=${encodeURIComponent(order.id)}&token=${Buffer.from(order.id + ':' + order.customer_email).toString('base64')}`;
        }

        // 3. Update status to PAID
        const { data: updated, error: updateErr } = await supabaseAdmin
          .from('orders')
          .update({
            status: 'PAID',
            download_url: downloadUrl,
            paid_at: new Date().toISOString(),
          })
          .eq('id', orderId)
          .select()
          .single();

        if (!updateErr && updated) {
          orderData = {
            id: updated.id,
            customerName: updated.customer_name,
            customerEmail: updated.customer_email,
            bookTitle: updated.book_title,
            bookPrice: updated.book_price,
            coverUrl: updated.cover_url,
            status: updated.status,
            downloadUrl: updated.download_url,
          };
        }
      }
    }

    // Fallback to local store if Supabase not used or not found
    if (!orderData) {
      const local = markLocalOrderPaid(orderId);
      if (!local) {
        return NextResponse.json(
          { success: false, error: 'ไม่พบคำสั่งซื้อที่ระบุ' },
          { status: 404 }
        );
      }
      orderData = {
        id: local.id,
        customerName: local.customerName,
        customerEmail: local.customerEmail,
        bookTitle: local.bookTitle,
        bookPrice: local.bookPrice,
        coverUrl: local.coverUrl,
        status: local.status,
        downloadUrl: local.downloadUrl,
      };
    }

    // Send email notification (Resend or simulated)
    const emailResult = await sendOrderPaidEmail({
      toEmail: orderData.customerEmail,
      customerName: orderData.customerName,
      orderId: orderData.id,
      bookTitle: orderData.bookTitle,
      bookPrice: orderData.bookPrice,
      downloadUrl: orderData.downloadUrl || '',
    });

    return NextResponse.json({
      success: true,
      order: orderData,
      emailResult,
    });
  } catch (err: any) {
    console.error('Payment simulation error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'เกิดข้อผิดพลาดในการจำลองการชำระเงิน' },
      { status: 500 }
    );
  }
}
