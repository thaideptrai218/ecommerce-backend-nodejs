import { SkuModel } from "../sku.model";

class SkuRepository {
  static async createSku(sku: any) {
    return await SkuModel.create(sku);
  }

  static async createManySkus(skus: any[]) {
    return await SkuModel.insertMany(skus);
  }

  static async findSkuById(sku_id: string) {
    return await SkuModel.findById(sku_id).lean();
  }

  static async findSkuByUniqueId(sku_unique_id: string) {
    return await SkuModel.findOne({ sku_id: sku_unique_id }).lean();
  }

  static async findAllSkusBySpuId(product_id: string) {
    // product_id in SkuModel is the string ID of the SPU, not ObjectId
    return await SkuModel.find({ product_id }).lean();
  }

  static async updateSku(sku_id: string, payload: any) {
    return await SkuModel.findByIdAndUpdate(sku_id, payload, { new: true }).lean();
  }

  static async updateSkuStock(sku_id: string, quantity: number) {
    return await SkuModel.findOneAndUpdate(
      { sku_id: sku_id }, // Using unique string ID or _id? Model has sku_id unique string. Let's support both or clarify.
      // Usually stock updates happen by unique SKU ID (business ID) or DB ID.
      // Given findAllSkusBySpuId uses product_id (string), likely sku_id (string) is primary key for logic.
      // But updateProductQuantity in product.repo uses findByIdAndUpdate.
      // Let's assume passed sku_id is _id for consistency with updateSku,
      // BUT SkuModel has sku_stock.
      { $inc: { sku_stock: quantity } },
      { new: true }
    ).lean();
  }

  // Overload/Variant for updating by database ID
  static async updateSkuStockByDbId(id: string, quantity: number) {
      return await SkuModel.findByIdAndUpdate(
          id,
          { $inc: { sku_stock: quantity } },
          { new: true }
      ).lean();
  }
}

export default SkuRepository;