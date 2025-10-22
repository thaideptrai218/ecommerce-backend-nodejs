import type { Request, Response, NextFunction, RequestHandler } from "express";
import { findById } from "../services/apikey-service";

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
            return res.status(403).json({
                message: "Forbidden error",
            });
        }

        // check key in db.
        const objectKey = await findById(key);

        if (!objectKey) {
            return res.status(403).json({
                message: "Forbidden error",
            });
        }

        req["objectKey"] = objectKey;
        return next();
    } catch (error) {}
};

export const permission = (required: string): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        const permissions: string[] = req.objectKey?.permissions ?? [];
        if (!permissions.includes(required)) {
            return res.status(403).json({ message: "Permission denied" });
        }
        next();
    };
};
