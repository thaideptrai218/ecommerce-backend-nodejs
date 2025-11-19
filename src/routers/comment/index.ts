import express from "express";
import commentController from "../../controllers/comment-controller";
import { asyncHandler } from "../../helpers/asyncHandler";
import { authentication } from "../../auth/check-auth";

const router = express.Router();

// Public routes
router.get(
    "/product/:productId",
    asyncHandler(commentController.getCommentsByProduct)
);
router.get("/:commentId", asyncHandler(commentController.getCommentById));
router.get(
    "/:commentId/replies",
    asyncHandler(commentController.getCommentReplies)
);

// Apply authentication middleware to all remaining routes
router.use(authentication);

router.post("/", asyncHandler(commentController.createComment));
router.patch("/:commentId", asyncHandler(commentController.updateComment));
router.delete("/:commentId", asyncHandler(commentController.deleteComment));

export default router;
