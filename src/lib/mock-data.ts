import { Book, Order } from '@/types';

export const BOOKS_DATA: Book[] = [
  {
    id: 'book-1',
    title: 'คู่มือการพัฒนาและการใช้งาน: 90s Retro Media Player PRO',
    author: 'นักศึกษาผู้จัดทำโครงงานวิชาเลือกสรร',
    description: 'โปรแกรมเล่นเพลงบนเดสก์ท็อปสไตล์ Retro Hi-Fi Audio Deck ยุค 90s ผสมผสานหน้าปัดดิจิทัล VFD สีเขียวนีออน และปุ่มควบคุมกลไกสัมผัส 3D พร้อมระบบคลังเพลง Playlist Rack ครบวงจร',
    detail: '90s Retro Media Player PRO (v1.0) เป็นโปรแกรมเล่นเพลงบนเดสก์ท็อปที่ได้รับการออกแบบภายใต้แนวคิด Retro Hi-Fi Audio Deck & Winamp Classic ในยุค 90s ผสมผสานหน้าปัดแสดงผลดิจิทัล LCD/VFD สีเขียวนีออน และปุ่มควบคุมแบบสัมผัสกลไก 3D รองรับการเล่นไฟล์เสียงมาตรฐาน เช่น .mp3, .wav, .ogg, .m4a, .flac พร้อมระบบจัดการคลังเพลง (Playlist Rack) ที่ครบวงจร พร้อมฟังก์ชัน Mute, Volume Control, Track Position Slider และปุ่มควบคุมการเล่นแบบ Real-time',
    price: 199,
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    category: 'Desktop Audio Application',
    pageCount: 86,
    sampleChapter: 'บทที่ 1: ภาพรวมสถาปัตยกรรมและแนวคิด 90s Retro Audio Deck\nบทที่ 2: วิธีการเปิดใช้งานโปรแกรมและข้อกำหนดระบบ (Portable Package & Python)\nบทที่ 3: แนะนำส่วนติดต่อผู้ใช้ (VFD Display, Sliders, Transport Controls)\nบทที่ 4: ขั้นตอนการใช้งานฟังก์ชัน Playback และ Playlist Management\nบทที่ 5: การจัดจำหน่ายและ Portable Package Distribution',
    filePath: 'ebooks/retro-media-player-guide.pdf'
  },
  {
    id: 'book-2',
    title: 'คู่มือการพัฒนาและการใช้งาน: Rider-Waite 3-Card Tarot Reading App',
    author: 'นักศึกษาผู้จัดทำโครงงานวิชาเลือกสรร',
    description: 'โปรแกรมทำนายดวงชะตาด้วยไพ่ทาโรต์ตามศาสตร์โบราณ จำลองการวางไพ่ 3 มิติเวลา (อดีต, ปัจจุบัน, อนาคต) ธีม Mystic Velvet & Gold พร้อมเครื่องเล่นดนตรีขับกล่อมบรรยากาศ BGM Audio Deck',
    detail: 'Rider-Waite 3-Card Tarot Reading Application (v1.0) เป็นโปรแกรมทำนายดวงชะตาด้วยไพ่ทาโรต์ตามศาสตร์โบราณ โดยจำลองรูปแบบการวางไพ่ 3 ใบ (3-Card Spread) ได้แก่ 1. อดีต (Past) 2. ปัจจุบัน (Present) 3. อนาคต (Future) ตัวโปรแกรมได้รับการออกแบบในธีม Mystic Velvet & Gold โต๊ะกำมะหยี่สีม่วงมิดไนท์ประดับขอบทองคำ พร้อมเครื่องเล่นดนตรีขับกล่อมบรรยากาศ (BGM Audio Deck) ในตัว ควบคุมระดับเสียงและเลือกเพลงได้อิสระ',
    price: 249,
    coverUrl: 'https://images.unsplash.com/photo-1633511090164-b43840ea1607?auto=format&fit=crop&w=800&q=80',
    category: 'Lifestyle & Divination Software',
    pageCount: 112,
    sampleChapter: 'บทที่ 1: ศาสตร์แห่งไพ่ทาโรต์ Rider-Waite และความหมายเชิงสัญลักษณ์\nบทที่ 2: โครงสร้างการวางไพ่ 3 มิติเวลา (3-Card Spread: อดีต-ปัจจุบัน-อนาคต)\nบทที่ 3: ระบบขับกล่อมบรรยากาศ BGM Audio Deck และ Mystic Velvet Interface\nบทที่ 4: ขั้นตอนการทำนาย สับไพ่ หงายไพ่ และการแปลผลชะตา\nบทที่ 5: การประมวลผลและการบันทึกคำทำนาย',
    filePath: 'ebooks/tarot-app-guide.pdf'
  },
  {
    id: 'book-3',
    title: 'คู่มือการพัฒนาและการใช้งาน: SQLite Task Manager PRO (Futuristic Edition)',
    author: 'นักศึกษาผู้จัดทำโครงงานวิชาเลือกสรร',
    description: 'ระบบบริหารจัดการงานส่วนบุคคลระดับมืออาชีพ ผสานฐานข้อมูล SQLite และดีไซน์ Futuristic Minimalist พร้อม Dashboard สถิติ, ถังขยะกู้คืนงาน, Export/Import CSV และระบบสำรองฐานข้อมูล',
    detail: 'SQLite Task Manager PRO (v2.0) - Futuristic Minimalist Edition เป็นระบบบริหารจัดการงานส่วนบุคคลระดับมืออาชีพที่ผสานประสิทธิภาพของฐานข้อมูล SQLite เข้ากับส่วนติดต่อผู้ใช้สไตล์ Futuristic Minimalist เรียบหรู คมชัด และทันสมัย รองรับการยืนยันตัวตน (Authentication), จัดหมวดหมู่งาน, จัดลำดับความสำคัญ (Low/Medium/High/Urgent), สรุปสถิติผ่าน Dashboard Cards, ถังขยะกู้คืนงาน (Recycle Bin), นำเข้า-ส่งออก CSV, ระบบแจ้งเตือนงานด่วน, สลับธีมมืด/สว่าง (Dark/Light Mode) และการสำรอง-กู้คืนฐานข้อมูล (Backup & Restore)',
    price: 290,
    coverUrl: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=800&q=80',
    category: 'Productivity & Database Engineering',
    pageCount: 149,
    sampleChapter: 'บทที่ 1: สถาปัตยกรรม SQLite Database และระบบ Authentication ผู้ดูแล\nบทที่ 2: การออกแบบ Futuristic Minimalist UI และ Theme Switching\nบทที่ 3: แผงสถิติ Dashboard Cards และการวิเคราะห์สถานะงาน\nบทที่ 4: การจัดการงานครบวงจร (CRUD, Filters, Priority, Categories)\nบทที่ 5: ระบบถังขยะกู้คืน (Soft Delete / Restore) และการ Export/Import CSV\nบทที่ 6: การ Backup & Restore ฐานข้อมูล SQLite',
    filePath: 'ebooks/task-manager-pro-guide.pdf'
  }
];

// Fallback in-memory order store for local dev / demo when Supabase isn't configured yet
// Persist across Next.js Turbopack fast reloads using globalThis
const globalOrders: Record<string, Order> = 
  (globalThis as any).__orders || ((globalThis as any).__orders = {});

export function getLocalBooks(): Book[] {
  return BOOKS_DATA;
}

export function getLocalBookById(id: string): Book | undefined {
  return BOOKS_DATA.find((b) => b.id === id);
}

export function createLocalOrder(customerName: string, customerEmail: string, bookId: string): Order {
  const book = getLocalBookById(bookId);
  if (!book) {
    throw new Error('ไม่พบหนังสือที่ระบุ');
  }

  const orderId = 'ORD-' + Math.random().toString(36).substring(2, 7).toUpperCase() + '-' + Date.now().toString().slice(-4);
  const newOrder: Order = {
    id: orderId,
    customerName,
    customerEmail: customerEmail.trim().toLowerCase(),
    bookId: book.id,
    bookTitle: book.title,
    bookPrice: book.price,
    coverUrl: book.coverUrl,
    status: 'PENDING',
    createdAt: new Date().toISOString()
  };

  globalOrders[orderId] = newOrder;
  return newOrder;
}

export function getLocalOrder(orderId: string): Order | undefined {
  return globalOrders[orderId];
}

export function markLocalOrderPaid(orderId: string): Order | undefined {
  const order = globalOrders[orderId];
  if (!order) return undefined;

  order.status = 'PAID';
  order.paidAt = new Date().toISOString();
  // Simulated temporary signed download URL (expires in 24 hours)
  const tokenPayload = {
    id: order.id,
    name: order.customerName,
    email: order.customerEmail,
    title: order.bookTitle,
    price: order.bookPrice,
    status: 'PAID',
    paidAt: Date.now()
  };
  const token = Buffer.from(JSON.stringify(tokenPayload)).toString('base64');
  order.downloadUrl = `/api/download?orderId=${encodeURIComponent(order.id)}&token=${encodeURIComponent(token)}`;
  return order;
}
