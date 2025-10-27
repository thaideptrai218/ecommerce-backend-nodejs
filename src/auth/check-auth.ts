import type { Request, Response, NextFunction, RequestHandler } from "express";
import { findById } from "../services/apikey-service";
import {
    AuthFailureError,
    ForbiddenError,
    NotFoundError,
} from "../core/error-respone";
import { asyncHandler } from "../helpers/asyncHandler";
import { KeyTokenService } from "../services/key-token-service";
import JWT from "jsonwebtoken";

const HEADER = {
    API_KEY: "x-api-key",
    AUTHORIZATION: "authorization",
    CLINET_ID: "x-client-id",
    REFRESHTOKEN: "refreshtoken",
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

export const authentication = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        /**
1. Extract Headers and Basic Validation:
       * Retrieve the userId (from x-client-id) and the accessToken (from Authorization header).
       * If either is missing, immediately reject the request with an AuthFailureError. This is a quick first 
         check.

   2. Fetch KeyStore:
       * Use the userId to find the corresponding keyStore in your database (e.g., using 
         KeyTokenService.findByUserId).
       * If no keyStore is found, it means the user is not logged in or the session is invalid. Reject with a 
         NotFoundError.

   3. Verify Access Token:
       * Now that you have the keyStore, you have the secretKey needed to verify the accessToken.
       * Use a library like jsonwebtoken to verify the token (jwt.verify(accessToken, keyStore.secretKey)). This 
         will automatically check for expiration and signature validity.
       * If verification fails, it will throw an error. Catch it and re-throw it as an AuthFailureError.

   4. Match UserID from Token:
       * After successful verification, the token will be decoded. The decoded payload should contain the userId.
       * Compare the userId from the decoded token with the userId from the header. If they don't match, it's a 
         sign of a potential security issue, so throw an AuthFailureError.

   5. Attach Data to Request:
       * If all checks pass, attach the keyStore and the decoded user information to the request object (e.g., 
         req.keyStore = keyStore, req.user = decodeUser). This makes the data available to downstream middleware 
         and controllers.

   6. Proceed to Next Middleware:
       * Call next() to pass the request to the next handler in the chain.
    */

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

        console.log("KEY STORE::::", keyStore);

        const refreshToken = req.headers[HEADER.REFRESHTOKEN] as string;

        console.log("refresh TOKEN", refreshToken);

        if (!refreshToken) {
            throw new AuthFailureError("No refreshToken Header!");
        }

        const decodeUser = JWT.verify(refreshToken, keyStore.secretKey);
        if (userId != decodeUser.userId)
            throw new AuthFailureError("Invalid UserId");
        req.keyStore = keyStore;
        req.user = decodeUser;
        req.refreshToken = refreshToken;
        return next();
    }
);
