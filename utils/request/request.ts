import { baseUrl } from "../../constants/requestUrl";
import { Interceptor } from "./interceptor/interceptor";
import { BcGameInterceptor } from "./interceptor/responseInterceptor";
import { BaseRequestProps, FetchClassProps } from "./types";

class FetchClass {
  baseUrl: string;
  headers?: HeadersInit;
  interceptor?: Interceptor[];
  constructor({ baseUrl, headers, interceptor }: FetchClassProps) {
    this.baseUrl = baseUrl;
    this.headers = headers;
    this.interceptor = interceptor;
  }

  async request({ method, body, headers, url }: BaseRequestProps) {
    let requestProps: BaseRequestProps = { method, body, headers, url };
    try {
      // 依次执行 onRequest
      if (this.interceptor) {
        for (const inter of this.interceptor) {
          requestProps = inter.onRequest(requestProps);
        }
      }
      let responsePromise = await fetch(`${this.baseUrl}${url}`, {
        method: requestProps.method,
        body: JSON.stringify(requestProps.body),
        headers: { ...this.headers, ...requestProps.headers },
      });
      // 依次执行 onResponse
      if (this.interceptor) {
        for (const inter of this.interceptor) {
          responsePromise = await inter.onResponse(responsePromise);
        }
      }

      return responsePromise;
    } catch (error) {
      let err = error;
      // 依次执行 onError
      if (this.interceptor) {
        for (const inter of this.interceptor) {
          err = inter.onError(err as Error);
        }
      }
      throw err;
    }
  }

  post(url: string, data: any) {
    return this.request({ method: "POST", body: data, url });
  }

  get(url: string, data?: any) {
    return this.request({ method: "GET", body: data, url });
  }
}

export const bcGameRequest = new FetchClass({
  baseUrl: baseUrl,
  interceptor: [new BcGameInterceptor()]
});
