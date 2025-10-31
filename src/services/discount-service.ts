/**
 * Discount Services
 * 1. Generator Discount Code (shop/ admin),
 * 2. Get discount amount (user)
 * 3. Get all discount codes [User/shop]
 * 4. Verify Discount Code
 * 5. Delete discount Code [admin/ shop],
 * 6. Cancel discount code [user],
 *
 */

import { BadRequestError } from "../core/error-respone";
import {
    discountModel,
    DiscountType,
    DiscountAppliesTo,
} from "../models/discount-model";
import { convertToObjectIdMongodb } from "../utils";
import ProductRepository from "../models/repositories/product.repo";
import DiscountRepository from "../models/repositories/discount.repo";

export class DiscountService {
    static async createDiscountCode(payload: {
        code: string;
        name: string;
        description: string;
        type: DiscountType;
        value: number;
        start_date: string;
        end_date: string;
        shopId: string;
        is_active?: boolean;
        min_order_value?: number;
        max_uses?: number;
        max_uses_per_user?: number;
        product_ids?: string[];
        applies_to?: DiscountAppliesTo;
        max_value?: number;
    }) {
        const {
            code,
            name,
            description,
            type,
            value,
            start_date,
            end_date,
            shopId,
            is_active = true,
            min_order_value = 0,
            max_uses,
            max_uses_per_user = 1,
            product_ids = [],
            applies_to = DiscountAppliesTo.ALL,
            max_value,
        } = payload;

        // Validate dates
        const startDate = new Date(start_date);
        const endDate = new Date(end_date);
        const now = new Date();

        if (startDate >= endDate) {
            throw new BadRequestError("Start date must be before end date");
        }

        if (startDate < now && !is_active) {
            throw new BadRequestError(
                "Cannot create inactive discount with past start date"
            );
        }

        // Check if discount code already exists for this shop
        const foundDiscount =
            await DiscountRepository.findDiscountByCodeAndShop(
                code,
                convertToObjectIdMongodb(shopId)
            );

        if (foundDiscount) {
            throw new BadRequestError(
                "Discount code already exists for this shop"
            );
        }

        // Validate discount type and value
        if (type === DiscountType.PERCENTAGE && value > 100) {
            throw new BadRequestError("Percentage discount cannot exceed 100%");
        }

        if (type === DiscountType.FIXED_AMOUNT && min_order_value < value) {
            throw new BadRequestError(
                "Minimum order value should be at least equal to fixed discount amount"
            );
        }

        const newDiscount = await discountModel.create({
            discount_name: name,
            discount_description: description,
            discount_type: type,
            discount_value: value,
            discount_code: code.toUpperCase(),
            discount_start_date: startDate,
            discount_end_date: endDate,
            discount_shopId: convertToObjectIdMongodb(shopId),
            discount_is_active: is_active,
            discount_min_order_value: min_order_value,
            discount_max_uses: max_uses || null,
            discount_max_uses_per_user: max_uses_per_user,
            discount_max_discount_amount: max_value || null,
            discount_applies_to: applies_to,
            discount_product_ids: product_ids.map((id) =>
                convertToObjectIdMongodb(id)
            ),
        });

        return newDiscount;
    }

    static async updateDiscountCode({
        discountId,
        shopId,
        updateData,
    }: {
        discountId: string;
        shopId: string;
        updateData: Partial<{
            name: string;
            description: string;
            type: DiscountType;
            value: number;
            start_date: string;
            end_date: string;
            is_active: boolean;
            min_order_value: number;
            max_uses: number;
            max_uses_per_user: number;
            product_ids: string[];
            applies_to: DiscountAppliesTo;
            max_value: number;
        }>;
    }) {
        const discountObjId = convertToObjectIdMongodb(discountId);
        const shopObjId = convertToObjectIdMongodb(shopId);

        // Check if discount exists and belongs to the shop
        const existingDiscount = await discountModel.findOne({
            _id: discountObjId,
            discount_shopId: shopObjId,
        });

        if (!existingDiscount) {
            throw new BadRequestError(
                "Discount not found or doesn't belong to this shop"
            );
        }

        // Field mapping configuration
        const fieldMapping = {
            name: "discount_name",
            description: "discount_description",
            type: "discount_type",
            value: "discount_value",
            is_active: "discount_is_active",
            min_order_value: "discount_min_order_value",
            max_uses: "discount_max_uses",
            max_uses_per_user: "discount_max_uses_per_user",
            applies_to: "discount_applies_to",
            max_value: "discount_max_discount_amount",
        };

        // Prepare update object using field mapping
        const updateFields: any = {};

        // Map simple fields using the configuration
        Object.entries(fieldMapping).forEach(([payloadField, dbField]) => {
            if (
                updateData[payloadField as keyof typeof updateData] !==
                undefined
            ) {
                updateFields[dbField] =
                    updateData[payloadField as keyof typeof updateData];
            }
        });

        // Handle special fields with transformations
        if (updateData.start_date !== undefined) {
            updateFields.discount_start_date = new Date(updateData.start_date);
        }
        if (updateData.end_date !== undefined) {
            updateFields.discount_end_date = new Date(updateData.end_date);
        }
        if (updateData.product_ids !== undefined) {
            updateFields.discount_product_ids = updateData.product_ids.map(
                (id) => convertToObjectIdMongodb(id)
            );
        }

        // Validate date changes
        if (
            updateFields.discount_start_date &&
            updateFields.discount_end_date
        ) {
            if (
                updateFields.discount_start_date >=
                updateFields.discount_end_date
            ) {
                throw new BadRequestError("Start date must be before end date");
            }
        }

        // Validate percentage discount
        if (
            updateFields.discount_type === DiscountType.PERCENTAGE &&
            updateFields.discount_value > 100
        ) {
            throw new BadRequestError("Percentage discount cannot exceed 100%");
        }

        // Validate fixed amount discount
        if (
            updateFields.discount_type === DiscountType.FIXED_AMOUNT &&
            updateFields.discount_min_order_value &&
            updateFields.discount_value &&
            updateFields.discount_min_order_value < updateFields.discount_value
        ) {
            throw new BadRequestError(
                "Minimum order value should be at least equal to fixed discount amount"
            );
        }

        const updatedDiscount = await discountModel.findByIdAndUpdate(
            discountObjId,
            updateFields,
            { new: true, runValidators: true }
        );

        return updatedDiscount;
    }

    static async getAllDiscountCodeWithProduct({
        code,
        shopId,
        limit = 50,
        page = 1,
    }: {
        code: string;
        shopId: string;
        limit?: number;
        page?: number;
    }) {
        const shopObjId = convertToObjectIdMongodb(shopId);

        // Find the discount by code and shop
        const discount = await DiscountRepository.findDiscountByCodeAndShop(
            code,
            shopObjId
        );

        if (!discount) {
            throw new BadRequestError("Discount code not found");
        }

        let products = [];

        // If discount applies to specific products, fetch those products
        if (
            discount.discount_applies_to === DiscountAppliesTo.SPECIFIC &&
            discount.discount_product_ids.length > 0
        ) {
            // Build filter for specific product IDs
            const productFilter = {
                _id: { $in: discount.discount_product_ids },
                product_shop: shopObjId,
                isPublished: true,
            };

            products = await ProductRepository.findAllProduct({
                limit,
                sort: "ctime",
                page,
                filter: productFilter,
                select: [
                    "product_name",
                    "product_price",
                    "product_thumb",
                    "product_description",
                    "_id",
                ],
            });
        }
        // If discount applies to all products, fetch all shop products
        else if (discount.discount_applies_to === DiscountAppliesTo.ALL) {
            const allProductsFilter = {
                product_shop: shopObjId,
                isPublished: true,
            };

            products = await ProductRepository.findAllProduct({
                limit,
                sort: "ctime",
                page,
                filter: allProductsFilter,
                select: [
                    "product_name",
                    "product_price",
                    "product_thumb",
                    "product_description",
                    "_id",
                ],
            });
        }

        return {
            discount: {
                _id: discount._id,
                code: discount.discount_code,
                name: discount.discount_name,
                description: discount.discount_description,
                type: discount.discount_type,
                value: discount.discount_value,
                appliesTo: discount.discount_applies_to,
                startDate: discount.discount_start_date,
                endDate: discount.discount_end_date,
                minOrderValue: discount.discount_min_order_value,
                isActive: discount.discount_is_active,
            },
            products,
            pagination: {
                page,
                limit,
                total: products.length,
            },
        };
    }

    static async getDiscountCodesByShopId({
        shopId,
        limit = 50,
        page = 1,
        sort = "createdAt",
        is_active = true,
        unSelect = ["__v"],
    }: {
        shopId: string;
        limit?: number;
        page?: number;
        sort?: "createdAt" | "name" | "value" | "endDate";
        is_active?: boolean;
        unSelect?: string[];
    }) {
        const shopObjId = convertToObjectIdMongodb(shopId);

        // Build filter for shop and active status
        const filter = {
            discount_shopId: shopObjId,
            discount_is_active: is_active,
        };

        // Use repository pattern to get discounts with unselect
        const discounts = await DiscountRepository.findAllDiscountUnselect({
            limit,
            sort: sort === "createdAt" ? "ctime" : sort,
            page,
            filter,
            unSelect,
        });

        // Get total count for pagination
        const totalDiscounts = await DiscountRepository.countDiscounts(filter);

        // Transform the data for better API response
        const transformedDiscounts = discounts.map((discount) => ({
            _id: discount._id,
            code: discount.discount_code,
            name: discount.discount_name,
            description: discount.discount_description,
            type: discount.discount_type,
            value: discount.discount_value,
            startDate: discount.discount_start_date,
            endDate: discount.discount_end_date,
            isActive: discount.discount_is_active,
            minOrderValue: discount.discount_min_order_value,
            maxUses: discount.discount_max_uses,
            usesCount: discount.discount_uses_count,
            maxUsesPerUser: discount.discount_max_uses_per_user,
            appliesTo: discount.discount_applies_to,
            maxDiscountAmount: discount.discount_max_discount_amount,
            productIdsCount: discount.discount_product_ids?.length || 0,
            remainingUses:
                discount.discount_max_uses === null
                    ? null
                    : Math.max(
                          0,
                          discount.discount_max_uses -
                              discount.discount_uses_count
                      ),
            isCurrentlyValid:
                discount.discount_is_active &&
                new Date() >= discount.discount_start_date &&
                new Date() <= discount.discount_end_date &&
                (discount.discount_max_uses === null ||
                    discount.discount_uses_count < discount.discount_max_uses),
            createdAt: discount.createdAt,
            updatedAt: discount.updatedAt,
        }));

        return {
            discounts: transformedDiscounts,
            pagination: {
                page,
                limit,
                total: totalDiscounts,
                totalPages: Math.ceil(totalDiscounts / limit),
                hasNext: page * limit < totalDiscounts,
                hasPrev: page > 1,
            },
        };
    }

    static async getDiscountAmount({
        codeId,
        userId,
        shopId,
        products,
    }: {
        codeId: string;
        userId: string;
        shopId: string;
        products: Array<{
            productId: string;
            price: number;
            quantity: number;
        }>;
    }) {
        const discount = await DiscountRepository.validateDiscount({
            discountId: convertToObjectIdMongodb(codeId),
            shopId: convertToObjectIdMongodb(shopId),
            userId: convertToObjectIdMongodb(userId),
        });

        const totalOrderValue = products.reduce(
            (total, product) => total + product.price * product.quantity,
            0
        );

        if (totalOrderValue < discount.discount_min_order_value) {
            throw new BadRequestError(
                `Minimum order value of ${discount.discount_min_order_value} required`
            );
        }

        let applicableProducts = products;
        let discountAmount = 0;

        if (discount.discount_applies_to === DiscountAppliesTo.SPECIFIC) {
            const discountProductIds = discount.discount_product_ids.map((id) =>
                id.toString()
            );
            applicableProducts = products.filter((product) =>
                discountProductIds.includes(product.productId)
            );

            if (applicableProducts.length === 0) {
                throw new BadRequestError(
                    "No products in your order are eligible for this discount"
                );
            }
        }

        switch (discount.discount_type) {
            case DiscountType.PERCENTAGE:
                const applicableTotal = applicableProducts.reduce(
                    (total, product) =>
                        total + product.price * product.quantity,
                    0
                );
                discountAmount =
                    applicableTotal * (discount.discount_value / 100);
                break;

            case DiscountType.FIXED_AMOUNT:
                discountAmount = discount.discount_value;
                break;

            case DiscountType.FREE_SHIPPING:
                discountAmount = 0;
                break;

            case DiscountType.BOGO:
                const sortedProducts = applicableProducts.sort(
                    (a, b) => a.price - b.price
                );
                discountAmount =
                    sortedProducts.length >= 2 ? sortedProducts[0].price : 0;
                break;

            default:
                throw new BadRequestError("Invalid discount type");
        }

        if (
            discount.discount_max_discount_amount !== null &&
            discountAmount > discount.discount_max_discount_amount
        ) {
            discountAmount = discount.discount_max_discount_amount;
        }

        return {
            discountCode: discount.discount_code,
            discountName: discount.discount_name,
            discountType: discount.discount_type,
            discountValue: discount.discount_value,
            discountAmount,
            totalOrderValue,
            finalAmount: totalOrderValue - discountAmount,
            applicableProducts: applicableProducts.map((product) => ({
                productId: product.productId,
                price: product.price,
                quantity: product.quantity,
                subtotal: product.price * product.quantity,
            })),
            minOrderValue: discount.discount_min_order_value,
            maxDiscountAmount: discount.discount_max_discount_amount,
            remainingUses:
                discount.discount_max_uses === null
                    ? null
                    : Math.max(
                          0,
                          discount.discount_max_uses -
                              discount.discount_uses_count -
                              1
                      ),
            canUse: true,
        };
    }

    static async deleteDiscountCode({
        discountId,
        shopId,
    }: {
        discountId: string;
        shopId: string;
    }) {
        const discount = await DiscountRepository.findDiscountByCodeAndShop(
            discountId,
            convertToObjectIdMongodb(shopId)
        );

        if (!discount) {
            throw new BadRequestError("Discount not found or doesn't belong to this shop");
        }

        const deletedDiscount = await discountModel.findByIdAndDelete(discount._id);

        if (!deletedDiscount) {
            throw new BadRequestError("Failed to delete discount");
        }

        return {
            message: "Discount deleted successfully",
            deletedDiscount: {
                _id: deletedDiscount._id,
                code: deletedDiscount.discount_code,
                name: deletedDiscount.discount_name,
            },
        };
    }

    static async cancelDiscountCode({
        codeId,
        userId,
        shopId,
    }: {
        codeId: string;
        userId: string;
        shopId: string;
    }) {
        const discount = await DiscountRepository.validateDiscount({
            discountId: convertToObjectIdMongodb(codeId),
            shopId: convertToObjectIdMongodb(shopId),
            userId: convertToObjectIdMongodb(userId),
        });

        const userObjId = convertToObjectIdMongodb(userId);

        const hasUsedDiscount = discount.discount_users_used.some((id: any) =>
            id.equals(userObjId)
        );

        if (!hasUsedDiscount) {
            throw new BadRequestError("You have not used this discount yet");
        }

        const updatedDiscount = await discountModel.findByIdAndUpdate(
            discount._id,
            {
                $pull: { discount_users_used: userObjId },
                $inc: { discount_uses_count: -1 }
            },
            { new: true, runValidators: true }
        );

        if (!updatedDiscount) {
            throw new BadRequestError("Failed to cancel discount usage");
        }

        return {
            message: "Discount usage cancelled successfully",
            discount: {
                _id: updatedDiscount._id,
                code: updatedDiscount.discount_code,
                name: updatedDiscount.discount_name,
                remainingUses: updatedDiscount.discount_max_uses === null
                    ? null
                    : Math.max(0, updatedDiscount.discount_max_uses - updatedDiscount.discount_uses_count),
            },
        };
    }
}
