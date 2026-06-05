import { AuthApi } from "~/services/apis/auth";
import { QuestionApi } from "~/services/apis/questions";
import { SubjectApi } from "~/services/apis/subjects";
import { TestApi } from "~/services/apis/tests";

export const API = {
  ...AuthApi,
  ...SubjectApi,
  ...TestApi,
  ...QuestionApi,
};

export {
  axiosApi,
  responseHandler,
  getToken,
  getSession,
  setSession,
  clearSession,
  parseMongoId,
  toCapitalized,
} from "~/services/core";
