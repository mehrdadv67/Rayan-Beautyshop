import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

export interface ChangeEmailInputType {
  newEmail: string;
  oldEmail: string;
}

async function changeEmail(input: ChangeEmailInputType) {
  const res = await fetch('/api/customer/change-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      email: input.newEmail,
      password: input.oldEmail,
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to change email');
  }

  return res.json();
}

export const useChangeEmailMutation = () => {
  return useMutation({
    mutationFn: (input: ChangeEmailInputType) => changeEmail(input),
    onSuccess: () => {
      toast.success('ایمیل با موفقیت تغییر یافت');
    },
    onError: (error: any) => {
      const message = error?.message || 'خطا در تغییر ایمیل.';
      toast.error(message);
    },
  });
};
