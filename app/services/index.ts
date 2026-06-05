import { AuthApi } from "~/services/apis/auth";

export const API = {
  ...AuthApi,
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
