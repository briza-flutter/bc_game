import { RequestResponse } from "../../types/RequestHelp";

export class BusinessError extends Error {
    info: RequestResponse<any>;
    constructor(message: string, info: RequestResponse<any>) {
        super(message);
        this.name = "BusinessError";
        this.info = info;
    }
}