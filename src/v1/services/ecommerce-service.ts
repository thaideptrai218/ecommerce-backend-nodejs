import { Product, Cart, Order, Inventory } from "../models/ecommerce-model";
import type {
    IProduct,
    ICart,
    IOrder,
    IInventory,
} from "../models/ecommerce-model";

async function addProduct(product: Partial<IProduct>) {
    return await Product.create(product);
}

async function addCart(cart: Partial<ICart>) {
    return await Cart.create(cart);
}

async function addOrder(order: Partial<IOrder>) {
    return await Order.create(order);
}

async function addInventory(inventory: Partial<IInventory>) {
    return await Inventory.create(inventory);
}

interface AddToCartParams {
    userId: number;
    productId: number;
    quantity?: number;
}

async function addToCart({
    userId,
    productId,
    quantity = 1,
}: AddToCartParams): Promise<ICart> {
    // 1. Check stock and create a reservation
    const stockUpdate = await Inventory.findOneAndUpdate(
        { productId: productId, quantity: { $gte: quantity } },
        {
            $inc: { quantity: -quantity },
            $push: { reservations: { userId, quantity, productId } }, // Added productId to reservation for clarity
        },
        { new: true } // return the updated document
    );

    if (!stockUpdate) {
        throw new Error("Product not in stock or insufficient quantity.");
    }

    try {
        // 2. Find user's cart or create a new one
        const cart = await Cart.findOne({ userId, status: "active" });

        if (cart) {
            // Cart exists, check for product
            const productIndex = cart.products.findIndex(
                (p) => p.productId === productId
            );
            if (productIndex > -1) {
                // Product exists, update quantity
                cart.products[productIndex].quantity += quantity;
            } else {
                // Product doesn't exist, add it
                cart.products.push({ productId, quantity });
            }
            return await cart.save();
        } else {
            // No active cart, create a new one
            const newCartId = Date.now();
            const newCart = await Cart.create({
                userId,
                cartId: newCartId,
                products: [{ productId, quantity }],
                status: "active",
            });
            return newCart;
        }
    } catch (error) {
        // 3. If cart operation fails, roll back the inventory reservation
        await Inventory.findOneAndUpdate(
            { productId: productId },
            {
                $inc: { quantity: quantity }, // Add back the quantity
                $pull: { reservations: { userId, quantity, productId } }, // Remove the reservation
            }
        );
        // Re-throw the error to be handled by the controller
        throw error;
    }
}

export { addProduct, addCart, addOrder, addInventory, addToCart };
