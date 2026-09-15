import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY || '';
const resend = resendApiKey ? new Resend(resendApiKey) : null;

interface SendOrderEmailParams {
  toEmail: string;
  customerName: string;
  orderId: string;
  bookTitle: string;
  bookPrice: number;
  downloadUrl: string;
}

export async function sendOrderPaidEmail(params: SendOrderEmailParams) {
  const { toEmail, customerName, orderId, bookTitle, bookPrice, downloadUrl } = params;

  // HTML Email template
  const emailHtml = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="background-color: #dbeafe; color: #1e40af; font-size: 12px; font-weight: bold; padding: 4px 12px; border-radius: 9999px; text-transform: uppercase;">
          DEMO ONLY - สั่งซื้อสำเร็จ
        </span>
        <h1 style="color: #0f172a; margin-top: 12px; font-size: 24px;">ขอบคุณสำหรับการสั่งซื้อ E-book!</h1>
        <p style="color: #64748b; font-size: 14px;">รหัสคำสั่งซื้อ: <strong>${orderId}</strong></p>
      </div>

      <div style="background-color: #f8fafc; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        <h3 style="margin-top: 0; color: #1e293b; font-size: 16px;">สรุปรายการสั่งซื้อ</h3>
        <p style="margin: 4px 0; color: #475569;"><strong>ผู้สั่งซื้อ:</strong> ${customerName}</p>
        <p style="margin: 4px 0; color: #475569;"><strong>อีเมล:</strong> ${toEmail}</p>
        <p style="margin: 4px 0; color: #475569;"><strong>รายการ:</strong> ${bookTitle}</p>
        <p style="margin: 4px 0; color: #475569;"><strong>ยอดเงิน (จำลอง):</strong> ฿${bookPrice.toLocaleString()}</p>
        <p style="margin: 4px 0; color: #16a34a; font-weight: bold;"><strong>สถานะ:</strong> PAID (ชำระเงินเรียบร้อยแล้ว)</p>
      </div>

      <div style="text-align: center; margin: 32px 0;">
        <a href="${downloadUrl}" style="background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
          ดาวน์โหลด E-book ของคุณที่นี่
        </a>
        <p style="color: #94a3b8; font-size: 12px; margin-top: 12px;">
          * ลิงก์ดาวน์โหลดนี้เป็นลิงก์ชั่วคราว (Temporary Link) เพื่อความปลอดภัย
        </p>
      </div>

      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
      <p style="color: #94a3b8; font-size: 11px; text-align: center;">
        นี่เป็นอีเมลจำลองจากระบบ Vibe Coding E-book Shop (DEMO ONLY)<br/>
        หากมีข้อสงสัยหรือต้องการติดตามคำสั่งซื้อ สามารถเข้าสู่หน้าระบบติดตามผลได้ตลอดเวลา
      </p>
    </div>
  `;

  if (!resend) {
    console.log('[Email Service] Resend API Key is not configured. Simulating email send:');
    console.log({
      to: toEmail,
      subject: `[DEMO ONLY] ลิงก์ดาวน์โหลด E-book: ${bookTitle} (${orderId})`,
      orderId,
      downloadUrl,
    });
    return {
      success: true,
      simulated: true,
      message: 'จำลองการส่งอีเมลสำเร็จ (ยังไม่ได้ระบุ RESEND_API_KEY)',
    };
  }

  try {
    const fromAddress = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    const result = await resend.emails.send({
      from: `E-book Shop DEMO <${fromAddress}>`,
      to: toEmail,
      subject: `[DEMO ONLY] ลิงก์ดาวน์โหลด E-book: ${bookTitle} (${orderId})`,
      html: emailHtml,
    });

    return {
      success: true,
      simulated: false,
      data: result,
    };
  } catch (error: any) {
    console.error('[Email Service] Error sending email via Resend:', error);
    return {
      success: false,
      error: error.message || 'ส่งอีเมลไม่สำเร็จ',
    };
  }
}
