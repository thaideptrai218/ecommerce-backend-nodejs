import express from "express";
import accessController from "../../controllers/access-controller";
import { asyncHandler } from "../../helpers/asyncHandler";
import { authentication, authenticationV2 } from "../../auth/check-auth";
const router = express.Router();

// sign up
router.post("/shop/signup", asyncHandler(accessController.signUp));
// login
router.post("/shop/login", asyncHandler(accessController.login));

// authentication middleware for protected routes
router.use(authentication);

// profile route
router.get("/shop/profile", asyncHandler(async (req, res) => {
    return res.status(200).json({
        message: "User profile data",
        user: req.user,
    });
}));

// logout
router.post("/shop/logout", authentication, asyncHandler(accessController.logout));
router.post(
    "/shop/refresh-token",
    authenticationV2, // Apply authenticationV2 directly to this route
    asyncHandler(accessController.handleRefreshToken)
);

export default router;

