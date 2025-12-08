import { model, Schema } from "mongoose";

const DOCUMENT_NAME = "Resource";
const COLLECTION_NAME = "resources";

const resourceSchema = new Schema(
    {
        src_name: {type: String, required: true},
        src_slug: {type: String, required: true},
        src_desc: {type: String, default: ''},
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

export default model(DOCUMENT_NAME, resourceSchema);
