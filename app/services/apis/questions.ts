import { axiosApi, responseHandler } from "~/services/core";
import type {
  ApiEnvelope,
  Question,
  QuestionPayload,
  ToastOption,
} from "~/types";

export const QuestionApi = {
  BulkCreate: (
    questions: QuestionPayload[],
    toastSuccess: ToastOption = false,
    toastLoading: ToastOption = false,
  ) =>
    responseHandler<ApiEnvelope<Question[]>>(
      axiosApi.post("/questions/bulk", { questions }),
      toastSuccess,
      toastLoading,
    ),

  FetchBulk: (questionIds: string[]) =>
    responseHandler<ApiEnvelope<Question[]>>(
      axiosApi.post("/questions/fetchBulk", { question_ids: questionIds }),
    ),
};
