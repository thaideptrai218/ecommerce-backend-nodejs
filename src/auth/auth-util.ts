import JWT from "jsonwebtoken";

export const createTokenPair = async (payload, secretKey) => {
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
