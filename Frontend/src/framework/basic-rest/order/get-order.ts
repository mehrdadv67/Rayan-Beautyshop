import { Order } from '@framework/types';
import { useQuery } from '@tanstack/react-query';

export const fetchOrder = async (id: string): Promise<Order> => {
  const response = await fetch(`/api/orders/${encodeURIComponent(id)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch order');
  }

  const result = await response.json();
  return result.data;
};

export const useOrderQuery = (id: string) => {
  return useQuery<Order, Error>({
    queryKey: ['/api/orders', id],
    queryFn: () => fetchOrder(id),
    enabled: !!id,
  });
};
