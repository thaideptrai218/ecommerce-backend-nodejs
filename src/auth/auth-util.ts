import JWT from "jsonwebtoken";

interface JWTPayload {
    userId: string;
    email: string;
    name: string;
}

export const createTokenPair = async (
    payload: JWTPayload,
    secretKey: string
) => {
    const accessToken = JWT.sign(payload, secretKey, {
        algorithm: "HS256",
        expiresIn: "15d",
    });

    const refreshToken = JWT.sign(payload, secretKey, {
        algorithm: "HS256",
        expiresIn: "7d",
    });

    return { accessToken, refreshToken };
};

export const verifyJWT = (token: string, secretKey: string) => {
    return JWT.verify(token, secretKey) as JWTPayload;
};
