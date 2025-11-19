import type { Request, Response } from "express";
import { CommentService } from "../services/comment-service";
import { NotFoundError } from "../core/error-respone";
import { Created, OK } from "../core/success-respone";
import { Types } from "mongoose";

class CommentController {
    static async createComment(req: Request, res: Response) {
        const { productId, content, parentCommentId } = req.body;
        const { userId } = req.user;

        const comment = await CommentService.createComment({
            productId,
            userId,
            content,
            parentCommentId
        });

        return new Created("Comment created successfully!", comment).send(res);
    }

    static async getCommentsByProduct(req: Request, res: Response) {
        const { productId } = req.params;
        const { page = 1, limit = 20 } = req.query;

        const comments = await CommentService.getCommentsByProduct({
            productId,
            page: Number(page),
            limit: Number(limit)
        });

        return new OK("Get comments successfully!", comments).send(res);
    }

    static async getCommentReplies(req: Request, res: Response) {
        const { commentId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const replies = await CommentService.getCommentReplies({
            parentCommentId: commentId,
            page: Number(page),
            limit: Number(limit)
        });

        return new OK("Get comment replies successfully!", replies).send(res);
    }

    static async updateComment(req: Request, res: Response) {
        const { commentId } = req.params;
        const { content } = req.body;
        const { userId } = req.user;

        const updatedComment = await CommentService.updateComment({
            commentId,
            userId,
            content
        });

        if (!updatedComment) {
            throw new NotFoundError("Comment not found or unauthorized");
        }

        return new OK("Comment updated successfully!", updatedComment).send(res);
    }

    static async deleteComment(req: Request, res: Response) {
        const { commentId } = req.params;
        const { userId } = req.user;

        const deletedComment = await CommentService.deleteComment({
            commentId,
            userId
        });

        if (!deletedComment) {
            throw new NotFoundError("Comment not found or unauthorized");
        }

        return new OK("Comment deleted successfully!", null).send(res);
    }

    static async getCommentById(req: Request, res: Response) {
        const { commentId } = req.params;

        const comment = await CommentService.getCommentById(commentId);

        if (!comment) {
            throw new NotFoundError("Comment not found");
        }

        return new OK("Get comment successfully!", comment).send(res);
    }
}

export default CommentController;