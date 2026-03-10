import { fetcher, API_BASE_URL } from '../api-config';
import type { Order, ShippingAddress, CartItem } from '../types';

const BASE = `${API_BASE_URL}/orders`;

export interface CreateOrderPayload {
  items: CartItem[];
  shippingAddress: ShippingAddress;
  paymentMethod?: string;
  notes?: string;
}

export const OrderAPI = {
  create: (payload: CreateOrderPayload): Promise<{ success: boolean; data: Order }> =>
    fetcher(BASE, { method: 'POST', body: JSON.stringify(payload) }),

  getAll: (status?: string): Promise<{ success: boolean; data: Order[] }> =>
    fetcher(`${BASE}${status ? `?status=${status}` : ''}`),

  getMyOrders: (): Promise<{ success: boolean; data: Order[] }> =>
    fetcher(`${BASE}/my-orders`),

  getById: (id: string): Promise<{ success: boolean; data: Order }> =>
    fetcher(`${BASE}/${id}`),

  updateStatus: (id: string, status: string, paymentStatus?: string): Promise<{ success: boolean; data: Order }> =>
    fetcher(`${BASE}/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, ...(paymentStatus && { paymentStatus }) }),
    }),

  cancel: (id: string): Promise<{ success: boolean; data: Order }> =>
    fetcher(`${BASE}/${id}/cancel`, { method: 'PATCH' }),

  getStats: (): Promise<{ success: boolean; data: any }> =>
    fetcher(`${BASE}/stats`),
};
