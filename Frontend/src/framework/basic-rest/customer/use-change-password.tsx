import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

export interface ChangePasswordInputType {
  newPassword: string;
  oldPassword: string;
  confirmPassword: string;
}

async function changePassword(input: ChangePasswordInputType) {
  const res = await fetch('/api/customer/change-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      oldPassword: input.oldPassword,
      newPassword: input.newPassword,
      confirmPassword: input.confirmPassword,
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to change password');
  }

  return res.json();
}

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: (input: ChangePasswordInputType) => changePassword(input),
    onSuccess: () => {
      toast.success('رمز عبور با موفقیت تغییر یافت');
    },
    onError: (error: any) => {
      const message = error?.message || 'خطا در تغییر رمز عبور.';
      toast.error(message);
    },
  });
};
