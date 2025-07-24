import { userHeader, Cookie } from "../../../constants/httpHeaders";
import { RequestResponse } from "../../../types/RequestHelp";
import { BusinessError } from "../BusinessError";
import { BaseRequestProps } from "../types";
import { Interceptor } from "./interceptor";

export class BcGameInterceptor extends Interceptor {
  onRequest(request: BaseRequestProps): BaseRequestProps {
    request.headers = { ...userHeader, Cookie };
    return request;
  }
  async onResponse(response: Response): Promise<Response> {
    const body = (await response.clone().json()) as RequestResponse<any>;
    console.log("原始响应:", body);
    if (body.code === 0) {
      return new Response(JSON.stringify(body.data), {
        ...response,
      });
    }
    throw new BusinessError(`${body.msg}`, body);
  }
  onError(err: Error): Error {
    if (err instanceof BusinessError) {
      console.log("请求错误Toast:", err.info.code, err.info.msg);
    }
    return err;
  }
}
