import { BadRequestError, NotFoundError } from "../core/error-respone";
import SkuRepository from "../models/repositories/sku.repo";
import slugify from "slugify";

interface IProductVariation {
    name: string;
    options: string[];
}

interface ICreateSkuPayload {
    sku_id?: string;
    sku_tier_idx: number[];
    sku_price: number;
    sku_stock: number;
    sku_sort?: number;
}

class SkuService {
    static async createSkusForSpu(
        product_id: string,
        spu_product_name: string,
        product_variations: IProductVariation[],
        sku_list: ICreateSkuPayload[]
    ) {
        if (!product_id || !sku_list || sku_list.length === 0) {
            throw new BadRequestError("product_id and sku_list are required");
        }

        const skusToCreate = sku_list.map((skuPayload) => {
            const { sku_tier_idx, sku_price, sku_stock, sku_sort = 0 } = skuPayload;

            if (sku_price <= 0) {
                throw new BadRequestError(`sku_price must be greater than 0, got ${sku_price}`);
            }

            if (sku_stock < 0) {
                throw new BadRequestError(`sku_stock must be >= 0, got ${sku_stock}`);
            }

            if (!sku_tier_idx || sku_tier_idx.length === 0) {
                throw new BadRequestError("sku_tier_idx is required");
            }

            const variationOptions = sku_tier_idx.map((idx, i) => {
                if (!product_variations[i]) {
                    throw new BadRequestError(`Invalid tier_idx: variation at index ${i} not found`);
                }
                const option = product_variations[i].options[idx];
                if (option === undefined) {
                    throw new BadRequestError(`Invalid tier_idx: option ${idx} not found in variation ${product_variations[i].name}`);
                }
                return option;
            });

            const sku_slug = slugify(`${spu_product_name} ${variationOptions.join(" ")}`, { lower: true });
            const isDefault = sku_tier_idx.every((idx) => idx === 0);

            return {
                sku_id: `sku_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`,
                sku_tier_idx,
                sku_default: isDefault,
                sku_slug,
                sku_sort,
                sku_price,
                sku_stock,
                product_id
            };
        });

        const createdSkus = await SkuRepository.createManySkus(skusToCreate);

        if (!createdSkus || createdSkus.length === 0) {
            throw new BadRequestError("Failed to create SKUs");
        }

        return createdSkus;
    }

    static async createSku(payload: ICreateSkuPayload & { product_id: string; spu_product_name: string; product_variations: IProductVariation[] }) {
        const { product_id, spu_product_name, product_variations, sku_tier_idx, sku_price, sku_stock, sku_sort = 0 } = payload;

        if (!product_id) {
            throw new BadRequestError("product_id is required");
        }

        if (sku_price <= 0) {
            throw new BadRequestError("sku_price must be greater than 0");
        }

        if (sku_stock < 0) {
            throw new BadRequestError("sku_stock must be >= 0");
        }

        const variationOptions = sku_tier_idx.map((idx, i) => {
            if (!product_variations[i]) {
                throw new BadRequestError(`Invalid tier_idx: variation at index ${i} not found`);
            }
            return product_variations[i].options[idx];
        });

        const sku_slug = slugify(`${spu_product_name} ${variationOptions.join(" ")}`, { lower: true });
        const isDefault = sku_tier_idx.every((idx) => idx === 0);
        const sku_id = `sku_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;

        const newSku = await SkuRepository.createSku({
            sku_id,
            sku_tier_idx,
            sku_default: isDefault,
            sku_slug,
            sku_sort,
            sku_price,
            sku_stock,
            product_id
        });

        if (!newSku) {
            throw new BadRequestError("Failed to create SKU");
        }

        return newSku;
    }

    static async findAllSkusBySpuId(product_id: string) {
        if (!product_id) {
            throw new BadRequestError("product_id is required");
        }

        const skus = await SkuRepository.findAllSkusBySpuId(product_id);
        return skus || [];
    }

    static async findSkuById(sku_id: string) {
        if (!sku_id) {
            throw new BadRequestError("sku_id is required");
        }

        const sku = await SkuRepository.findSkuById(sku_id);

        if (!sku) {
            throw new NotFoundError("SKU not found");
        }

        return sku;
    }

    static async findSkuByUniqueId(sku_unique_id: string) {
        if (!sku_unique_id) {
            throw new BadRequestError("sku_unique_id is required");
        }

        const sku = await SkuRepository.findSkuByUniqueId(sku_unique_id);

        if (!sku) {
            throw new NotFoundError("SKU not found");
        }

        return sku;
    }

    static async updateSku(sku_id: string, payload: Partial<ICreateSkuPayload>) {
        if (!sku_id) {
            throw new BadRequestError("sku_id is required");
        }

        const existingSku = await SkuRepository.findSkuById(sku_id);

        if (!existingSku) {
            throw new NotFoundError("SKU not found");
        }

        if (payload.sku_price !== undefined && payload.sku_price <= 0) {
            throw new BadRequestError("sku_price must be greater than 0");
        }

        if (payload.sku_stock !== undefined && payload.sku_stock < 0) {
            throw new BadRequestError("sku_stock must be >= 0");
        }

        const updatedSku = await SkuRepository.updateSku(sku_id, payload);

        if (!updatedSku) {
            throw new BadRequestError("Failed to update SKU");
        }

        return updatedSku;
    }

    static async updateSkuStock(sku_id: string, quantity: number) {
        if (!sku_id) {
            throw new BadRequestError("sku_id is required");
        }

        if (quantity === 0) {
            throw new BadRequestError("quantity cannot be 0");
        }

        const existingSku = await SkuRepository.findSkuById(sku_id);

        if (!existingSku) {
            throw new NotFoundError("SKU not found");
        }

        const newStock = existingSku.sku_stock + quantity;

        if (newStock < 0) {
            throw new BadRequestError(`Insufficient stock. Current: ${existingSku.sku_stock}, change: ${quantity}`);
        }

        const updatedSku = await SkuRepository.updateSkuStockByDbId(sku_id, quantity);

        if (!updatedSku) {
            throw new BadRequestError("Failed to update SKU stock");
        }

        return updatedSku;
    }
}

export default SkuService;
