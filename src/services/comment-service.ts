import commentModel from "../models/comment-model";
import { convertToObjectIdMongodb } from "../utils";

export class CommentService {
    static async createComment({
        productId,
        userId,
        content,
        parentCommentId = null,
    }: {
        productId: string;
        userId: number;
        content: string;
        parentCommentId?: string | null;
    }) {
        const comment = new commentModel({
            comment_productId: convertToObjectIdMongodb(productId),
            comment_userId: userId,
            comment_content: content,
            comment_parentId: parentCommentId ? convertToObjectIdMongodb(parentCommentId) : null,
        });

        let rightValue;

        if (!parentCommentId) {
            // ROOT COMMENT: Find the highest right value for this product
            const maxRightValue = await commentModel.findOne(
                {
                    comment_productId: convertToObjectIdMongodb(productId),
                },
                { comment_right: 1 },
                { sort: { comment_right: -1 } }
            );

            if (maxRightValue) {
                rightValue = maxRightValue.comment_right + 1;
            } else {
                rightValue = 1;
            }
        } else {
            // REPLY COMMENT: Find parent comment
            const parentComment = await commentModel.findById(parentCommentId);

            if (!parentComment) {
                throw new Error('Parent comment not found');
            }

            // Validate parent belongs to same product
            if (parentComment.comment_productId?.toString() !== productId) {
                throw new Error('Parent comment belongs to different product');
            }

            // Set insertion point at parent's right value
            rightValue = parentComment.comment_right;

            // CRITICAL: Shift existing ranges to make space
            // Update all comments with left >= rightValue (shift right by 2)
            await commentModel.updateMany(
                {
                    comment_productId: convertToObjectIdMongodb(productId),
                    comment_left: { $gte: rightValue }
                },
                { $inc: { comment_left: 2 } }
            );

            // Update all comments with right >= rightValue (shift right by 2)
            await commentModel.updateMany(
                {
                    comment_productId: convertToObjectIdMongodb(productId),
                    comment_right: { $gte: rightValue }
                },
                { $inc: { comment_right: 2 } }
            );
        }

        // Set the new comment's left and right values
        comment.comment_left = rightValue;
        comment.comment_right = rightValue + 1;

        await comment.save();
        return comment;
    }

    static async getCommentsByProduct({
        productId,
        page = 1,
        limit = 20
    }: {
        productId: string;
        page?: number;
        limit?: number;
    }) {
        const skip = (page - 1) * limit;

        const comments = await commentModel
            .find({
                comment_productId: convertToObjectIdMongodb(productId),
                isDeleted: false
            })
            .sort({ comment_left: 1 })
            .skip(skip)
            .limit(limit)
            .populate('comment_userId', 'name avatar')
            .lean();

        return this.buildTreeHierarchy(comments);
    }

    static async getCommentReplies({
        parentCommentId,
        page = 1,
        limit = 10
    }: {
        parentCommentId: string;
        page?: number;
        limit?: number;
    }) {
        const skip = (page - 1) * limit;

        // Find parent comment to get its range
        const parentComment = await commentModel.findById(parentCommentId);
        if (!parentComment) {
            throw new Error('Parent comment not found');
        }

        // Find all comments within parent's range (excluding parent itself)
        const replies = await commentModel
            .find({
                comment_productId: parentComment.comment_productId,
                comment_left: { $gt: parentComment.comment_left },
                comment_right: { $lt: parentComment.comment_right },
                isDeleted: false
            })
            .sort({ comment_left: 1 })
            .skip(skip)
            .limit(limit)
            .populate('comment_userId', 'name avatar')
            .lean();

        return this.buildTreeHierarchy(replies);
    }

    static async updateComment({
        commentId,
        userId,
        content
    }: {
        commentId: string;
        userId: number;
        content: string;
    }) {
        return await commentModel.findOneAndUpdate(
            {
                _id: commentId,
                comment_userId: userId,
                isDeleted: false
            },
            {
                comment_content: content
            },
            {
                new: true,
                runValidators: true
            }
        ).populate('comment_userId', 'name avatar');
    }

    static async deleteComment({
        commentId,
        userId
    }: {
        commentId: string;
        userId: number;
    }) {
        // Find the comment to delete
        const commentToDelete = await commentModel.findOne({
            _id: commentId,
            comment_userId: userId,
            isDeleted: false
        });

        if (!commentToDelete) {
            throw new Error('Comment not found or unauthorized');
        }

        const { comment_left, comment_right, comment_productId } = commentToDelete;
        const range = comment_right - comment_left + 1;

        // Delete the comment and all its descendants
        await commentModel.deleteMany({
            comment_productId,
            comment_left: { $gte: comment_left },
            comment_right: { $lte: comment_right }
        });

        // Shift left values to close the gap
        await commentModel.updateMany(
            {
                comment_productId,
                comment_left: { $gt: comment_right }
            },
            { $inc: { comment_left: -range } }
        );

        // Shift right values to close the gap
        await commentModel.updateMany(
            {
                comment_productId,
                comment_right: { $gt: comment_right }
            },
            { $inc: { comment_right: -range } }
        );

        return { success: true, message: 'Comment deleted successfully' };
    }

    static async getCommentById(commentId: string) {
        return await commentModel
            .findOne({
                _id: commentId,
                isDeleted: false
            })
            .populate('comment_userId', 'name avatar')
            .populate('comment_parentId', 'comment_content')
            .lean();
    }

    // Helper method to build nested tree structure from flat MPTT data
    static buildTreeHierarchy(comments: any[]) {
        const tree = [];
        const stack = [];

        for (const comment of comments) {
            // Remove nodes from stack until we find the parent
            while (stack.length > 0 && stack[stack.length - 1].comment_right < comment.comment_left) {
                stack.pop();
            }

            if (stack.length === 0) {
                // Root level comment
                tree.push(comment);
            } else {
                // Child comment - add to parent's replies
                if (!stack[stack.length - 1].replies) {
                    stack[stack.length - 1].replies = [];
                }
                stack[stack.length - 1].replies.push(comment);
            }

            stack.push(comment);
        }

        return tree;
    }
}
