import { ReasonPhrases, StatusCodes } from "http-status-codes";

class SuccessResponse {
    public message: string;
    public status: number;
    public metadata: any;

    constructor(
        message: string = ReasonPhrases.OK,
        status: number = StatusCodes.OK,
        metadata: any = {}
    ) {
        this.message = message;
        this.status = status;
        this.metadata = metadata;
    }
}

class OK extends SuccessResponse {
    constructor(
        message: string = ReasonPhrases.OK,
        metadata: any = {}
    ) {
        super(message, StatusCodes.OK, metadata);
    }
}

class Created extends SuccessResponse {
    constructor(
        message: string = ReasonPhrases.CREATED,
        metadata: any = {}
    ) {
        super(message, StatusCodes.CREATED, metadata);
    }
}

export {
    SuccessResponse,
    OK,
    Created
};
