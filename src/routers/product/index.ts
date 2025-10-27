import express from "express";
import productController from "../../controllers/product-controller";
import { asyncHandler } from "../../helpers/asyncHandler";
import { authentication, apiKey, permission } from "../../auth/check-auth";

const router = express.Router();

// Apply authentication middleware to all product routes
router.use(authentication);
router.use(apiKey);
router.use(permission("0000")); // Assuming '0000' is a default permission for product creation

router.post("/", asyncHandler(productController.createProduct));

export default router;
