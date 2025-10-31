import express from "express";
import discountController from "../../controllers/discount-controller";
import { asyncHandler } from "../../helpers/asyncHandler";
import { authentication } from "../../auth/check-auth";

const router = express.Router();

// Apply authentication middleware to all discount routes
router.use(authentication);

// Create discount code
router.post("/", asyncHandler(discountController.createDiscountCode));

// Update discount code
router.patch("/:discountId", asyncHandler(discountController.updateDiscountCode));

// Get all discount codes for shop
router.get("/shop/all", asyncHandler(discountController.getAllDiscountCodesByShop));

// Get discount code with products
router.get("/code/:code", asyncHandler(discountController.getDiscountCodeWithProducts));

// Calculate discount amount
router.post("/amount/:codeId", asyncHandler(discountController.getDiscountAmount));

// Delete discount code
router.delete("/:discountId", asyncHandler(discountController.deleteDiscountCode));

// Cancel discount code usage
router.post("/cancel/:codeId", asyncHandler(discountController.cancelDiscountCode));

export default router;