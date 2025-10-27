import { productModel, clothingModel, electronicModel } from "../models/product-model";
import { BadRequestError } from "../core/error-respone";
import { Created } from "../core/success-respone";
import { Types } from "mongoose"; // Import Types for ObjectId
import ProductRepository from "../models/repositories/product.repo";

// --- Base Product Class (Abstract) ---
// This class defines the common interface for creating type-specific product details.
abstract class Product {
    constructor(
        protected commonPayload: { // This payload now contains all common fields
            _id: Types.ObjectId; // The _id from the base product
            product_name: string;
            product_thumb: string;
            product_description: string;
            product_price: number;
            product_quantity: number;
            product_type: string;
            product_shop: Types.ObjectId;
            // ... any other common fields from productModel
        },
        protected productAttributes: any // Type-specific attributes
    ) {}

    // Abstract method to be implemented by concrete product types
    abstract createTypeSpecificProduct(): Promise<any>;
}

// --- Concrete Product Implementations ---

class ClothingProduct extends Product {
    async createTypeSpecificProduct(): Promise<any> {
        const newClothing = await clothingModel.create({
            _id: this.commonPayload._id,
            product_shop: this.commonPayload.product_shop,
            ...this.productAttributes,
        });
        if (!newClothing) throw new BadRequestError("Create new Clothing error");
        return newClothing;
    }
}

class ElectronicProduct extends Product {
    async createTypeSpecificProduct(): Promise<any> {
        const newElectronic = await electronicModel.create({
            _id: this.commonPayload._id,
            product_shop: this.commonPayload.product_shop,
            ...this.productAttributes,
        });
        if (!newElectronic) throw new BadRequestError("Create new Electronic error");
        return newElectronic;
    }
}

// --- Product Factory ---
// This factory is responsible for instantiating the correct Product subclass.
class ProductFactory {
    private static productRegistry: { [key: string]: typeof Product } = {};

    static registerProductType(type: string, productClass: typeof Product) {
        ProductFactory.productRegistry[type] = productClass;
    }

    static createProductInstance(
        type: string,
        commonPayload: { // All common fields
            _id: Types.ObjectId;
            product_name: string;
            product_thumb: string;
            product_description: string;
            product_price: number;
            product_quantity: number;
            product_type: string;
            product_shop: Types.ObjectId;
        },
        productAttributes: any
    ): Product {
        const ProductClass = ProductFactory.productRegistry[type];
        if (!ProductClass) {
            throw new BadRequestError("Invalid Product Type");
        }
        return new ProductClass(commonPayload, productAttributes);
    }
}

// Register product types with their concrete classes
ProductFactory.registerProductType("Clothing", ClothingProduct);
ProductFactory.registerProductType("Electronics", ElectronicProduct);

// --- Main Product Service ---
// This is the public API for product-related operations.
class ProductService {
    static async createProduct(product_type: string, payload: any): Promise<Created> {
        // Separate common product fields from type-specific attributes
        const { product_attributes, ...commonPayload } = payload;

        // 1. Create base product entry in the general 'products' collection
        const newProduct = await productModel.create({
            ...commonPayload,
            product_attributes,
            product_type: product_type, // Ensure product_type is set
        });
        if (!newProduct) throw new BadRequestError("Create new Product error");

        // 2. Create type-specific product using the base product's _id
        const productInstance = ProductFactory.createProductInstance(
            product_type,
            { ...commonPayload, _id: newProduct._id }, // Pass common fields + _id
            product_attributes
        );
        const typeSpecificProduct = await productInstance.createTypeSpecificProduct();

        return new Created("Product created successfully!", {
            product: newProduct,
            typeSpecificProduct: typeSpecificProduct, // Return both for clarity
        });
    }

    // Placeholder for other common product operations
    static async getProductById(productId: string) {
        // Implement logic to find a product by ID across all types
        return null;
    }

    static async getAllProducts() {
        // Implement logic to get all products across all types
        return [];
    }

    static async updateProduct(productId: string, payload: any) {
        // Implement logic to update a product by ID
        return null;
    }

    static async deleteProduct(productId: string) {
        // Implement logic to delete a product by ID
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
        return await ProductRepository.findAllDraftForShop({
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
}

export default ProductService;
