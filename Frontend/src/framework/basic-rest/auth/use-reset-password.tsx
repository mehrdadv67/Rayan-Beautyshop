import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export interface ResetPasswordInputType {
  password: string;
  passwordConfirmation: string;
  code: string;
}

async function resetPassword(input: ResetPasswordInputType) {
  const res = await fetch('/api/auth/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
    credentials: 'include',
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Password reset failed');
  }

  return res.json();
}

export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: (input: ResetPasswordInputType) => resetPassword(input),
    onSuccess: () => {
      toast.success('رمز عبور با موفقیت تغییر یافت. لطفا وارد شوید.');
    },
    onError: (error: any) => {
      const message = error?.message || 'خطا در تغییر رمز عبور.';
      toast.error(message);
    },
  });
};
