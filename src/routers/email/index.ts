import express from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import emailController from "../../controllers/email-controller";

const router = express.Router();

router.post("/new_template", asyncHandler(emailController.newTemplate));
router.post("/send_email_token", asyncHandler(emailController.sendEmailToken));

export default router;
