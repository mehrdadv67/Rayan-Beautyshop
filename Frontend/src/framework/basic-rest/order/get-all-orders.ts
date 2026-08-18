import { Order } from '@framework/types';
import { normalizeOrder } from '@framework/utils/normalize';
import { useQuery } from '@tanstack/react-query';

export const fetchOrders = async () => {
  const response = await fetch('/api/orders', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch orders');
  }

  const result = await response.json();
  const rawOrders = result.orders || result.data || [];
  const orders = Array.isArray(rawOrders)
    ? rawOrders.map(normalizeOrder)
    : [];
  return { orders: { data: orders as Order[] } };
};

export const useOrdersQuery = () => {
  return useQuery<{ orders: { data: Order[] } }, Error>({
    queryKey: ['/api/orders'],
    queryFn: fetchOrders,
  });
};
