import inventory from "../inventory";

export class InventoryRepository {
    static insertInventory = async ({
        productId,
        shopId,
        stock,
        location = "unknown",
    }) => {
        return await inventory.create({
            inven_productId: productId,
            inven_shopId: shopId,
            inven_stock: stock,
            inven_location: location,
        });
    };
}
