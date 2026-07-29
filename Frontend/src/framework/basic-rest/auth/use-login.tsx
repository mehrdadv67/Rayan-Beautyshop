import { useUI } from '@contexts/ui.context';
import { API_ENDPOINTS } from "@framework/utils/api-endpoints";
import http from "@framework/utils/http";
import Cookies from 'js-cookie';
import { useMutation } from '@tanstack/react-query';

export interface LoginInputType {
  email: string;
  password: string;
  remember_me: boolean;
}

async function login(input: LoginInputType) {
  const { data } = await http.post(API_ENDPOINTS.LOGIN, {
    identifier: input.email,
    password: input.password,
  });
  return data;
}

export const useLoginMutation = () => {
  const { authorize, closeModal } = useUI();
  return useMutation({
    mutationFn: (input: LoginInputType) => login(input),
    onSuccess: (data) => {
      Cookies.set('auth_token', data.jwt);
      authorize();
      closeModal();
    },
    onError: (data) => {
      console.log(data, 'login error response');
    },
  });
};
