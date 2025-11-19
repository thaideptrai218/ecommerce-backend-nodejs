import { model, Schema } from "mongoose";

const DOCUMENT_NAME = "Comment";
const COLLECTION_NAME = "comments";

const commentSchema = new Schema(
    {
        comment_productId: { type: Schema.Types.ObjectId, ref: "Product" },
        comment_userId: { type: Schema.Types.ObjectId, ref: "Shop" },
        comment_content: { type: String, default: "text" },
        comment_left: { type: Number, default: 0 },
        comment_right: { type: Number, default: 0 },
        comment_parentId: { type: Schema.Types.ObjectId, ref: DOCUMENT_NAME },
        isDeleted: { type: Boolean, default: false },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

export default model(DOCUMENT_NAME, commentSchema);
