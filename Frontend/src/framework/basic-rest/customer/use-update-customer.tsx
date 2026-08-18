import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export interface UpdateUserType {
  firstName: string;
  lastName: string;
  displayName: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
  gender: string;
  address: string;
  city: string;
  zipCode: string;
}

async function updateUser(input: UpdateUserType) {
  const { password, confirmPassword, displayName, email, phoneNumber, ...rest } = input;

  const res = await fetch('/api/customer/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      ...rest,
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to update profile');
  }

  return res.json();
}

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateUserType) => updateUser(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-user'] });
      toast.success('تغییرات با موفقیت ذخیره شد');
    },
    onError: (error: any) => {
      const message =
        error?.message || 'خطا در ذخیره تغییرات';
      toast.error(message);
    },
  });
};
