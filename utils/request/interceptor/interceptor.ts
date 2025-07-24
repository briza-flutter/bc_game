import { BaseRequestProps } from "../types";

export abstract class Interceptor {
  abstract onRequest(request: BaseRequestProps): BaseRequestProps;
  abstract onResponse(response: Response): Promise<Response>;
  abstract onError(err: Error): Error;
}
