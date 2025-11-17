import inventory from "../inventory-model";

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

    static reservationInventory = async ({ productId, quantity, cartId }) => {
        return inventory.updateOne(
            { inven_productId: productId, inven_stock: { $gte: quantity } },
            {
                $inc: {
                    inven_stock: -quantity,
                },
                $push: {
                    inven_reservations: {
                        quantity,
                        cartId,
                    },
                },
            },
            { upsert: true }
        );
    };
}
