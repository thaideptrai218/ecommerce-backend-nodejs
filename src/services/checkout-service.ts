import { BadRequestError } from "../core/error-respone";
import { CartRepository } from "../models/repositories/cart-rep";
import ProductRepository from "../models/repositories/product.repo";
import { DiscountService } from "./discount-service";

export class CheckoutService {
    /**
    payload:
    {
        cartId,
        userId,
        shop_orders_ids: [
            {
                shopId,
                shop_discountss: [
                    {
                        shopId,
                        discountId,
                        codeId,
                    }
                ]
                item_products: [
                    {price, 
                    quantity
                    productId}
                ]
            }
        ]
    }  
     
     */

    static async checkOutReview({ cartId, userId, shop_order_ids = [] }) {
        // check cartId
        const foundCart = await CartRepository.findCartById(cartId);
        if (!foundCart) throw new BadRequestError("Cart doest not exist!");

        const checkout_order = {
                totalPrice: 0,
                feeShip: 0,
                totalDiscount: 0,
                totalCheckout: 0,
            },
            shop_order_ids_new = [];

        for (let i = 0; i < shop_order_ids.length; i++) {
            const {
                shopId,
                shop_discounts = [],
                item_products = [],
            } = shop_order_ids[i];
            if (!item_products || item_products.length === 0) {
                throw new BadRequestError("No products provided for checkout!");
            }

            const checkProductServer =
                await ProductRepository.checkProductByServer(item_products);

            if (!checkProductServer || checkProductServer.length === 0) {
                throw new BadRequestError(
                    "No valid products found for checkout!"
                );
            }

            // Check if any product validation failed
            const invalidProducts = checkProductServer.filter(
                (product) => !product
            );
            if (invalidProducts.length > 0) {
                throw new BadRequestError(
                    "Some products are invalid or not available!"
                );
            }

            const checkOutPrice = checkProductServer.reduce((acc, product) => {
                return acc + product?.quantity * product?.price;
            }, 0);

            checkout_order.totalPrice += checkOutPrice;

            const itemCheckOut = {
                shopId,
                shop_discounts,
                priceRaw: checkOutPrice,
                priceApplyDiscount: checkOutPrice,
                item_products: checkProductServer,
            };

            if (shop_discounts.length > 0) {
                const { discountAmount = 0 } =
                    await DiscountService.getDiscountAmount({
                        codeId: shop_discounts[0].codeId,
                        userId,
                        shopId,
                        products: checkProductServer,
                    });

                checkout_order.totalDiscount += discountAmount;
                itemCheckOut.priceApplyDiscount =
                    checkOutPrice - discountAmount;
            }

            shop_order_ids_new.push(itemCheckOut);
        }

        // Calculate final checkout total
        checkout_order.totalCheckout =
            checkout_order.totalPrice +
            checkout_order.feeShip -
            checkout_order.totalDiscount;

        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order,
        };
    }

    /**
     * Execute the checkout order by creating orders and updating inventory
     * @param {Object} params - Checkout parameters
     * @param {string} params.userId - User ID
     * @param {string} params.cartId - Cart ID
     * @param {Array} params.shop_order_ids - Shop order IDs from checkout review
     * @returns {Promise<Object>} Created order information
     */
    static async checkOutOrder({ userId, cartId, shop_order_ids = [] }) {
        const { shop_order_ids: shopOrderIds, ...checkoutOrder } =
            await this.checkOutReview({
                cartId,
                userId,
                shop_order_ids,
            });

        const orders = [];

        for (const shopOrder of shopOrderIds) {
            const { shopId, item_products = [] } = shopOrder;

            // Create order for each shop
            const order = {
                userId,
                shopId,
                status: "pending",
                items: item_products.map((product) => ({
                    productId: product.productId,
                    quantity: product.quantity,
                    price: product.price,
                    shopId,
                })),
                totalAmount: shopOrder.priceApplyDiscount,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            orders.push(order);

            // Update product inventory
            for (const product of item_products) {
                await ProductRepository.updateProductQuantity(
                    product.productId,
                    -product.quantity
                );
            }
        }

        // Clear cart after successful checkout
        await CartRepository.deleteUserCart(userId);

        return {
            orders,
            checkoutOrder,
        };
    }
}
