import {
    productModel,
    clothingModel,
    electronicModel,
} from "../models/product-model";
import { BadRequestError, NotFoundError } from "../core/error-respone";
import { Created } from "../core/success-respone";
import { Types } from "mongoose"; // Import Types for ObjectId
import ProductRepository from "../models/repositories/product.repo";
import { InventoryRepository } from "../models/repositories/inventory-repo";

// --- Base Product Class (Abstract) ---
abstract class Product {
    constructor(
        protected commonPayload?: {
            _id: Types.ObjectId;
            product_name: string;
            product_thumb: string;
            product_description: string;
            product_price: number;
            product_quantity: number;
            product_type: string;
            product_shop: Types.ObjectId;
        },
        protected productAttributes?: any
    ) {}

    abstract createTypeSpecificProduct(): Promise<any>;

    async updateProduct(productId: string, payload: any) {
        return await ProductRepository.updateProductById({
            productId,
            payload,
            model: productModel,
        });
    }
}

// --- Concrete Product Implementations ---
class ClothingProduct extends Product {
    async createTypeSpecificProduct(): Promise<any> {
        const newClothing = await clothingModel.create({
            _id: this.commonPayload._id,
            product_shop: this.commonPayload.product_shop,
            ...this.productAttributes,
        });
        if (!newClothing)
            throw new BadRequestError("Create new Clothing error");
        return newClothing;
    }

    async updateProduct(productId: string, payload: any): Promise<any> {
        const { product_attributes, ...commonPayload } = payload;

        if (product_attributes && Object.keys(product_attributes).length > 0) {
            await ProductRepository.updateProductById({
                productId,
                payload: product_attributes,
                model: clothingModel,
            });
        }

        return await super.updateProduct(productId, payload);
    }
}

class ElectronicProduct extends Product {
    async createTypeSpecificProduct(): Promise<any> {
        const newElectronic = await electronicModel.create({
            _id: this.commonPayload._id,
            product_shop: this.commonPayload.product_shop,
            ...this.productAttributes,
        });
        if (!newElectronic)
            throw new BadRequestError("Create new Electronic error");
        return newElectronic;
    }

    async updateProduct(productId: string, payload: any): Promise<any> {
        const { product_attributes, ...commonPayload } = payload;

        if (product_attributes && Object.keys(product_attributes).length > 0) {
            await ProductRepository.updateProductById({
                productId,
                payload: product_attributes,
                model: electronicModel,
            });
        }

        return await super.updateProduct(productId, payload);
    }
}

// --- Product Factory ---
class ProductFactory {
    private static productRegistry: { [key: string]: typeof Product } = {};

    static registerProductType(type: string, productClass: typeof Product) {
        ProductFactory.productRegistry[type] = productClass;
    }

    static createProductInstance(
        type: string,
        commonPayload?: any,
        productAttributes?: any
    ): Product {
        const ProductClass = ProductFactory.productRegistry[type];
        if (!ProductClass) {
            throw new BadRequestError("Invalid Product Type");
        }
        return new ProductClass(commonPayload, productAttributes);
    }
}

ProductFactory.registerProductType("Clothing", ClothingProduct);
ProductFactory.registerProductType("Electronics", ElectronicProduct);

// --- Main Product Service ---
class ProductService {
    static async createProduct(product_type: string, payload: any) {
        const { product_attributes, ...commonPayload } = payload;

        const newProduct = await productModel.create({
            ...commonPayload,
            product_attributes,
            product_type: product_type,
        });
        if (!newProduct) throw new BadRequestError("Create new Product error");

        const productInstance = ProductFactory.createProductInstance(
            product_type,
            { ...commonPayload, _id: newProduct._id },
            product_attributes
        );
        await productInstance.createTypeSpecificProduct();

        if (newProduct) {
            InventoryRepository.insertInventory({
                productId: newProduct._id,
                shopId: newProduct.product_shop,
                stock: newProduct.product_quantity,
            });
        }
        return newProduct;
    }

    static async updateProduct(product_id: string, payload: any): Promise<any> {
        const product = await productModel.findById(product_id).lean();
        if (!product) {
            throw new NotFoundError("Product not found");
        }

        const productInstance = ProductFactory.createProductInstance(
            product.product_type
        );

        return await productInstance.updateProduct(product_id, payload);
    }

    // ... (rest of the service remains the same)
    static async getProductById(productId: string) {
        return null;
    }

    static async getAllProducts() {
        return [];
    }

    static async deleteProduct(productId: string) {
        return null;
    }

    static async findAllDraftForShop({
        product_shop,
        limit = 50,
        skip = 0,
    }: {
        product_shop: Types.ObjectId;
        limit?: number;
        skip?: number;
    }) {
        const query = { product_shop, isDraft: true };
        return await ProductRepository.findAllDraftForShop({
            query,
            limit,
            skip,
        });
    }

    static async findAllPublishForShop({
        product_shop,
        limit = 50,
        skip = 0,
    }: {
        product_shop: Types.ObjectId;
        limit?: number;
        skip?: number;
    }) {
        const query = { product_shop, isPublished: true };
        return await ProductRepository.findAllPublishForShop({
            query,
            limit,
            skip,
        });
    }

    static async unpublishProductByShop({
        product_shop,
        product_id,
    }: {
        product_shop: Types.ObjectId;
        product_id: Types.ObjectId;
    }) {
        return await ProductRepository.unpublishProductByShop({
            product_shop,
            product_id,
        });
    }

    static async publishProductByShop({
        product_shop,
        product_id,
    }: {
        product_shop: Types.ObjectId;
        product_id: Types.ObjectId;
    }) {
        return await ProductRepository.publishProductByShop({
            product_shop,
            product_id,
        });
    }

    static async searchProductByUser({ keySearch }: { keySearch: string }) {
        return await ProductRepository.searchProductByUser({ keySearch });
    }

    static async findAllProducts({
        limit = 50,
        sort = "ctime",
        page = 1,
        filter = { isPublished: true },
    }) {
        return await ProductRepository.findAllProduct({
            limit,
            sort,
            filter,
            page,
            select: ["product_name", "product_price", "product_thumb"],
        });
    }

    static async findProduct({ product_id }) {
        return await ProductRepository.findProduct({
            product_id,
        });
    }
}

export default ProductService;
