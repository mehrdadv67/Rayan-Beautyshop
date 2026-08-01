import { useMutation, useQueryClient } from '@tanstack/react-query';
import http from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
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
  const meResponse = await http.get(API_ENDPOINTS.USERS_ME);
  const userId = meResponse.data.id;

  const { password, confirmPassword, displayName, ...rest } = input;

  const updateData: Record<string, unknown> = { ...rest };

  if (displayName) {
    updateData.username = displayName;
  }

  if (password && password.trim() !== '') {
    updateData.password = password;
  }

  const { data } = await http.put(
    `${API_ENDPOINTS.USERS}/${userId}`,
    updateData
  );
  return data;
}

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateUserType) => updateUser(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/users-permissions/users/me'] });
      toast.success('تغییرات با موفقیت ذخیره شد');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error?.message || 'خطا در ذخیره تغییرات';
      toast.error(message);
    },
  });
};
