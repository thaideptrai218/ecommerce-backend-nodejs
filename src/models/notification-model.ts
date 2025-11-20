import { model, Schema } from "mongoose";

const DOCUMENT_NAME = "Notification";
const COLLECTION_NAME = "notifications";

const notificationSchema = new Schema(
    {
        noti_type: {
            type: String,
            enum: [
                "ORDER-001",
                "ORDER-002",
                "PROMOTION-001",
                "PROMOTION-002",
                "SHOP-001",
            ],
            required: true,
        },
        noti_senderId: { type: String, required: true },
        noti_recivedId: { type: String, required: true },
        noti_content: { type: String, required: true },
        noti_options: { type: Object, default: {} },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

export default model(DOCUMENT_NAME, notificationSchema);
