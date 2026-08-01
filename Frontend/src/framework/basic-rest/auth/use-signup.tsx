import { useUI } from "@contexts/ui.context";
import { API_ENDPOINTS } from "@framework/utils/api-endpoints";
import http from "@framework/utils/http";
import Cookies from "js-cookie";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

export interface SignUpInputType {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  zipCode?: string;
  gender?: string;
}

async function signUp(input: SignUpInputType) {
  console.log('Calling register API:', input);
  const { data } = await http.post(API_ENDPOINTS.REGISTER, {
    username: input.username,
    email: input.email,
    password: input.password,
    firstName: input.firstName,
    lastName: input.lastName,
    phoneNumber: input.phoneNumber,
    address: input.address,
    city: input.city,
    zipCode: input.zipCode,
    gender: input.gender,
  });
  console.log('Register API response:', data);
  return data;
}

export const useSignUpMutation = () => {
  const { authorize, closeModal } = useUI();
  return useMutation({
    mutationFn: (input: SignUpInputType) => {
      console.log('SignUp mutation called with:', input);
      return signUp(input);
    },
    onSuccess: (data) => {
      console.log('SignUp success:', data);
      Cookies.set("auth_token", data.jwt);
      authorize();
      closeModal();
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.error?.message ||
        error?.message ||
        'خطا در ثبت نام. لطفا دوباره تلاش کنید.';
      toast.error(message);
    },
  });
};
