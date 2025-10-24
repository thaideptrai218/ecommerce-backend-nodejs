import JWT from "jsonwebtoken";
import { asyncHandler } from "../helpers/asyncHandler";

interface JWTPayload {
    userId: string;
    email: string;
}

export const createTokenPair = async (
    payload: JWTPayload,
    secretKey: string
) => {
    const accessToken = JWT.sign(payload, secretKey, {
        algorithm: "HS256",
        expiresIn: "2 days",
    });

    const refreshToken = JWT.sign(payload, secretKey, {
        algorithm: "HS256",
        expiresIn: "7 days",
    });

    return { accessToken, refreshToken };
};

const authentication = asyncHandler(async (req, res, next) => {
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
});
