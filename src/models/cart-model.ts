import { Schema, model, Types } from "mongoose";

const DOCUMENT_NAME = "Cart";
const COLLECTION_NAME = "carts";

// Discount type enum for better type safety
export enum DiscountType {
    PERCENTAGE = "percentage",
    FIXED_AMOUNT = "fixed_amount",
    BOGO = "bogo",
    FREE_SHIPPING = "free_shipping",
}

// Discount applicability enum
export enum DiscountAppliesTo {
    ALL = "all",
    SPECIFIC = "specific",
    CATEGORY = "category",
}

const cartSchema = new Schema(
    {
        cart_state: {
            type: String,
            required: true,
            enum: ["active", "completed", "failed", "pending"],
            default: "active",
        },

        cart_products: {
            type: Array,
            required: true,
            default: [],
        },

        cart_count_product: {
            type: Number,
            default: 0,
        },

        cart_userId: { type: Number, required: true },
    },
    {
        collection: COLLECTION_NAME,
        timestamps: true,
    }
);

export default model(DOCUMENT_NAME, cartSchema);
