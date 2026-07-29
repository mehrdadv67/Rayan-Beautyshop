import { useUI } from "@contexts/ui.context";
import { API_ENDPOINTS } from "@framework/utils/api-endpoints";
import http from "@framework/utils/http";
import Cookies from "js-cookie";
import Router from "next/router";
import { useMutation } from "@tanstack/react-query";

export interface LoginInputType {
  email: string;
  password: string;
  remember_me: boolean;
}
async function logout() {
  try {
    await http.post(API_ENDPOINTS.LOGOUT);
  } catch (e) {
    console.warn("Logout endpoint failed, clearing local token only", e);
  }
  return {
    ok: true,
    message: "Logout Successful!",
  };
}
export const useLogoutMutation = () => {
  const { unauthorize } = useUI();
  return useMutation({
    mutationFn: logout,
    onSuccess: (_data) => {
      Cookies.remove("auth_token");
      unauthorize();
      Router.push("/");
    },
    onError: (data) => {
      console.log(data, "logout error response");
    },
  });
};
