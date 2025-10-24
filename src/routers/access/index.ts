import express from "express";
import accessController from "../../controllers/access-controller";
import { asyncHandler } from "../../helpers/asyncHandler";
import { authentication } from "../../auth/check-auth";
const router = express.Router();

// sign up
router.post("/shop/signup", asyncHandler(accessController.signUp));
// login
router.post("/shop/login", asyncHandler(accessController.login));


router.use(authentication)
// logout
router.post("/shop/logout", asyncHandler(accessController.logout));

export default router;
