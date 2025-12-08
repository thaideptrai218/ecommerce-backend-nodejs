import { model, Schema, SchemaType } from "mongoose";

const DOCUMENT_NAME = "User";
const COLLECTION_NAME = "users";

const userSchema = new Schema(
    {
        usr_id: { type: Number, required: true },
        usr_slug: { type: String, required: true },
        usr_name: { type: String, default: "" },
        usr_password: { type: String, default: "" },
        usr_salt: { type: String, default: "" },
        usr_email: { type: String, required: true },
        usr_phone: { type: String, default: "" },
        user_sex: { type: String, default: "" },
        usr_avatar: { type: String, default: "" },
        usr_dob: { type: Date, default: null },
        usr_role: { type: Schema.Types.ObjectId, ref: "Role" },
        usr_status: {
            type: String,
            default: "pending",
            enum: ["pending", "active", "block"],
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

export default model(DOCUMENT_NAME, userSchema);
