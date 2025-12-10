import { ErrorResponse } from "../core/error-respone";
import userModel from "../models/user-model";
import { sendEmailToken } from "./email-service";

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
