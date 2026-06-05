import axios, { type AxiosResponse } from "axios";
import { toast } from "sonner";

import type { ApiErrorData, ToastOption, UserSession } from "~/types";

const SESSION_KEY = "userSession";

export function getSession(): UserSession | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(SESSION_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as UserSession;
  } catch {
    return null;
  }
}

export function getToken(): string | undefined {
  return getSession()?.token;
}

export function setSession(session: UserSession): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SESSION_KEY);
}

export const axiosApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosApi.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export async function responseHandler<T>(
  apiCall: Promise<AxiosResponse<T>>,
  toastSuccess: ToastOption = false,
  toastLoading: ToastOption = false,
): Promise<T | null> {
  const toastId = "api-request";
  if (toastLoading) toast.loading(toastLoading, { id: toastId });

  try {
    const response = await apiCall;
    if (toastSuccess) toast.success(toastSuccess, { id: toastId });
    else if (toastLoading) toast.dismiss(toastId);
    return response.data;
  } catch (error) {
    const status = axios.isAxiosError(error) ? error.response?.status : undefined;
    const message = axios.isAxiosError<ApiErrorData>(error)
      ? error.response?.data?.message
      : undefined;

    switch (status) {
      case 400:
        toast.error(`Error 400 : ${message ?? "Bad request."}`, { id: toastId });
        break;
      case 401:
        toast.error(
          `Unauthorized 401 : ${message ?? "Action is not permitted."}`,
          { id: toastId },
        );
        break;
      case 403:
        toast.error("Unauthorized 403 : Action forbidden.", { id: toastId });
        break;
      case 404:
      case 409:
        toast.error(message ?? "Something went wrong.", { id: toastId });
        break;
      case 500:
        toast.error(`Error 500 : ${message ?? "Internal server error."}`, {
          id: toastId,
        });
        break;
      default:
        toast.error("Error : Something went wrong. Please contact admin.", {
          id: toastId,
        });
    }

    return null;
  }
}

export function parseMongoId(id?: string): string {
  if (!id) return "";
  return parseInt(`${id.substring(0, 4)}${id.substring(20)}`, 16).toString();
}

export function toCapitalized(str?: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
