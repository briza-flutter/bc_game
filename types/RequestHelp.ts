export type RequestResponse<T> = {
  code: number;
  msg?: string;
  data: T;
};
