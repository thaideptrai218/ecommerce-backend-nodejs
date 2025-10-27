import type { Request, Response } from "express";
import ProductService from "../services/product-service";
import { Created, OK } from "../core/success-respone";
import { Types } from "mongoose";

class ProductController {
    static async createProduct(req: Request, res: Response) {
        const { product_type, ...payload } = req.body;
        const newProduct = await ProductService.createProduct(
            product_type,
            payload
        );
        return new Created("Product created successfully!", newProduct).send(
            res
        );
    }

    /**
     * @description GET ALL DRAFTS FOR SHOP
     * @param req
     * @param res
     * @returns JSON
     */
    static async findAllDraftForShop(req: Request, res: Response) {
        const { userId } = req.user;
        const products = await ProductService.findAllDraftForShop({
            product_shop: new Types.ObjectId(userId),
        });
        return new OK("Get all draft products successfully!", products).send(res);
    }

    static async findAllPublishForShop(req: Request, res: Response) {
        const { userId } = req.user;
        const products = await ProductService.findAllPublishForShop({
            product_shop: new Types.ObjectId(userId),
        });
        return new OK("Get all publish products successfully!", products).send(res);
    }

    static async searchProductByUser(req: Request, res: Response) {
        const { keySearch } = req.params;
        const products = await ProductService.searchProductByUser({ keySearch });
        return new OK("Search products successfully!", products).send(res);
    }

    static async publishProductByShop(req: Request, res: Response) {
        const { userId } = req.user;
        const { id } = req.params;
        const products = await ProductService.publishProductByShop({
            product_shop: new Types.ObjectId(userId),
            product_id: new Types.ObjectId(id),
        });
        return new OK("Publish product successfully!", products).send(res);
    }

    static async unpublishProductByShop(req: Request, res: Response) {
        const { userId } = req.user;
        const { id } = req.params;
        const products = await ProductService.unpublishProductByShop({
            product_shop: new Types.ObjectId(userId),
            product_id: new Types.ObjectId(id),
        });
        return new OK("Unpublish product successfully!", products).send(res);
    }
}

export default ProductController;
