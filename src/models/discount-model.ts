import { Schema, model, Types } from "mongoose";

const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "discounts";

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

const discountSchema = new Schema(
    {
        // Basic Information
        discount_name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },
        discount_description: {
            type: String,
            required: true,
            maxlength: 500,
        },

        // Discount Configuration
        discount_type: {
            type: String,
            required: true,
            enum: Object.values(DiscountType),
        },
        discount_value: {
            type: Number,
            required: true,
            min: 0,
            validate: {
                validator: function (this: any, value: number) {
                    if (this.discount_type === DiscountType.PERCENTAGE) {
                        return value <= 100;
                    }
                    return value >= 0;
                },
                message: "Percentage discount cannot exceed 100%",
            },
        },
        discount_code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true,
            minlength: 3,
            maxlength: 20,
            match: /^[A-Z0-9]+$/, // Only alphanumeric codes
        },

        // Timing Controls
        discount_start_date: {
            type: Date,
            required: true,
            validate: {
                validator: function (value: Date) {
                    return value >= new Date();
                },
                message: "Start date cannot be in the past",
            },
        },
        discount_end_date: {
            type: Date,
            required: true,
            validate: {
                validator: function (this: any, value: Date) {
                    return value > this.discount_start_date;
                },
                message: "End date must be after start date",
            },
        },

        // Usage Controls
        discount_max_uses: {
            type: Number,
            default: null, // null = unlimited
            min: 1,
        },
        discount_uses_count: {
            type: Number,
            default: 0,
            min: 0,
        },
        discount_users_used: [
            {
                type: Schema.Types.ObjectId,
                ref: "Shop",
            },
        ],
        discount_max_uses_per_user: {
            type: Number,
            default: 1,
            min: 1,
        },

        // Order Requirements
        discount_min_order_value: {
            type: Number,
            default: 0,
            min: 0,
        },
        discount_max_discount_amount: {
            type: Number,
            default: null, // null = no cap
            min: 0,
        },

        // Multi-tenancy (following existing pattern)
        discount_shopId: {
            type: Schema.Types.ObjectId,
            ref: "Shop",
            required: true,
        },

        // Status Management
        discount_is_active: {
            type: Boolean,
            default: true,
            index: true,
        },

        // Applicability Rules
        discount_applies_to: {
            type: String,
            enum: Object.values(DiscountAppliesTo),
            default: DiscountAppliesTo.ALL,
        },
        discount_product_ids: [
            {
                type: Schema.Types.ObjectId,
                ref: "Product",
            },
        ],
        // discount_category_ids: [{
        //   type: Schema.Types.ObjectId,
        //   ref: "Category" // Future category model
        // }],

        // // Advanced Features
        // discount_is_stackable: {
        //   type: Boolean,
        //   default: false
        // },
        // discount_priority: {
        //   type: Number,
        //   default: 0, // Higher = higher priority
        //   min: 0
        // },

        // // Additional metadata
        // discount_tags: [{
        //   type: String,
        //   trim: true,
        //   maxlength: 50
        // }],
        // discount_conditions: {
        //   type: Schema.Types.Mixed,
        //   default: {}
        // }
    },
    {
        collection: COLLECTION_NAME,
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Virtual for checking if discount is currently valid
discountSchema.virtual("isCurrentlyValid").get(function () {
    const now = new Date();
    return (
        this.discount_is_active &&
        now >= this.discount_start_date &&
        now <= this.discount_end_date &&
        (this.discount_max_uses === null ||
            this.discount_uses_count < this.discount_max_uses)
    );
});

// Virtual for remaining uses
discountSchema.virtual("remainingUses").get(function () {
    if (this.discount_max_uses === null) return null;
    return Math.max(0, this.discount_max_uses - this.discount_uses_count);
});

// Indexes for Performance
discountSchema.index({ discount_shop: 1, discount_code: 1 });
discountSchema.index({ discount_start_date: 1, discount_end_date: 1 });
discountSchema.index({ discount_is_active: 1, discount_end_date: 1 });
discountSchema.index({ discount_shop: 1, discount_is_active: 1 });
discountSchema.index({
    discount_code: "text",
    discount_name: "text",
    discount_description: "text",
});
discountSchema.index({ discount_applies_to: 1, discount_product_ids: 1 });
discountSchema.index({ discount_priority: -1 });

// Validation Middleware
discountSchema.pre("save", function (next) {
    // Validate end date is after start date
    if (this.discount_end_date <= this.discount_start_date) {
        return next(new Error("End date must be after start date"));
    }

    // Validate percentage discounts
    if (
        this.discount_type === DiscountType.PERCENTAGE &&
        this.discount_value > 100
    ) {
        return next(new Error("Percentage discount cannot exceed 100%"));
    }

    // Validate fixed amount has minimum order value requirement if needed
    if (
        this.discount_type === DiscountType.FIXED_AMOUNT &&
        this.discount_min_order_value < this.discount_value
    ) {
        return next(
            new Error(
                "Minimum order value should be at least equal to fixed discount amount"
            )
        );
    }

    next();
});

// Static methods for common queries
discountSchema.statics.findActiveDiscounts = function (shopId: Types.ObjectId) {
    const now = new Date();
    return this.find({
        discount_shop: shopId,
        discount_is_active: true,
        discount_start_date: { $lte: now },
        discount_end_date: { $gte: now },
    });
};

discountSchema.statics.findByCode = function (
    code: string,
    shopId: Types.ObjectId
) {
    return this.findOne({
        discount_code: code.toUpperCase(),
        discount_shop: shopId,
        discount_is_active: true,
    });
};

// Instance methods
discountSchema.methods.canBeUsedBy = function (userId: Types.ObjectId) {
    // Check if user has already used this discount
    const userUsageCount = this.discount_users_used.filter((id) =>
        id.equals(userId)
    ).length;
    return userUsageCount < this.discount_max_uses_per_user;
};

discountSchema.methods.recordUsage = function (userId: Types.ObjectId) {
    this.discount_uses_count += 1;
    if (!this.discount_users_used.some((id) => id.equals(userId))) {
        this.discount_users_used.push(userId);
    }
};

export const discountModel = model(DOCUMENT_NAME, discountSchema);
export type DiscountDocument = typeof discountModel.prototype;
