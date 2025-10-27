import { Schema, model, Types } from "mongoose";

const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "products";

const productSchema = new Schema(
    {
        product_name: {
            type: String,
            required: true,
        },
        product_thumb: {
            type: String,
            required: true,
        },
        product_description: {
            type: String,
            required: true,
        },
        product_price: {
            type: Number,
            required: true,
        },
        product_quantity: {
            type: Number,
            required: true,
        },
        product_type: {
            type: String,
            required: true,
            enum: ["Electronics", "Clothing", "Books", "Food", "Other"],
        },
        product_shop: {
            type: Schema.Types.ObjectId,
            ref: "Shop",
        },
        product_attributes: {
            type: Schema.Types.Mixed, // Can be any type, useful for flexible attributes
            required: true,
        },
    },
    {
        collection: COLLECTION_NAME,
        timestamps: true,
    }
);

export const productModel = model(DOCUMENT_NAME, productSchema);

// Define Clothing Schema and Model
const clothingSchema = new Schema(
    {
        brand: { type: String, required: true },
        size: { type: String },
        material: String,
        product_shop: {
            type: Schema.Types.ObjectId,
            ref: "Shop",
        },
    },
    {
        collection: "clothes",
        timestamps: true,
    }
);

export const clothingModel = model("Clothing", clothingSchema);

// Define Electronic Schema and Model
const electronicSchema = new Schema(
    {
        manufacturer: { type: String, required: true },
        model: { type: String, required: true },
        warranty: { type: String, default: "1 year" },
        product_shop: {
            type: Schema.Types.ObjectId,
            ref: "Shop",
        },
    },
    {
        collection: "electronics",
        timestamps: true,
    }
);

export const electronicModel = model("Electronic", electronicSchema);
