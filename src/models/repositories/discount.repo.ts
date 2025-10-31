import { getSelectData, getUnSelectData } from "../../utils";
import { discountModel } from "../discount-model";
import type { Types } from "mongoose";

class DiscountRepository {
    static async findAllDiscountUnselect({
        limit,
        sort,
        page,
        filter,
        unSelect,
    }: {
        limit: number;
        sort: string;
        page: number;
        filter: any;
        unSelect: string[];
    }) {
        const skip = (page - 1) * limit;
        const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };

        const discounts = await discountModel
            .find(filter)
            .sort(sortBy)
            .skip(skip)
            .limit(limit)
            .select(getUnSelectData(unSelect))
            .lean()
            .exec();

        return discounts;
    }

    static async countDiscounts(filter: any): Promise<number> {
        return await discountModel.countDocuments(filter);
    }

    static async findDiscountById({
        discount_id,
        select,
    }: {
        discount_id: string;
        select?: string[];
    }) {
        return await discountModel
            .findById(discount_id)
            .select(select ? getSelectData(select) : {});
    }

    static async findDiscountByCode({
        code,
        shopId,
        select,
    }: {
        code: string;
        shopId: Types.ObjectId;
        select?: string[];
    }) {
        return await discountModel
            .findOne({
                discount_code: code.toUpperCase(),
                discount_shopId: shopId,
            })
            .select(select ? getSelectData(select) : {});
    }

    static async findDiscountByCodeAndShop(code: string, shopId: Types.ObjectId) {
        return await discountModel.findOne({
            discount_code: code.toUpperCase(),
            discount_shopId: shopId
        }).lean();
    }

    static async validateDiscount({
        discountId,
        shopId,
        userId,
    }: {
        discountId: Types.ObjectId;
        shopId: Types.ObjectId;
        userId?: Types.ObjectId;
    }) {
        const foundDiscount = await discountModel.findOne({
            _id: discountId,
            discount_shopId: shopId,
        });

        if (!foundDiscount) {
            throw new Error("Discount not found");
        }

        if (!foundDiscount.discount_is_active) {
            throw new Error("Discount is not active");
        }

        const now = new Date();
        if (
            now < foundDiscount.discount_start_date ||
            now > foundDiscount.discount_end_date
        ) {
            throw new Error("Discount has expired or not yet active");
        }

        // Check usage limits
        if (
            foundDiscount.discount_max_uses !== null &&
            foundDiscount.discount_uses_count >= foundDiscount.discount_max_uses
        ) {
            throw new Error("Discount has reached maximum usage limit");
        }

        // Check user-specific usage limit if userId provided
        if (userId && !foundDiscount.canBeUsedBy(userId)) {
            throw new Error(
                "User has reached maximum usage limit for this discount"
            );
        }

        return foundDiscount;
    }

    static async validateDiscountByCode({
        code,
        shopId,
        userId,
    }: {
        code: string;
        shopId: Types.ObjectId;
        userId?: Types.ObjectId;
    }) {
        const foundDiscount = await discountModel.findOne({
            discount_code: code.toUpperCase(),
            discount_shopId: shopId,
        });

        if (!foundDiscount) {
            throw new Error("Discount code not found");
        }

        // Use the same validation logic
        return await this.validateDiscount({
            discountId: foundDiscount._id,
            shopId,
            userId,
        });
    }
}

export default DiscountRepository;
