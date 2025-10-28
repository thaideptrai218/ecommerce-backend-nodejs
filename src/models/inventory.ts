import { Schema, model, Types } from "mongoose"; // Erase if already required

const DOCUMENT_NAME = "Inventory";
const COLLECTION_NAME = "inventories";

// Declare the Schema of the Mongo model
const inventorySchema = new Schema(
    {
        inven_productId: { type: Types.ObjectId, ref: "Product" },
        inven_location: { type: String, default: "unknown" },
        inven_stock: { type: Number, required: true },
        inven_shopId: { type: Types.ObjectId, ref: "Shop" },
        inven_reservations: { type: Array, default: [] },
    },
    {
        collection: COLLECTION_NAME,
        timestamps: true,
    }
);

//Export the model
export default model(DOCUMENT_NAME, inventorySchema);
