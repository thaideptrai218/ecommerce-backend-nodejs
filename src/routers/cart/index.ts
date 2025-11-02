import express from "express";
import cartController from "../../controllers/cart-controller";
import { asyncHandler } from "../../helpers/asyncHandler";
import { authentication } from "../../auth/check-auth";

const router = express.Router();

// Apply authentication middleware to all cart routes
router.use(authentication);

/**
 * @route POST /cart
 * @description Add product to user cart (basic version)
 * @access Private
 */
router.post("/", asyncHandler(cartController.addToCart));

/**
 * @route POST /cart/v2
 * @description Add products to cart with shop validation (advanced version)
 * @access Private
 */
router.post("/v2", asyncHandler(cartController.addToCartV2));

/**
 * @route GET /cart
 * @description Get user's cart with all products
 * @access Private
 */
router.get("/", asyncHandler(cartController.getUserCart));

/**
 * @route DELETE /cart/:productId
 * @description Remove product from user cart
 * @access Private
 */
router.delete("/:productId", asyncHandler(cartController.removeFromCart));

/**
 * @route DELETE /cart
 * @description Clear entire cart for user
 * @access Private
 */
router.delete("/", asyncHandler(cartController.clearCart));

/**
 * @route PATCH /cart/quantity
 * @description Update product quantity in cart (direct increment/decrement)
 * @access Private
 */
router.patch("/quantity", asyncHandler(cartController.updateProductQuantity));

/**
 * @route PATCH /cart/state
 * @description Update cart state (e.g., mark as completed)
 * @access Private
 */
router.patch("/state", asyncHandler(cartController.updateCartState));

export default router;