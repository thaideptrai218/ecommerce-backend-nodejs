import { model, Schema } from "mongoose";

const DOCUMENT_NAME = "Apikey";
const COLLECTION_NAME = "apikeys";

// Declare the Schema of the Mongo model
const userSchema = new Schema(
    {
        key: { type: String, require: true, unique: true },
        status: { type: Boolean, default: false },
        permissions: {
            type: [String],
            require: true,
            enum: ["0000", "1111", "2222"],
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

export default model(DOCUMENT_NAME, userSchema);
