import { axiosApi, responseHandler } from "~/services/core";
import type {
  ApiEnvelope,
  CreateTestPayload,
  Test,
  ToastOption,
  UpdateTestPayload,
} from "~/types";

export const TestApi = {
  GetTests: () => responseHandler<ApiEnvelope<Test[]>>(axiosApi.get("/tests")),

  GetTest: (id: string) =>
    responseHandler<ApiEnvelope<Test>>(axiosApi.get(`/tests/${id}`)),

  CreateTest: (
    data: CreateTestPayload,
    toastSuccess: ToastOption = false,
    toastLoading: ToastOption = false,
  ) =>
    responseHandler<ApiEnvelope<Test>>(
      axiosApi.post("/tests", data),
      toastSuccess,
      toastLoading,
    ),

  UpdateTest: (
    id: string,
    data: UpdateTestPayload,
    toastSuccess: ToastOption = false,
    toastLoading: ToastOption = false,
  ) =>
    responseHandler<ApiEnvelope<Test>>(
      axiosApi.put(`/tests/${id}`, data),
      toastSuccess,
      toastLoading,
    ),

  DeleteTest: (
    id: string,
    toastSuccess: ToastOption = false,
    toastLoading: ToastOption = false,
  ) =>
    responseHandler<ApiEnvelope<null>>(
      axiosApi.delete(`/tests/${id}`),
      toastSuccess,
      toastLoading,
    ),
};
