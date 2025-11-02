import {
    convertToObjectIdMongodb,
    getSelectData,
    getUnSelectData,
} from "../../utils";
import { productModel, clothingModel, electronicModel } from "../product-model";
import { removeUndefinedNull, updateNestedObjectParser } from "../../utils";
import type { Types } from "mongoose";

class ProductRepository {
    static async updateProductById({ productId, payload, model }) {
        const cleanedPayload = removeUndefinedNull(payload);
        const updatePayload = updateNestedObjectParser(cleanedPayload);
        return await model
            .findByIdAndUpdate(
                productId,
                { $set: updatePayload },
                { new: true }
            )
            .lean();
    }
    static async findAllDraftForShop({
        query,
        limit,
        skip,
    }: {
        query: any;
        limit: number;
        skip: number;
    }) {
        return await productModel
            .find(query)
            .populate("product_shop", "name email")
            .sort({ updateAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean()
            .exec();
    }

    static async findAllPublishForShop({
        query,
        limit,
        skip,
    }: {
        query: any;
        limit: number;
        skip: number;
    }) {
        return await productModel
            .find(query)
            .populate("product_shop", "name email")
            .sort({ updateAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean()
            .exec();
    }

    static async searchProductByUser({ keySearch }: { keySearch: string }) {
        const regexSearch = new RegExp(keySearch, "i");
        const results = await productModel
            .find({
                isPublished: true,
                $text: { $search: regexSearch.toString() },
            })
            .sort({ score: { $meta: "textScore" } })
            .lean();
        return results;
    }

    static async publishProductByShop({
        product_shop,
        product_id,
    }: {
        product_shop: Types.ObjectId;
        product_id: Types.ObjectId;
    }) {
        const foundShop = await productModel.findOne({
            product_shop: product_shop,
            _id: product_id,
        });

        if (!foundShop) return null;

        foundShop.isDraft = false;
        foundShop.isPublished = true;

        await foundShop.save();
        return foundShop;
    }

    static async unpublishProductByShop({
        product_shop,
        product_id,
    }: {
        product_shop: Types.ObjectId;
        product_id: Types.ObjectId;
    }) {
        const foundShop = await productModel.findOne({
            product_shop: product_shop,
            _id: product_id,
        });

        if (!foundShop) return null;

        foundShop.isDraft = true;
        foundShop.isPublished = false;

        await foundShop.save();
        return foundShop;
    }

    static findAllProduct = async ({
        limit,
        sort,
        page,
        filter,
        select,
    }: {
        limit: number;
        sort: string;
        page: number;
        filter: any;
        select: string[];
    }) => {
        const skip = (page - 1) * limit;
        const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
        const products = await productModel
            .find(filter)
            .sort(sortBy)
            .skip(skip)
            .limit(limit)
            .select(getSelectData(select))
            .lean()
            .exec();
        return products;
    };

    static findProduct = async (product_id: string) => {
        return await productModel.findById(product_id).lean();
    };
}

export default ProductRepository;
