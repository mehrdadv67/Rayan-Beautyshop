import { Order } from '@framework/types';
import { useQuery } from '@tanstack/react-query';

export const fetchOrders = async () => {
  const response = await fetch('/api/orders', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch orders');
  }

  const result = await response.json();
  return { orders: { data: result.orders || result.data || [] } };
};

export const useOrdersQuery = () => {
  return useQuery<{ orders: { data: Order[] } }, Error>({
    queryKey: ['/api/orders'],
    queryFn: fetchOrders,
  });
};
