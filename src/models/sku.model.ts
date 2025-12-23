import { Schema, model, Document } from 'mongoose';

const DOCUMENT_NAME = 'Sku';
const COLLECTION_NAME = 'skus';

interface ISku extends Document {
  sku_id: string; // Unique stock keeping unit ID (e.g., 'sku_red_m_123')
  sku_tier_idx: number[]; // Index array mapping to SPU variations (e.g., [0, 1] -> Red, Medium)
  sku_default: boolean; // Is this the default variant to show?
  sku_slug: string;
  sku_sort: number; // Sorting order
  sku_price: number;
  sku_stock: number; // Inventory count
  product_id: string; // Reference to SPU ID (string ID, not ObjectId for flexibility)

  isDraft: boolean;
  isPublished: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const skuSchema = new Schema<ISku>({
  sku_id: { type: String, required: true, unique: true },
  sku_tier_idx: { type: [Number], default: [0] }, // Maps to SPU product_variations
  sku_default: { type: Boolean, default: false },
  sku_slug: { type: String, index: true }, // e.g., 'iphone-15-midnight-256gb'
  sku_sort: { type: Number, default: 0 },
  sku_price: { type: Number, required: true }, // Using Number for consistency with SPU
  sku_stock: { type: Number, default: 0, min: 0 }, // Simple inventory tracking

  product_id: { type: String, required: true, index: true }, // Link to SPU

  isDraft: { type: Boolean, default: true, index: true, select: false },
  isPublished: { type: Boolean, default: false, index: true, select: false },
  isDeleted: { type: Boolean, default: false },
}, {
  timestamps: true,
  collection: COLLECTION_NAME
});

export const SkuModel = model<ISku>(DOCUMENT_NAME, skuSchema);