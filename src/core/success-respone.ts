/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReasonPhrases, StatusCodes } from "http-status-codes";

class SuccessResponse {
    public message: string;
    public status: number;
    public metadata: any;
    public options: any;

    constructor(
        message: string = ReasonPhrases.OK,
        status: number = StatusCodes.OK,
        metadata: any = {},
        options: any = {}
    ) {
        this.message = message;
        this.status = status;
        this.metadata = metadata;
        this.options = options;
    }
}

class OK extends SuccessResponse {
    constructor(
        message: string = ReasonPhrases.OK,
        metadata: any = {},
        options: any = {}
    ) {
        super(message, StatusCodes.OK, metadata, options);
    }
}

class Created extends SuccessResponse {
    constructor(
        message: string = ReasonPhrases.CREATED,
        metadata: any = {},
        options: any = {}
    ) {
        super(message, StatusCodes.CREATED, metadata, options);
    }
}

export {
    SuccessResponse,
    OK,
    Created
};
