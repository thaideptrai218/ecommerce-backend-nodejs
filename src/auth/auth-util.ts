import JWT from "jsonwebtoken";

export const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        const accessToken = JWT.sign(payload, privateKey, {
            algorithm: "RS256",
            expiresIn: "2 days",
        });

        const refreshToken = JWT.sign(payload, privateKey, {
            algorithm: "RS256",
            expiresIn: "7 days",
        });

        return { accessToken, refreshToken };
    } catch (error) {
        return error;
    }
};
