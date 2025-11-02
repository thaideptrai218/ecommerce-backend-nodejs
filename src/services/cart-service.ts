/**
 * Cart Service - Manages user shopping cart operations
 *
 * Key features:
 * - Add product to cart [user]
 * - Update product quantity in cart [user]
 * - Remove product from cart [user]
 * - Get user cart [user]
 * - Clear cart [user]
 * - Delete cart item [user]
 */

import { Types } from "mongoose";
import { NotFoundError } from "../core/error-respone";
import cartModel from "../models/cart-model";
import ProductRepository from "../models/repositories/product.repo";
import { convertToObjectIdMongodb } from "../utils";

// Define cart product interface for better type safety
export interface CartProduct {
    productId: Types.ObjectId;
    quantity: number;
    shopId?: Types.ObjectId;
    name?: string;
    price?: number;
}

// Define cart service interface
export interface CartServiceInterface {
    productId: Types.ObjectId;
    quantity: number;
    old_quantity?: number;
    shopId?: Types.ObjectId;
}

export class CartService {
    /**
     * Create a new cart for user or add product to existing cart
     * @param param - Object containing userId and product
     * @param param.userId - User ID
     * @param param.product - Product object to add to cart
     * @returns Updated cart document
     */
    static async createUserCart({
        userId,
        product,
    }: {
        userId: number;
        product: CartProduct;
    }) {
        return await cartModel.findOneAndUpdate(
            { cart_userId: userId, cart_state: "active" },
            {
                $addToSet: {
                    cart_products: product,
                },
                $inc: {
                    cart_count_product: product.quantity || 1,
                },
            },
            {
                upsert: true,
                new: true,
            }
        );
    }

    /**
     * Update product quantity in user's cart (sets to exact value)
     * @param param - Object containing userId and product details
     * @param param.userId - User ID
     * @param param.product - Product object with productId and target quantity
     * @returns Updated cart document
     */
    static async updateUserCartQuantity({
        userId,
        product,
    }: {
        userId: number;
        product: { productId: Types.ObjectId; quantity: number };
    }) {
        const { productId, quantity: targetQuantity } = product;

        // First, get current cart to find existing product quantity
        const currentCart = await cartModel.findOne({
            cart_userId: userId,
            cart_state: "active",
        });

        if (!currentCart) {
            throw new NotFoundError("Cart not found");
        }

        const existingProduct = currentCart.cart_products.find(
            (p) => p.productId.toString() === productId.toString()
        );

        if (!existingProduct) {
            throw new NotFoundError("Product not found in cart");
        }

        const currentQuantity = existingProduct.quantity;
        const quantityDiff = targetQuantity - currentQuantity;

        if (quantityDiff === 0) {
            // No change needed, return current cart
            return currentCart;
        }

        if (targetQuantity <= 0) {
            // Remove product if quantity is 0 or negative
            return await CartService.deleteUserCart({
                userId,
                productId,
            });
        }

        // Update with calculated difference
        const updatedCart = await cartModel.findOneAndUpdate(
            {
                cart_userId: userId,
                "cart_products.productId": convertToObjectIdMongodb(productId),
                cart_state: "active",
            },
            {
                $set: {
                    "cart_products.$.quantity": targetQuantity,
                },
                $inc: {
                    cart_count_product: quantityDiff,
                },
            },
            { new: true }
        );

        return updatedCart;
    }

    /**
     * Add product to user cart (basic version)
     * @param param - Object containing userId and product
     * @param param.userId - User ID
     * @param param.product - Product object to add
     * @returns Updated cart document
     */
    static async addToCart({
        userId,
        product = {} as CartProduct,
    }: {
        userId: number;
        product?: CartProduct;
    }) {
        const userCart = await cartModel.findOne({
            cart_userId: userId,
            cart_state: "active",
        });

        // If no cart exists for user, create a new one
        if (!userCart) {
            return await CartService.createUserCart({ userId, product });
        }

        // If cart exists, check if the product is already in it.
        const existingProduct = userCart.cart_products.find(
            (p) => p.productId.toString() === product.productId.toString()
        );

        if (existingProduct) {
            // Product exists, update quantity.
            return await CartService.updateUserCartQuantity({
                userId,
                product: {
                    productId: product.productId,
                    quantity: product.quantity || 1,
                },
            });
        }

        // Product does not exist in cart, add it to the array atomically
        return await cartModel.findOneAndUpdate(
            { cart_userId: userId },
            {
                $push: { cart_products: product },
                $inc: {
                    cart_count_product: product.quantity || 1,
                },
            },
            { new: true }
        );
    }

    /**
     * Add products to cart with shop validation (advanced version)
     * @param param - Object containing userId and product details
     * @param param.userId - User ID
     * @param param.product - Product details with shop validation
     * @param param.shopOrderIds - Shop order details
     * @returns Updated cart document
     */
    static async addToCartV2({
        userId,
        product = {} as CartServiceInterface,
        shopOrderIds,
    }: {
        userId: number;
        product?: CartServiceInterface;
        shopOrderIds?: Array<{
            shopId: Types.ObjectId;
            item_product: Array<{
                productId: Types.ObjectId;
                quantity: number;
                old_quantity?: number;
            }>;
        }>;
    }) {
        if (!shopOrderIds || shopOrderIds.length === 0) {
            throw new NotFoundError("Shop order information is required");
        }

        const { productId, quantity, old_quantity } =
            shopOrderIds[0]?.item_product[0];

        if (!productId) {
            throw new NotFoundError("Product ID is required");
        }

        // Check if product exists
        const foundProduct = await ProductRepository.findProduct(productId);
        if (!foundProduct) throw new NotFoundError("Product not found");

        // Validate product belongs to the specified shop
        if (
            foundProduct.product_shop?.toString() !==
            shopOrderIds[0]?.shopId.toString()
        ) {
            throw new NotFoundError(
                "Product does not belong to the specified shop"
            );
        }

        // If quantity is 0, remove product from cart
        if (quantity === 0) {
            return await CartService.deleteUserCart({
                userId,
                productId: productId,
            });
        }

        // Calculate the quantity difference
        // const quantityDiff = quantity - (old_quantity || 0);

        return await CartService.updateUserCartQuantity({
            userId,
            product: {
                productId,
                quantity: quantity,
            },
        });
    }

    /**
     * Remove product from user's cart
     * @param param - Object containing userId and productId
     * @param param.userId - User ID
     * @param param.productId - Product ID to remove
     * @returns Update operation result
     */
    static async deleteUserCart({
        userId,
        productId,
    }: {
        userId: number;
        productId: Types.ObjectId;
    }) {
        const cart = await cartModel.findOne({
            cart_userId: userId,
            cart_state: "active",
        });

        if (!cart) {
            throw new NotFoundError("Cart not found");
        }

        const productToRemove = cart.cart_products.find(
            (p) => p.productId.toString() === productId.toString()
        );

        const deleteResult = await cartModel.updateOne(
            { cart_userId: userId, cart_state: "active" },
            {
                $pull: {
                    cart_products: {
                        productId: productId,
                    },
                },
                $inc: {
                    cart_count_product: -(productToRemove?.quantity || 0),
                },
            }
        );

        return deleteResult;
    }

    /**
     * Get user's cart with product details
     * @param param - Object containing userId
     * @param param.userId - User ID
     * @returns User's cart document
     */
    static async getListUserCart({ userId }: { userId: number }) {
        const cart = await cartModel
            .findOne({
                cart_userId: userId,
                cart_state: "active",
            })
            .lean();

        if (!cart) {
            throw new NotFoundError("Cart not found");
        }

        return cart;
    }

    /**
     * Clear entire cart for user
     * @param param - Object containing userId
     * @param param.userId - User ID
     * @returns Update operation result
     */
    static async clearUserCart({ userId }: { userId: number }) {
        const deleteResult = await cartModel.updateOne(
            { cart_userId: userId, cart_state: "active" },
            {
                $set: {
                    cart_products: [],
                    cart_count_product: 0,
                },
            }
        );

        return deleteResult;
    }

    /**
     * Update cart state (e.g., from active to completed)
     * @param param - Object containing userId and newState
     * @param param.userId - User ID
     * @param param.newState - New cart state
     * @returns Update operation result
     */
    static async updateCartState({
        userId,
        newState,
    }: {
        userId: number;
        newState: "active" | "completed" | "failed" | "pending";
    }) {
        const updateResult = await cartModel.updateOne(
            { cart_userId: userId, cart_state: "active" },
            {
                $set: {
                    cart_state: newState,
                },
            }
        );

        return updateResult;
    }
}
