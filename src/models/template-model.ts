import { model, Schema } from "mongoose";

const DOCUMENT_NAME = "Template";
const COLLECTION_NAME = "templates";

const templateSchema = new Schema(
    {
        tem_name: { type: String, required: true },
        tem_status: { type: String, default: "active" },
        tem_html: { type: String, required: true },
    },
    {
        collection: COLLECTION_NAME,
        timestamps: true,
    }
);

export default model(DOCUMENT_NAME, templateSchema);
