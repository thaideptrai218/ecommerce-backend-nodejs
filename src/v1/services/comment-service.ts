import { commentSchema } from "../models/comment-model";

class CommentService {
    static putComment = async ({
        isDEL = "NO",
        discuss_id = 0,
        text = "",
        parent_slug = "",
        slug = "1000",
        author = "",
        posted = new Date(),
    }) => {
        try {
            if (isDEL === "YES") {
                await commentSchema.deleteMany();
            }

            // 1. Create full_slug
            let full_slug = `${posted.toISOString()}:${slug}`;

            const parentSlug = await commentSchema.findOne({
                discuss_id,
                slug: parent_slug,
            });

            if (parentSlug) {
                full_slug = `${parentSlug.full_slug}/${full_slug}`;
                slug = `${parentSlug.slug}/${slug}`;
            }

            const comment = await commentSchema.create({
                parent_slug,
                discuss_id,
                text,
                full_slug,
                author,
                slug,
            });

            return comment;
        } catch (err) {
            console.log(`[E]:putComment:`, err);
        }
    };

    static listComment = async ({
        parent_slug = "",
        slug = "",
        discuss_id = 0,
        replies,
        limit = 10,
        skip = 0,
    }) => {
        try {
            const match = { discuss_id };

            if (slug !== "") {
                match["full_slug"] = new RegExp(slug, "i");
            }

            const comments = await commentSchema
                .find(match, {
                    _id: 0,
                    text: 1,
                    slug: 1,
                    full_slug: 1,
                    parent_slug: 1,
                    author: 1,
                })
                .sort({ full_slug: 1 });

            return comments;
        } catch (err) {
            console.log(err);
        }
    };
}

export default CommentService;
