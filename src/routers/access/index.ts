import express from "express";
import accessController from "../../controllers/access-controller";
import { asyncHandler } from "../../helpers/asyncHandler";
const router = express.Router();



// sign up
router.post("/shop/signup", asyncHandler(accessController.signUp));

// login
router.post("/shop/login", asyncHandler(accessController.login));

export { router };
