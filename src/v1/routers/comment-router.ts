import express from "express";
import { putComment, listComment } from "../controllers/comment-controller";

const router = express.Router();

router.post("/comments", putComment);
router.get("/comments", listComment);

export default router;