import { useUI } from "@contexts/ui.context";
import { API_ENDPOINTS } from "@framework/utils/api-endpoints";
import http from "@framework/utils/http";
import Cookies from "js-cookie";
import { useMutation } from "@tanstack/react-query";

export interface SignUpInputType {
  email: string;
  password: string;
  name: string;
}

async function signUp(input: SignUpInputType) {
  console.log('Calling register API:', input);
  const { data } = await http.post(API_ENDPOINTS.REGISTER, {
    username: input.name,
    email: input.email,
    password: input.password,
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
    onError: (data) => {
      console.log(data, "signup error response");
    },
  });
};
