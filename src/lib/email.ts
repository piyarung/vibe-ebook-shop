import { Resend } from 'resend';
import nodemailer from 'nodemailer';

const resendApiKey = process.env.RESEND_API_KEY || '';
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Gmail / Custom SMTP Transporter
const gmailUser = process.env.GMAIL_USER || process.env.SMTP_USER || '';
const gmailPass = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS || '';

const getSmtpTransporter = () => {
  if (!gmailUser || !gmailPass) return null;
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmailUser,
      pass: gmailPass,
    },
  });
};

interface SendOrderCreatedEmailParams {
  toEmail: string;
  customerName: string;
  orderId: string;
  bookTitle: string;
  bookPrice: number;
  paymentUrl: string;
}

interface SendOrderPaidEmailParams {
  toEmail: string;
  customerName: string;
  orderId: string;
  bookTitle: string;
  bookPrice: number;
  downloadUrl: string;
}

/**
 * 1. ส่งอีเมลแจ้งเตือนรหัสคำสั่งซื้อทันทีเมื่อสั่งซื้อ (Order Created / PENDING)
 */
export async function sendOrderCreatedEmail(params: SendOrderCreatedEmailParams) {
  const { toEmail, customerName, orderId, bookTitle, bookPrice, paymentUrl } = params;

  const subject = `[DEMO ONLY] ยืนยันการสั่งซื้อ E-book: ${bookTitle} (รหัสคำสั่งซื้อ: ${orderId})`;

  const emailHtml = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="background-color: #fef3c7; color: #92400e; font-size: 12px; font-weight: bold; padding: 4px 12px; border-radius: 9999px; text-transform: uppercase;">
          DEMO ONLY - ได้รับคำสั่งซื้อแล้ว
        </span>
        <h1 style="color: #0f172a; margin-top: 12px; font-size: 22px;">แจ้งเตือนรหัสคำสั่งซื้อ E-book</h1>
        <p style="color: #64748b; font-size: 14px;">รหัสคำสั่งซื้อของคุณคือ:</p>
        <div style="background-color: #f1f5f9; padding: 12px; border-radius: 8px; font-size: 20px; font-weight: bold; color: #1e293b; letter-spacing: 1px; font-family: monospace;">
          ${orderId}
        </div>
      </div>

      <div style="background-color: #f8fafc; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        <h3 style="margin-top: 0; color: #1e293b; font-size: 15px;">รายละเอียดการสั่งซื้อ</h3>
        <p style="margin: 4px 0; color: #475569; font-size: 14px;"><strong>ผู้สั่งซื้อ:</strong> ${customerName}</p>
        <p style="margin: 4px 0; color: #475569; font-size: 14px;"><strong>อีเมลแจ้งเตือน:</strong> ${toEmail}</p>
        <p style="margin: 4px 0; color: #475569; font-size: 14px;"><strong>รายการหนังสือ:</strong> ${bookTitle}</p>
        <p style="margin: 4px 0; color: #475569; font-size: 14px;"><strong>ยอดชำระ (จำลอง):</strong> ฿${bookPrice.toLocaleString()}</p>
        <p style="margin: 4px 0; color: #d97706; font-size: 14px; font-weight: bold;"><strong>สถานะ:</strong> PENDING (รอชำระเงินจำลอง)</p>
      </div>

      <div style="text-align: center; margin: 28px 0;">
        <a href="${paymentUrl}" style="background-color: #10b981; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: bold; font-size: 15px; display: inline-block;">
          คลิกเข้าสู่หน้าชำระเงินจำลอง (Mock Payment)
        </a>
      </div>

      <p style="color: #64748b; font-size: 12px; line-height: 1.6;">
        * คุณสามารถใช้รหัสคำสั่งซื้อ <strong>${orderId}</strong> ร่วมกับอีเมล <strong>${toEmail}</strong> เพื่อตรวจสอบสถานะในหน้าติดตามคำสั่งซื้อได้ตลอดเวลา
      </p>

      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
      <p style="color: #94a3b8; font-size: 11px; text-align: center;">
        นี่เป็นอีเมลจำลองจากระบบ Vibe Coding E-book Shop (DEMO ONLY - ห้ามโอนเงินจริง)
      </p>
    </div>
  `;

  return await dispatchEmail(toEmail, subject, emailHtml);
}

/**
 * 2. ส่งอีเมลแจ้งเตือนเมื่อชำระเงินสำเร็จ (Order Paid / PAID) พร้อมลิงก์ดาวน์โหลด
 */
export async function sendOrderPaidEmail(params: SendOrderPaidEmailParams) {
  const { toEmail, customerName, orderId, bookTitle, bookPrice, downloadUrl } = params;

  const subject = `[DEMO ONLY] ลิงก์ดาวน์โหลด E-book: ${bookTitle} (รหัสคำสั่งซื้อ: ${orderId})`;

  const emailHtml = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="background-color: #dbeafe; color: #1e40af; font-size: 12px; font-weight: bold; padding: 4px 12px; border-radius: 9999px; text-transform: uppercase;">
          DEMO ONLY - ชำระเงินจำลองสำเร็จ
        </span>
        <h1 style="color: #0f172a; margin-top: 12px; font-size: 22px;">ขอบคุณสำหรับการสั่งซื้อ E-book!</h1>
        <p style="color: #64748b; font-size: 14px;">รหัสคำสั่งซื้อ: <strong>${orderId}</strong></p>
      </div>

      <div style="background-color: #f8fafc; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        <h3 style="margin-top: 0; color: #1e293b; font-size: 15px;">สรุปรายการสั่งซื้อ</h3>
        <p style="margin: 4px 0; color: #475569; font-size: 14px;"><strong>ผู้สั่งซื้อ:</strong> ${customerName}</p>
        <p style="margin: 4px 0; color: #475569; font-size: 14px;"><strong>อีเมล:</strong> ${toEmail}</p>
        <p style="margin: 4px 0; color: #475569; font-size: 14px;"><strong>รายการ:</strong> ${bookTitle}</p>
        <p style="margin: 4px 0; color: #475569; font-size: 14px;"><strong>ยอดเงิน (จำลอง):</strong> ฿${bookPrice.toLocaleString()}</p>
        <p style="margin: 4px 0; color: #16a34a; font-weight: bold; font-size: 14px;"><strong>สถานะ:</strong> PAID (ชำระเงินเรียบร้อยแล้ว)</p>
      </div>

      <div style="text-align: center; margin: 32px 0;">
        <a href="${downloadUrl}" style="background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: bold; font-size: 15px; display: inline-block;">
          ดาวน์โหลด E-book ของคุณที่นี่
        </a>
        <p style="color: #94a3b8; font-size: 12px; margin-top: 12px;">
          * ลิงก์ดาวน์โหลดนี้เป็นลิงก์ชั่วคราว (Temporary Signed Link) เพื่อความปลอดภัย
        </p>
      </div>

      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
      <p style="color: #94a3b8; font-size: 11px; text-align: center;">
        นี่เป็นอีเมลจำลองจากระบบ Vibe Coding E-book Shop (DEMO ONLY)<br/>
        หากมีข้อสงสัย สามารถนำรหัส ${orderId} ไปตรวจสอบในหน้าติดตามคำสั่งซื้อได้
      </p>
    </div>
  `;

  return await dispatchEmail(toEmail, subject, emailHtml);
}

/**
 * Dispatch function handling:
 * 1. Gmail SMTP (Nodemailer) -> ส่งเข้า Gmail จริงได้ทุกอีเมล
 * 2. Resend API
 * 3. Simulation mode -> บันทึกลง Log และส่งค่าจำลองสำเร็จ
 */
async function dispatchEmail(toEmail: string, subject: string, html: string) {
  // Option A: Gmail SMTP
  const smtpTransporter = getSmtpTransporter();
  if (smtpTransporter) {
    try {
      const info = await smtpTransporter.sendMail({
        from: `"Vibe E-Books" <${gmailUser}>`,
        to: toEmail,
        subject,
        html,
      });
      console.log(`[Email Service: Gmail SMTP] Email sent successfully to ${toEmail}. MessageId: ${info.messageId}`);
      return {
        success: true,
        channel: 'gmail-smtp',
        messageId: info.messageId,
      };
    } catch (err: any) {
      console.error('[Email Service: Gmail SMTP] Error:', err);
    }
  }

  // Option B: Resend
  if (resend) {
    try {
      const fromAddress = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
      const result = await resend.emails.send({
        from: `Vibe E-Books <${fromAddress}>`,
        to: toEmail,
        subject,
        html,
      });
      console.log(`[Email Service: Resend] Email sent to ${toEmail}:`, result);
      return {
        success: true,
        channel: 'resend',
        data: result,
      };
    } catch (err: any) {
      console.error('[Email Service: Resend] Error:', err);
    }
  }

  // Option C: Simulated fallback
  console.log(`[Email Service: Simulated] Notification prepared for ${toEmail}:`);
  console.log(`- Subject: ${subject}`);
  return {
    success: true,
    channel: 'simulated',
    simulated: true,
    message: `จำลองการส่งการแจ้งเตือนไปยัง ${toEmail} เรียบร้อยแล้ว`,
  };
}
