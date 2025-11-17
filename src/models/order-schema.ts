import { DEFAULT_REDIS_OPTIONS } from "ioredis/built/redis/RedisOptions";
import { Schema, model } from "mongoose";

const DOCUMENT_NAME = "Order";
const COLLECTION_NAME = "orders";

// Base Product Schema - stores common product information
const orderSchema = new Schema(
    {
        order_userId: { type: Number, required: true },
        order_checkout: { type: Object, default: {} },
        /**
         * order_checkout = {
         *  totalPrice,
         *  totalApplyDiscount,
         *  feeShip
         * }
         */
        order_shipping: { type: Object, default: {} },
        /**
         *
         * street,
         * city,
         * state,
         * country
         */

        order_payment: { type: Object, default: {} },
        order_products: { type: Array, required: true },
        order_trackingNumber: { type: String, default: "#00001" },
        order_status: {
            type: String,
            enum: ["pending", "confirmed", "shipped", "cancelled", "delivered"],
            default: "pending",
        },
    },
    {
        collection: COLLECTION_NAME,
        timestamps: true,
    }
);

export default model(DOCUMENT_NAME, orderSchema);
