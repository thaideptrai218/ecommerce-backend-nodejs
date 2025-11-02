import type { Request, Response } from "express";
import { CartService } from "../services/cart-service";
import type { CartProduct } from "../services/cart-service";
import { NotFoundError } from "../core/error-respone";
import { Created, OK } from "../core/success-respone";
import { Types } from "mongoose";
import { asyncHandler } from "../helpers/asyncHandler";

class CartController {
    /**
     * @description Add product to user cart (basic version)
     * @param req - Express request object
     * @param res - Express response object
     * @returns JSON response with updated cart
     */
    addToCart = asyncHandler(async (req: Request, res: Response) => {
        const { userId } = req.user;
        const { productId, quantity, shopId, name, price } = req.body;

        const product: CartProduct = {
            productId: new Types.ObjectId(productId),
            quantity: quantity || 1,
            shopId: shopId ? new Types.ObjectId(shopId) : undefined,
            name,
            price,
        };

        const cart = await CartService.addToCart({
            userId: parseInt(userId),
            product,
        });

        return new OK("Product added to cart successfully!", cart).send(res);
    });

    /**
     * @description Add products to cart with shop validation (advanced version)
     * @param req - Express request object
     * @param res - Express response object
     * @returns JSON response with updated cart
     */
    addToCartV2 = asyncHandler(async (req: Request, res: Response) => {
        const { userId } = req.user;
        const { shopOrderIds } = req.body;

        const cart = await CartService.addToCartV2({
            userId: parseInt(userId),
            shopOrderIds,
        });

        return new OK("Products added to cart successfully!", cart).send(res);
    });

    /**
     * @description Remove product from user cart
     * @param req - Express request object
     * @param res - Express response object
     * @returns JSON response with update result
     */
    removeFromCart = asyncHandler(async (req: Request, res: Response) => {
        const { userId } = req.user;
        const { productId } = req.params;

        const result = await CartService.deleteUserCart({
            userId: parseInt(userId),
            productId: new Types.ObjectId(productId),
        });

        return new OK("Product removed from cart successfully!", result).send(
            res
        );
    });

    /**
     * @description Get user's cart with all products
     * @param req - Express request object
     * @param res - Express response object
     * @returns JSON response with user cart
     */
    getUserCart = asyncHandler(async (req: Request, res: Response) => {
        const { userId } = req.user;

        const cart = await CartService.getListUserCart({
            userId: parseInt(userId),
        });

        return new OK("Cart retrieved successfully!", cart).send(res);
    });

    /**
     * @description Clear entire cart for user
     * @param req - Express request object
     * @param res - Express response object
     * @returns JSON response with update result
     */
    clearCart = asyncHandler(async (req: Request, res: Response) => {
        const { userId } = req.user;

        const result = await CartService.clearUserCart({
            userId: parseInt(userId),
        });

        return new OK("Cart cleared successfully!", result).send(res);
    });

    /**
     * @description Update product quantity in cart (direct increment/decrement)
     * @param req - Express request object
     * @param res - Express response object
     * @returns JSON response with updated cart
     */
    updateProductQuantity = asyncHandler(async (req: Request, res: Response) => {
        const { userId } = req.user;
        const { productId, quantity } = req.body;

        const cart = await CartService.updateUserCartQuantity({
            userId: parseInt(userId),
            product: {
                productId: new Types.ObjectId(productId),
                quantity: parseInt(quantity),
            },
        });

        return new OK("Product quantity updated successfully!", cart).send(res);
    });

    /**
     * @description Update cart state (e.g., mark as completed)
     * @param req - Express request object
     * @param res - Express response object
     * @returns JSON response with update result
     */
    updateCartState = asyncHandler(async (req: Request, res: Response) => {
        const { userId } = req.user;
        const { newState } = req.body;

        const result = await CartService.updateCartState({
            userId: parseInt(userId),
            newState,
        });

        return new OK("Cart state updated successfully!", result).send(res);
    });
}

export default new CartController();
