import type { Request, Response, NextFunction } from "express";
import CommentService from "../services/comment-service";

const putComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const comment = await CommentService.putComment(req.body);
        res.status(201).json({
            elements: comment,
        });
    } catch (error) {
        next(error);
    }
};

const listComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const comments = await CommentService.listComment(req.query);
        res.status(200).json({
            elements: comments,
        });
    } catch (error) {
        next(error);
    }
}

export { putComment, listComment };