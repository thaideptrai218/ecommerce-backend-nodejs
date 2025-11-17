import { BadRequestError } from "../core/error-respone";
import inventoryModel from "../models/inventory-model";
import { productModel } from "../models/product-model";
import ProductService from "./product-service";

export class InventoryService {
    static async addStockToInventory({
        stock,
        productId,
        shopId,
        localtion = "CoCKCKCKCKCK",
    }) {
        const product = await ProductService.getProductById(productId);

        if (!product) throw new BadRequestError("The product doest not exists!")
        return await inventoryModel.findOneAndUpdate({
            inven_shopId: shopId,
            inven_productId: productId
        }, {
            $inc: {
                inven_stock: stock
            },
            $set: {
                inven_location: localtion
            }
        }, {
            upsert: true,
            new: true
        })
    }
}
