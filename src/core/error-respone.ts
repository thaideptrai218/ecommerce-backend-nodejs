import { ReasonPhrases, StatusCodes } from "http-status-codes";

class ErrorResponse extends Error {
    public status: number;

    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

class ConflictRequestError extends ErrorResponse {
    constructor(
        message: string = ReasonPhrases.CONFLICT,
        statusCode: number = StatusCodes.CONFLICT
    ) {
        super(message, statusCode);
    }
}

class BadRequestError extends ErrorResponse {
    constructor(
        message: string = ReasonPhrases.BAD_REQUEST,
        statusCode: number = StatusCodes.BAD_REQUEST
    ) {
        super(message, statusCode);
    }
}

class AuthFailureError extends ErrorResponse {
    constructor(
        message: string = ReasonPhrases.UNAUTHORIZED,
        statusCode: number = StatusCodes.UNAUTHORIZED
    ) {
        super(message, statusCode);
    }
}

class NotFoundError extends ErrorResponse {
    constructor(
        message: string = ReasonPhrases.NOT_FOUND,
        statusCode: number = StatusCodes.NOT_FOUND
    ) {
        super(message, statusCode);
    }
}

class ForbiddenError extends ErrorResponse {
    constructor(
        message: string = ReasonPhrases.FORBIDDEN,
        statusCode: number = StatusCodes.FORBIDDEN
    ) {
        super(message, statusCode);
    }
}

class DatabaseError extends ErrorResponse {
    constructor(
        message: string = ReasonPhrases.INTERNAL_SERVER_ERROR,
        statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR
    ) {
        super(message, statusCode);
    }
}

export class RedisErrorRespone extends ErrorResponse {
    constructor(
        message: string = ReasonPhrases.INTERNAL_SERVER_ERROR,
        statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR
    ) {
        super(message, statusCode);
    }
}

export {
    ErrorResponse,
    ConflictRequestError,
    BadRequestError,
    AuthFailureError,
    NotFoundError,
    ForbiddenError,
    DatabaseError,
};
