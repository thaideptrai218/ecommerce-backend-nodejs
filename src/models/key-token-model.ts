import { Schema, SchemaType, model } from "mongoose";

const DOCUMENT_NAME = "Key";
const COLLECTION_NAME = "keys";

const keyTokenSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            require: true,
            ref: "Shop",
        },

        publicKey: {
            type: String,
            require: true,
        },

        refreshToken: {
            type: Array,
            default: [],
        },
    },
    {
        collection: COLLECTION_NAME,
        timestamps: true,
    }
);

export default model(DOCUMENT_NAME, keyTokenSchema);
