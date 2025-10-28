import type { Request, Response, NextFunction, RequestHandler } from "express";
import { findById } from "../services/apikey-service";
import {
    AuthFailureError,
    ForbiddenError,
    NotFoundError,
} from "../core/error-respone";
import { asyncHandler } from "../helpers/asyncHandler";
import { KeyTokenService } from "../services/key-token-service";
import JWT, { decode } from "jsonwebtoken";

const HEADER = {
    API_KEY: "x-api-key",
    AUTHORIZATION: "authorization",
    CLINET_ID: "x-client-id",
    REFRESHTOKEN: "refreshtoken",
};

export const apiKey = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
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
    }
);

export const permission = (required: string): RequestHandler => {
    return asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const permissions: string[] = req.objectKey?.permissions ?? [];
            if (!permissions.includes(required)) {
                throw new ForbiddenError("Permission denied");
            }
            next();
        }
    );
};

export const authentication = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.headers[HEADER.CLINET_ID];
        if (!userId) throw new AuthFailureError("Invalid request");

        const keyStore = await KeyTokenService.findByUserId(userId);
        if (!keyStore) throw new NotFoundError("Not found keyStore");

        const accessToken = req.headers[HEADER.AUTHORIZATION];

        if (!accessToken)
            throw new AuthFailureError("Invalid AUTHORIZATION header");

        const decodeUser = JWT.verify(accessToken, keyStore.secretKey);
        if (userId !== decodeUser.userId) {
            throw new AuthFailureError("Invalid UserId ");
        }

        req.keyStore = keyStore;
        req.user = decodeUser;
        return next();
    }
);

export const authenticationV2 = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.headers[HEADER.CLINET_ID];
        if (!userId) throw new AuthFailureError("Invalid request");

        const keyStore = await KeyTokenService.findByUserId(userId);
        if (!keyStore) throw new NotFoundError("Not found keyStore");

        const refreshToken = req.headers[HEADER.REFRESHTOKEN] as string;

        if (!refreshToken) {
            throw new AuthFailureError("No refreshToken Header!");
        }

        const decodeUser = JWT.verify(refreshToken, keyStore.secretKey);
        if (userId != decodeUser.userId)
            throw new AuthFailureError("Invalid UserId");
        req.keyStore = keyStore;
        req.user = decodeUser;
        req.refreshToken = refreshToken;

        console.log(decodeUser);
        console.log(keyStore);
        return next();
    }
);
