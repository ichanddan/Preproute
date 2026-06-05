export type ToastOption = string | false;

export type RequestPayload = Record<string, unknown>;

export type ApiErrorData = {
  message?: string;
};

/** Standard backend envelope: every endpoint wraps its payload in `data`. */
export type ApiEnvelope<T> = {
  status: string;
  message: string;
  data: T;
};
