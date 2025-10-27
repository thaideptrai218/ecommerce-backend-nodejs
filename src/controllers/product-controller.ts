import type { Request, Response } from "express";
import ProductService from "../services/product-service";
import { Created } from "../core/success-respone";

class ProductController {
    static async createProduct(req: Request, res: Response) {
        const { product_type, ...payload } = req.body;
        const newProduct = await ProductService.createProduct(product_type, payload);
        return new Created("Product created successfully!", newProduct).send(res);
    }
}

export default ProductController;
