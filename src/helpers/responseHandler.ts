import type { Response } from "express";
import { SuccessResponse } from "../core/success-respone";

const sendSuccessResponse = (res: Response, response: SuccessResponse) => {
    return res.status(response.status).json({
        message: response.message,
        metadata: response.metadata,
        options: response.options,
    });
};

export { sendSuccessResponse };
