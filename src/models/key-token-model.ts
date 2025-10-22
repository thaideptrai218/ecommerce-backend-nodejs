import { TOO_MANY_REQUESTS } from "http-status-codes";
import { Schema, SchemaType, model } from "mongoose";

const DOCUMENT_NAME = "Key";
const COLLECTION_NAME = "keys";

const keyTokenSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Shop",
        },

        secretKey: {
            type: String,
            required: true,
        },

        refreshTokenUsed: {
            type: Array,
            default: [],
        },

        refreshToken: {
            type: String,
            required: true,
        },
    },
    {
        collection: COLLECTION_NAME,
        timestamps: true,
    }
);

export default model(DOCUMENT_NAME, keyTokenSchema);
