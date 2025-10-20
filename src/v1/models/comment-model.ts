import { Schema, model } from "mongoose";

export const commentSchema = model(
    "comments",
    new Schema(
        {
            author: { type: Object },
            discuss_id: Number,
            posted: Date,
            text: String,
            parent_slug: String,
            score: Number,
            slug: String,
            comment_likes: Array,
            comment_like_num: Number,
            full_slug: String,
        },
        {
            collection: "comments",
            timestamps: true,
        }
    )
);
