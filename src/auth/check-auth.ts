import type { Request, Response, NextFunction, RequestHandler } from "express";
import { findById } from "../services/apikey-service";
import { AuthFailureError, ForbiddenError } from "../core/error-respone";

const HEADER = {
    API_KEY: "x-api-key",
    AUTHORIZATION: "authorization",
};

export const apiKey = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString();

        if (!key) {
            throw new AuthFailureError("Forbidden Error");
        }

        // check key in db.
        const objectKey = await findById(key);

        if (!objectKey) {
            throw new AuthFailureError("Forbidden Error");
        }

        req["objectKey"] = objectKey;
        return next();
    } catch (error) {
        next(error);
    }
};

export const permission = (required: string): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        const permissions: string[] = req.objectKey?.permissions ?? [];
        if (!permissions.includes(required)) {
            throw new ForbiddenError("Permission denied");
        }
        next();
    };
};



