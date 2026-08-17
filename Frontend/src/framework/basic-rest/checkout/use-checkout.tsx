import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useCart } from '@contexts/cart/cart.context';
import Router from 'next/router';
import { ROUTES } from '@utils/routes';

export interface CheckoutInputType {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
  save: boolean;
  note: string;
}

async function checkout(input: CheckoutInputType, cartItems: any[]) {
  const total = cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);

  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...input,
      products: cartItems,
      total,
      shippingFee: 0,
      paymentMethod: 'cash_on_delivery',
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.details || error.error || 'خطا در ثبت سفارش');
  }

  return response.json();
}

export const useCheckoutMutation = () => {
  const { items: cartItems, resetCart } = useCart();

  return useMutation({
    mutationFn: (input: CheckoutInputType) => checkout(input, cartItems),
    onSuccess: (data) => {
      resetCart();
      toast.success('سفارش شما با موفقیت ثبت شد');
      Router.push(`${ROUTES.ORDER}?id=${data.orderId}`);
    },
    onError: (error: any) => {
      const message = error?.message || 'خطا در ثبت سفارش. لطفا دوباره تلاش کنید.';
      toast.error(message);
    },
  });
};
