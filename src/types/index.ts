export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  detail: string;
  price: number;
  coverUrl: string;
  category: string;
  pageCount: number;
  sampleChapter?: string;
  filePath?: string;
}

export type OrderStatus = 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED';

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  bookId: string;
  bookTitle: string;
  bookPrice: number;
  coverUrl?: string;
  status: OrderStatus;
  downloadUrl?: string;
  createdAt: string;
  paidAt?: string;
}
