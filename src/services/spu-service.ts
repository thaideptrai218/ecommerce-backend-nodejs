import { Types } from "mongoose";
import { BadRequestError, NotFoundError, ForbiddenError } from "../core/error-respone";
import SpuRepository from "../models/repositories/spu.repo";
import SkuService from "./sku-service";

interface IProductVariation {
    name: string;
    options: string[];
}

interface ICreateSpuPayload {
    product_name: string;
    product_thumb: string;
    product_description?: string;
    product_price: number;
    product_category?: string[];
    product_shop: string | Types.ObjectId;
    product_attributes?: Record<string, unknown>;
    product_variations?: IProductVariation[];
    sku_list?: Array<{
        sku_tier_idx: number[];
        sku_price: number;
        sku_stock: number;
        sku_sort?: number;
    }>;
}

interface IFilterSpuParams {
    limit?: number;
    sort?: string;
    page?: number;
    filter?: Record<string, unknown>;
    select?: string[];
}

class SpuService {
    static async createSpu(payload: ICreateSpuPayload) {
        const {
            product_name,
            product_thumb,
            product_description,
            product_price,
            product_category,
            product_shop,
            product_attributes,
            product_variations,
            sku_list
        } = payload;

        if (!product_name || !product_thumb || !product_price || !product_shop) {
            throw new BadRequestError("Missing required fields: product_name, product_thumb, product_price, product_shop");
        }

        if (product_price <= 0) {
            throw new BadRequestError("product_price must be greater than 0");
        }

        const product_id = `spu_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;

        const newSpu = await SpuRepository.createSpu({
            product_id,
            product_name,
            product_thumb,
            product_description: product_description || "",
            product_price,
            product_category: product_category || [],
            product_shop: typeof product_shop === "string" ? new Types.ObjectId(product_shop) : product_shop,
            product_attributes: product_attributes || {},
            product_variations: product_variations || []
        });

        if (!newSpu) {
            throw new BadRequestError("Failed to create SPU");
        }

        if (sku_list && sku_list.length > 0 && product_variations) {
            await SkuService.createSkusForSpu(product_id, product_name, product_variations, sku_list);
            await this.syncSpuMinPrice(product_id);
        }

        return newSpu;
    }

    static async findAllSpus(params: IFilterSpuParams = {}) {
        const {
            limit = 50,
            sort = "ctime",
            page = 1,
            filter = { isPublished: true, isDeleted: false },
            select = ["product_name", "product_price", "product_thumb", "product_slug"]
        } = params;

        return await SpuRepository.findAllSpus({
            limit: Number(limit),
            sort,
            page: Number(page),
            filter,
            select
        });
    }

    static async findSpuById(spu_id: string) {
        if (!spu_id) {
            throw new BadRequestError("spu_id is required");
        }

        const spu = await SpuRepository.findSpuById(spu_id);

        if (!spu) {
            throw new NotFoundError("SPU not found");
        }

        if (spu.isDeleted) {
            throw new NotFoundError("SPU has been deleted");
        }

        const skus = await SkuService.findAllSkusBySpuId(spu.product_id);

        return {
            ...spu,
            skus
        };
    }

    static async findSpuByUniqueId(product_id: string) {
        if (!product_id) {
            throw new BadRequestError("product_id is required");
        }

        const spu = await SpuRepository.findSpuByUniqueId(product_id);

        if (!spu || spu.isDeleted) {
            throw new NotFoundError("SPU not found");
        }

        const skus = await SkuService.findAllSkusBySpuId(product_id);

        return {
            ...spu,
            skus
        };
    }

    static async updateSpu(spu_id: string, payload: Partial<Omit<ICreateSpuPayload, "product_shop" | "sku_list">>, shop_id: string) {
        if (!spu_id) {
            throw new BadRequestError("spu_id is required");
        }

        const existingSpu = await SpuRepository.findSpuById(spu_id);

        if (!existingSpu) {
            throw new NotFoundError("SPU not found");
        }

        if (existingSpu.isDeleted) {
            throw new BadRequestError("Cannot update deleted SPU");
        }

        const shopObjectId = typeof shop_id === "string" ? new Types.ObjectId(shop_id) : new Types.ObjectId(shop_id);
        if (!existingSpu.product_shop.equals(shopObjectId)) {
            throw new ForbiddenError("You do not have permission to update this SPU");
        }

        const { product_variations, ...updateData } = payload;

        const cleanUpdateData: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(updateData)) {
            if (value !== undefined) {
                cleanUpdateData[key] = value;
            }
        }

        const updatedSpu = await SpuRepository.updateSpu(spu_id, cleanUpdateData);

        if (!updatedSpu) {
            throw new BadRequestError("Failed to update SPU");
        }

        if (product_variations) {
            await SpuRepository.updateSpu(spu_id, { product_variations });
        }

        return updatedSpu;
    }

    static async deleteSpu(spu_id: string, shop_id: string) {
        if (!spu_id) {
            throw new BadRequestError("spu_id is required");
        }

        const spu = await SpuRepository.findSpuById(spu_id);

        if (!spu) {
            throw new NotFoundError("SPU not found");
        }

        if (spu.isDeleted) {
            throw new BadRequestError("SPU already deleted");
        }

        const shopObjectId = typeof shop_id === "string" ? new Types.ObjectId(shop_id) : shop_id;
        if (!spu.product_shop.equals(shopObjectId)) {
            throw new ForbiddenError("You do not have permission to delete this SPU");
        }

        const deletedSpu = await SpuRepository.updateSpu(spu_id, { isDeleted: true });

        if (!deletedSpu) {
            throw new BadRequestError("Failed to delete SPU");
        }

        return deletedSpu;
    }

    static async publishSpu(shop_id: string, spu_id: string) {
        if (!spu_id || !shop_id) {
            throw new BadRequestError("shop_id and spu_id are required");
        }

        const result = await SpuRepository.publishSpuByShop({
            product_shop: shop_id,
            spu_id
        });

        if (!result) {
            throw new NotFoundError("SPU not found or you do not have permission");
        }

        return result;
    }

    static async unpublishSpu(shop_id: string, spu_id: string) {
        if (!spu_id || !shop_id) {
            throw new BadRequestError("shop_id and spu_id are required");
        }

        const result = await SpuRepository.unpublishSpuByShop({
            product_shop: shop_id,
            spu_id
        });

        if (!result) {
            throw new NotFoundError("SPU not found or you do not have permission");
        }

        return result;
    }

    static async findAllDraftsForShop(shop_id: string, params: Omit<IFilterSpuParams, "filter"> = {}) {
        if (!shop_id) {
            throw new BadRequestError("shop_id is required");
        }

        const { limit = 50, sort = "ctime", page = 1, select = ["product_name", "product_price", "product_thumb"] } = params;

        return await SpuRepository.findAllSpus({
            limit: Number(limit),
            sort,
            page: Number(page),
            filter: {
                product_shop: new Types.ObjectId(shop_id),
                isDraft: true,
                isDeleted: false
            },
            select
        });
    }

    static async findAllPublishedForShop(shop_id: string, params: Omit<IFilterSpuParams, "filter"> = {}) {
        if (!shop_id) {
            throw new BadRequestError("shop_id is required");
        }

        const { limit = 50, sort = "ctime", page = 1, select = ["product_name", "product_price", "product_thumb"] } = params;

        return await SpuRepository.findAllSpus({
            limit: Number(limit),
            sort,
            page: Number(page),
            filter: {
                product_shop: new Types.ObjectId(shop_id),
                isPublished: true,
                isDeleted: false
            },
            select
        });
    }

    static async syncSpuMinPrice(product_id: string) {
        const skus = await SkuService.findAllSkusBySpuId(product_id);

        if (skus.length === 0) {
            return;
        }

        const minPrice = Math.min(...skus.map((s) => s.sku_price));

        await SpuRepository.updateSpuByProductId(product_id, { product_price: minPrice });
    }
}

export default SpuService;
