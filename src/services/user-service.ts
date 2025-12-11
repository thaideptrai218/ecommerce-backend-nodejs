import { ErrorResponse } from "../core/error-respone";
import userModel from "../models/user-model";
import { sendEmailToken } from "./email-service";
import { checkEmailToken } from "./otp-service";
import crypto from "node:crypto";
import { KeyTokenService } from "./key-token-service";
import { createTokenPair } from "../auth/auth-util";
import { getInfoData } from "../utils/object-utils";

export const newUser = async ({ email = null, captcha = null }) => {
    //1. Check email exists in dbs
    const user = await userModel.findOne({ usr_email: email }).lean();

    //2. If exists
    if (user) {
        return new ErrorResponse("Email already exists", 111);
    }

    //3. Send token via email user
    const result = await sendEmailToken({
        email,
    });

    return {
        message: "Verify email user",
        metadata: {
            token: result,
        },
    };
};

export const checkLoginEmailTokenService = async ({ token }) => {
    //1. Check token in mode otp
    const { otp_email } = await checkEmailToken({ token });
    if (!otp_email) throw new ErrorResponse(`Token not found`, 404);

    //2. check email exists in user model.
    const hasUser = await findUserByEmailWithLogin({
        email: otp_email,
    });
    if (hasUser) throw new ErrorResponse(`Email already exists`, 404);

    //3. new user
    const passwordHash = crypto.randomBytes(10).toString("hex");
    const newUserId = Date.now();
    const newUser = await userModel.create({
        usr_id: newUserId,
        usr_slug: otp_email,
        usr_email: otp_email,
        usr_name: otp_email,
        usr_password: passwordHash,
    });

    if (!newUser) throw new ErrorResponse("User creation failed", 500);

    //4. Generate tokens
    const secretKey = crypto.randomBytes(64).toString("hex");
    const tokens = await createTokenPair(
        {
            userId: newUser._id.toString(),
            email: otp_email,
            name: newUser.usr_name,
        },
        secretKey
    );

    const keyStore = await KeyTokenService.createKeyToken({
        userId: newUser._id,
        secretKey,
        refreshToken: tokens.refreshToken,
    });

    if (!keyStore) {
        throw new ErrorResponse("keyStore error", 500);
    }

    return {
        message: "User registered successfully!",
        metadata: {
            user: getInfoData({
                fields: ["usr_id", "usr_name", "usr_email"],
                object: newUser,
            }),
            tokens,
        },
    };
};

const findUserByEmailWithLogin = async ({ email }) => {
    const user = await userModel.findOne({ usr_email: email }).lean();
    return user;
};
