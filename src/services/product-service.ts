import { productModel, clothingModel, electronicModel } from "../models/product-model";
import { BadRequestError } from "../core/error-respone";
import { Created } from "../core/success-respone";

// --- Base Product Class (Abstract) ---
// This class defines the common interface for creating different product types.
abstract class Product {
    constructor(protected payload: any) {}

    // Abstract method to be implemented by concrete product types
    abstract createProduct(): Promise<Created>;
}

// --- Concrete Product Implementations ---

class ClothingProduct extends Product {
    async createProduct(): Promise<Created> {
        const newClothing = await clothingModel.create({
            ...this.payload,
            product_type: "Clothing",
        });
        if (!newClothing) throw new BadRequestError("Create new Clothing error");
        return new Created("Clothing product created successfully!", newClothing);
    }
}

class ElectronicProduct extends Product {
    async createProduct(): Promise<Created> {
        const newElectronic = await electronicModel.create({
            ...this.payload,
            product_type: "Electronics",
        });
        if (!newElectronic) throw new BadRequestError("Create new Electronic error");
        return new Created("Electronic product created successfully!", newElectronic);
    }
}

// --- Product Factory ---
// This factory is responsible for instantiating the correct Product subclass.
class ProductFactory {
    private static productRegistry: { [key: string]: typeof Product } = {};

    static registerProductType(type: string, productClass: typeof Product) {
        ProductFactory.productRegistry[type] = productClass;
    }

    static createProductInstance(type: string, payload: any): Product {
        const ProductClass = ProductFactory.productRegistry[type];
        if (!ProductClass) {
            throw new BadRequestError("Invalid Product Type");
        }
        return new ProductClass(payload);
    }
}

// Register product types with their concrete classes
ProductFactory.registerProductType("Clothing", ClothingProduct);
ProductFactory.registerProductType("Electronics", ElectronicProduct);

// --- Main Product Service ---
// This is the public API for product-related operations.
class ProductService {
    static async createProduct(product_type: string, payload: any): Promise<Created> {
        const productInstance = ProductFactory.createProductInstance(product_type, payload);
        return productInstance.createProduct();
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
}

export default ProductService;