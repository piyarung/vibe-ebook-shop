import { Order } from '@/types';

const STORAGE_KEY = 'vibe_ebook_order_history';

// In-memory fallback cache when window.localStorage is null (e.g. Android WebViews without DOM Storage)
let memoryStore: Record<string, string> = {};

function isLocalStorageAvailable(): boolean {
  try {
    return (
      typeof window !== 'undefined' &&
      typeof window.localStorage !== 'undefined' &&
      window.localStorage !== null &&
      typeof window.localStorage.getItem === 'function'
    );
  } catch {
    return false;
  }
}

export function safeGetItem(key: string): string | null {
  try {
    if (isLocalStorageAvailable()) {
      return window.localStorage.getItem(key);
    }
  } catch (e) {
    // ignore
  }
  return memoryStore[key] || null;
}

export function safeSetItem(key: string, value: string): void {
  try {
    if (isLocalStorageAvailable()) {
      window.localStorage.setItem(key, value);
      return;
    }
  } catch (e) {
    // ignore
  }
  memoryStore[key] = value;
}

export function getOrderHistory(): Order[] {
  try {
    const raw = safeGetItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn('Error reading order history:', e);
    return [];
  }
}

export function saveOrderToHistory(order: Order) {
  try {
    const history = getOrderHistory();
    const existingIndex = history.findIndex((o) => o.id === order.id);
    if (existingIndex >= 0) {
      history[existingIndex] = { ...history[existingIndex], ...order };
    } else {
      history.unshift(order); // Add newest first
    }
    safeSetItem(STORAGE_KEY, JSON.stringify(history));
  } catch (e) {
    console.warn('Error saving order to history:', e);
  }
}

export function updateOrderStatusInHistory(orderId: string, status: Order['status'], downloadUrl?: string) {
  try {
    const history = getOrderHistory();
    const target = history.find((o) => o.id === orderId);
    if (target) {
      target.status = status;
      if (downloadUrl) target.downloadUrl = downloadUrl;
      if (status === 'PAID') target.paidAt = new Date().toISOString();
      safeSetItem(STORAGE_KEY, JSON.stringify(history));
    }
  } catch (e) {
    console.warn('Error updating order history:', e);
  }
}
