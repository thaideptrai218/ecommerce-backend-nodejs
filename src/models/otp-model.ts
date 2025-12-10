import { model, Schema } from "mongoose";

const DOCUMENT_NAME = "otp-log";
const COLLECTION_NAME = "otp-logs";

const otpSchema = new Schema(
    {
        otp_token: { type: String, required: true },
        otp_email: { type: String, required: true },
        otp_status: {
            type: String,
            default: "pending",
            enum: ["pending", "active", "block"],
        },
        expiredAt: { type: Date, default: Date.now, expires: 60 },
    },
    {
        collection: COLLECTION_NAME,
        timestamps: true,
    }
);

export default model(DOCUMENT_NAME, otpSchema);
