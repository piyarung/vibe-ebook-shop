import { NextRequest, NextResponse } from 'next/server';
import { getLocalOrder } from '@/lib/mock-data';
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get('orderId');

  if (!orderId) {
    return new NextResponse('Invalid order request', { status: 400 });
  }

  let order: {
    id: string;
    customerName: string;
    bookTitle: string;
    status: string;
  } | null = null;

  const supabaseAdmin = getSupabaseAdmin();
  if (isSupabaseConfigured() && supabaseAdmin) {
    const { data } = await supabaseAdmin
      .from('orders')
      .select('id, customer_name, book_title, status')
      .eq('id', orderId)
      .single();
    if (data) {
      order = {
        id: data.id,
        customerName: data.customer_name,
        bookTitle: data.book_title,
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
        bookTitle: local.bookTitle,
        status: local.status,
      };
    }
  }

  if (!order || order.status !== 'PAID') {
    return new NextResponse('ขออภัย ลิงก์ดาวน์โหลดไม่ถูกต้อง หรือคำสั่งซื้อนี้ยังไม่ได้รับการชำระเงิน', {
      status: 403,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  // Generate a mock PDF or downloadable sample file
  const samplePdfContent = `%PDF-1.4
1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj
3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj
4 0 obj << /Length 200 >> stream
BT
/F1 20 Tf
50 720 Td
(Vibe Coding E-book Shop - DEMO DOWNLOAD) Tj
0 -30 Td
/F1 14 Tf
(Order: ${order.id}) Tj
0 -24 Td
(Customer: ${order.customerName}) Tj
0 -24 Td
(Book: ${order.bookTitle}) Tj
0 -40 Td
(Thank you for your purchase! This is a demo e-book file.) Tj
ET
endstream
endobj
5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000244 00000 n 
0000000495 00000 n 
trailer << /Size 6 /Root 1 0 R >>
startxref
566
%%EOF`;

  return new NextResponse(samplePdfContent, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="Ebook-${order.id}.pdf"`,
    },
  });
}
