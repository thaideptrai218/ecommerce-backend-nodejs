import { Schema, model, Types } from "mongoose";
import slugify from "slugify";

const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "products";

// Base Product Schema - stores common product information
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
        product_slug: {
            type: String,
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
            type: Schema.Types.Mixed,
            required: true,
        },
        product_ratingsAverage: {
            type: Number,
            default: 4.5,
            min: [1, "Rating must be above 1.0"],
            max: [5, "Rating must be below 5.0"],
            set: (val: number) => Math.round(val * 10) / 10,
        },
        product_variations: {
            type: Array,
            default: [],
        },
        isDraft: {
            type: Boolean,
            default: true,
            index: true,
            select: false,
        },
        isPublished: {
            type: Boolean,
            default: false,
            index: true,
            select: false,
        },
    },
    {
        collection: COLLECTION_NAME,
        timestamps: true,
    }
);
// Create index for search
productSchema.index({ product_name: "text", product_description: "text" });

// Document middleware: runs before .save() and .create()
productSchema.pre("save", function (next) {
    this.product_slug = slugify(this.product_name, { lower: true });
    next();
});

export const productModel = model(DOCUMENT_NAME, productSchema);

// Define Clothing Schema and Model - stores type-specific attributes
const clothingSchema = new Schema(
    {
        _id: { type: Schema.Types.ObjectId, auto: false },
        brand: { type: String, required: true },
        size: { type: String, enum: ["XS", "S", "M", "L", "XL", "XXL"] },
        material: { type: String, required: true },
        color: { type: String },
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

// Define Electronic Schema and Model - stores type-specific attributes
const electronicSchema = new Schema(
    {
        _id: { type: Schema.Types.ObjectId, auto: false },
        manufacturer: { type: String, required: true },
        model: { type: String, required: true },
        warranty: { type: String, default: "1 year" },
        features: { type: [String] }, // Example of an array field
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
