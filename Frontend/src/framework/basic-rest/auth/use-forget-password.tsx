import { createClient } from '@/lib/supabase/client';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export interface ForgetPasswordType {
  email: string;
}

async function forgetPassword(input: ForgetPasswordType) {
  const supabase = createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(input.email, {
    redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
  });

  if (error) {
    throw error;
  }

  return {
    ok: true,
    message: 'اگر ایمیل شما در سیستم موجود است، لینک بازنشانی رمز عبور ارسال شد.',
  };
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
