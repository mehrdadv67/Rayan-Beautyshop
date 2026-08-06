import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
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
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error('User not authenticated');
  }

  const { password, confirmPassword, displayName, ...rest } = input;

  const { error: profileError } = await supabase.from('profiles').upsert({
    id: user.id,
    username: displayName || rest.phoneNumber ? (displayName || user.email) : user.email,
    first_name: rest.firstName,
    last_name: rest.lastName,
    phone_number: rest.phoneNumber,
    address: rest.address,
    city: rest.city,
    zip_code: rest.zipCode,
    gender: rest.gender,
  });

  if (profileError) {
    throw profileError;
  }

  if (password && password.trim() !== '') {
    const { error: pwError } = await supabase.auth.updateUser({
      password,
    });
    if (pwError) {
      throw pwError;
    }
  }

  return true;
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
