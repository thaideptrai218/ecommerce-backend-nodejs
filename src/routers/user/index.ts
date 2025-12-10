import express from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import userController from "../../controllers/user-controller";

const router = express.Router();

router.post("/new_user", asyncHandler(userController.newUser));

export default router;
