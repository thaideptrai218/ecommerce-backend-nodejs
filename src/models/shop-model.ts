import { Schema, model } from "mongoose"; // Erase if already required

const DOCUMENT_NAME = "Shop";
const COLLECTION_NAME = "shops";

// Declare the Schema of the Mongo model
const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },

        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "inactive",
        },

        verify: {
            type: Schema.Types.Boolean,
            default: false,
        },

        roles: {
            type: Array,
            default: [],
        },
    },
    {
        collection: COLLECTION_NAME,
    }
);

//Export the model
export const shopModel = model(DOCUMENT_NAME, userSchema);
