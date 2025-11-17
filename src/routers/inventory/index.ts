import express from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { authentication } from "../../auth/check-auth";
import inventoryController from "../../controllers/inventory-controller";

const router = express.Router();

// Apply authentication middleware to all checkout routes
router.use(authentication);

/**
 * @route POST /checkout/review
 * @description Review checkout order with pricing and discounts
 * @access Private
 */
router.post("/review", asyncHandler(inventoryController.addStocckToInventory));

// /**
//  * @route POST /checkout/order
//  * @description Execute checkout order and create orders
//  * @access Private
//  */
// router.post("/order", asyncHandler(checkoutController.checkOutOrder));

// /**
//  * @route GET /checkout/history
//  * @description Get order history for user
//  * @access Private
//  */
// router.get("/history", asyncHandler(checkoutController.getOrderHistory));

// /**
//  * @route GET /checkout/:orderId
//  * @description Get order details by ID
//  * @access Private
//  */
// router.get("/:orderId", asyncHandler(checkoutController.getOrderById));

export default router;