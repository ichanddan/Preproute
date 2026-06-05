import { axiosApi, responseHandler } from "~/services/core";
import type { LoginPayload, LoginResponse, ToastOption } from "~/types";

export const AuthApi = {
  Login: (
    data: LoginPayload,
    toastSuccess: ToastOption = false,
    toastLoading: ToastOption = false,
  ) =>
    responseHandler<LoginResponse>(
      axiosApi.post<LoginResponse>("/auth/login", data),
      toastSuccess,
      toastLoading,
    ),
};
