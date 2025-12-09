import { model, Schema } from "mongoose";

const DOCUMENT_NAME = "Apikey";
const COLLECTION_NAME = "apikeys";

// Declare the Schema of the Mongo model
const userSchema = new Schema(
    {
        key: { type: String, required: true, unique: true },
        status: { type: Boolean, default: false },
        permissions: {
            type: [String],
            required: true,
            enum: ["0000", "1111", "2222"],
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

model(DOCUMENT_NAME, userSchema)
    .findOneAndUpdate(
        {
            key: "niggar-api-key",
        },
        { permissions: ["0000", "1111", "2222"], status: true },
        {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
        }
    )
    .then((result) => {
        console.log("ApiKey Upsert Result:", result);
    })
    .catch((err) => {
        console.error("ApiKey Upsert Error:", err);
    });

export default model(DOCUMENT_NAME, userSchema);
