import type { Request, Response } from "express";
import { CheckoutService } from "../services/checkout-service";
import { NotFoundError, BadRequestError } from "../core/error-respone";
import { OK, Created } from "../core/success-respone";
import { Types } from "mongoose";
import { asyncHandler } from "../helpers/asyncHandler";

class CheckoutController {
    /**
     * @description Review checkout order with pricing and discounts
     * @param req - Express request object
     * @param res - Express response object
     * @returns JSON response with checkout review
     */
    checkOutReview = asyncHandler(async (req: Request, res: Response) => {
        const { userId } = req.user;
        const { cartId, shop_order_ids = [] } = req.body;

        if (!cartId || !shop_order_ids.length) {
            throw new BadRequestError("Cart ID and shop orders are required!");
        }

        const checkoutReview = await CheckoutService.checkOutReview({
            cartId: new Types.ObjectId(cartId),
            userId: parseInt(userId),
            shop_order_ids,
        });

        return new OK("Checkout review completed!", checkoutReview).send(res);
    });

    /**
     * @description Execute checkout order and create orders
     * @param req - Express request object
     * @param res - Express response object
     * @returns JSON response with created orders
     */
    checkOutOrder = asyncHandler(async (req: Request, res: Response) => {
        const { userId } = req.user;
        const { cartId, shop_order_ids = [] } = req.body;

        if (!cartId || !shop_order_ids.length) {
            throw new BadRequestError("Cart ID and shop orders are required!");
        }

        const orderResult = await CheckoutService.checkOutOrder({
            cartId: new Types.ObjectId(cartId),
            userId: parseInt(userId),
            shop_order_ids,
        });

        return new Created("Orders created successfully!", orderResult).send(res);
    });

    /**
     * @description Get order history for user
     * @param req - Express request object
     * @param res - Express response object
     * @returns JSON response with order history
     */
    getOrderHistory = asyncHandler(async (req: Request, res: Response) => {
        const { userId } = req.user;
        const { page = 1, limit = 10, status } = req.query;

        // This would typically call an OrderService.getOrdersByUser method
        // For now, return a placeholder response
        const orders = {
            userId,
            orders: [],
            pagination: {
                page: parseInt(page as string),
                limit: parseInt(limit as string),
                total: 0,
                total_pages: 0,
            },
        };

        return new OK("Order history retrieved!", orders).send(res);
    });

    /**
     * @description Get order details by ID
     * @param req - Express request object
     * @param res - Express response object
     * @returns JSON response with order details
     */
    getOrderById = asyncHandler(async (req: Request, res: Response) => {
        const { userId } = req.user;
        const { orderId } = req.params;

        if (!orderId) {
            throw new BadRequestError("Order ID is required!");
        }

        // This would typically call an OrderService.getOrderById method
        // For now, return a placeholder response
        const order = {
            orderId: new Types.ObjectId(orderId),
            userId,
            status: "Not implemented",
        };

        return new OK("Order details retrieved!", order).send(res);
    });
}

export default new CheckoutController();