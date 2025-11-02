/**
 * Key feature: Cart service
 * - add product: to cart [user]
 * - reduce product quantity by one user
 * - increase product quantity by one [user]
 * - get cart [User]
 * - Delete cart [User]
 * - Delete cart item [User].
 */

import cartModel from "../models/cart-model";

export class CartService {
    static async createUserCart({ userId, product }) {
        return await cartModel.findOneAndUpdate(
            { cart_userId: userId, cart_state: "active" },
            {
                $addToSet: {
                    cart_products: product,
                },
            },
            {
                upsert: true,
                new: true,
            }
        );
    }

    static async updateUserCartQuantity({ userId, product }) {
        const { productId, quantity } = product;

        return await cartModel.findOneAndUpdate(
            {
                cart_userId: userId,
                "cart_products.productId": productId,
                cart_state: "active",
            },
            {
                $inc: {
                    "cart_products.$.quantity": quantity,
                },
            },
            { new: true }
        );
    }

    static async addToCart({ userId, product = {} as any }) {
        const userCart = await cartModel.findOne({ cart_userId: userId });

        // If no cart exists for user, create a new one
        if (!userCart) {
            return await CartService.createUserCart({ userId, product });
        }

        // If cart exists, check if the product is already in it.
        const existingProduct = userCart.cart_products.find(
            (p) => p.productId === product.productId
        );

        if (existingProduct) {
            // Product exists, update quantity.
            return await CartService.updateUserCartQuantity({ userId, product });
        }

        // Product does not exist in cart, add it to the array atomically
        return await cartModel.findOneAndUpdate(
            { cart_userId: userId },
            {
                $push: { cart_products: product },
            },
            { new: true }
        );
    }
}
