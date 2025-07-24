import { Interceptor } from "./interceptor/interceptor";

export type FetchClassProps = {
  baseUrl: string;
  headers?: HeadersInit;
  interceptor?: Interceptor[];
};

export type BaseRequestProps = Pick<
  RequestInit,
  "body" | "headers" | "method"
> & {
  url: string;
};
