import { Order } from '@/types';

const STORAGE_KEY = 'vibe_ebook_order_history';

export function getOrderHistory(): Order[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Error reading order history:', e);
    return [];
  }
}

export function saveOrderToHistory(order: Order) {
  if (typeof window === 'undefined') return;
  try {
    const history = getOrderHistory();
    const existingIndex = history.findIndex((o) => o.id === order.id);
    if (existingIndex >= 0) {
      history[existingIndex] = { ...history[existingIndex], ...order };
    } else {
      history.unshift(order); // Add newest first
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (e) {
    console.error('Error saving order to history:', e);
  }
}

export function updateOrderStatusInHistory(orderId: string, status: Order['status'], downloadUrl?: string) {
  if (typeof window === 'undefined') return;
  try {
    const history = getOrderHistory();
    const target = history.find((o) => o.id === orderId);
    if (target) {
      target.status = status;
      if (downloadUrl) target.downloadUrl = downloadUrl;
      if (status === 'PAID') target.paidAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    }
  } catch (e) {
    console.error('Error updating order history:', e);
  }
}
