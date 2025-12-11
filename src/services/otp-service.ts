import crypto from "node:crypto";
import otpModel from "../models/otp-model";

const generatorTokenRandom = () => {
    // Generate a random integer between 100000 and 999999 (inclusive)
    const token = crypto.randomInt(100000, 1000000);
    return token.toString();
};

export const newOtp = async ({ email }) => {
    const token = generatorTokenRandom();
    const newToken = await otpModel.create({
        otp_token: token,
        otp_email: email,
    });
    return newToken;
};

export const checkEmailToken = async ({ token }) => {
    const foundToken = await otpModel.findOne({
        otp_token: token,
    });

    if (!foundToken) throw new Error("Token not found");

    otpModel.deleteOne({ otp_token: token }).then();

    return foundToken;
};
