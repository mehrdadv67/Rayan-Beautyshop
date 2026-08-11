import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export interface ForgetPasswordType {
  email: string;
}

async function forgetPassword(input: ForgetPasswordType) {
  const res = await fetch('/api/auth/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: input.email }),
    credentials: 'include',
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Forgot password failed');
  }

  return res.json();
}

export const useForgetPasswordMutation = () => {
  return useMutation({
    mutationFn: (input: ForgetPasswordType) => forgetPassword(input),
    onSuccess: () => {
      toast.success('اگر ایمیل شما در سیستم موجود است، لینک بازنشانی رمز عبور ارسال شد.');
    },
    onError: (error: any) => {
      const message =
        error?.message || 'خطا در بازیابی رمز عبور. لطفا دوباره تلاش کنید.';
      toast.error(message);
    },
  });
};
