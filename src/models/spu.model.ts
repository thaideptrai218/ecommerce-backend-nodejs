import { Schema, model, Document, Types } from 'mongoose';
import slugify from 'slugify';

const DOCUMENT_NAME = 'Spu';
const COLLECTION_NAME = 'spus';

interface IProductVariation {
  name: string;
  options: string[];
}

interface ISpu extends Document {
  product_id: string; // Internal random unique ID
  product_name: string;
  product_thumb: string;
  product_description: string;
  product_slug: string;
  product_price: number; // Base price or range (min price)
  product_category: string[]; // Hierarchy: ["Electronics", "Phones", "Apple"]
  product_shop: Types.ObjectId;
  product_attributes: Record<string, unknown>; // Flexible common attributes
  product_variations: IProductVariation[]; // Denormalized list of available options (e.g. colors: [red, blue], sizes: [M, L])
  isDraft: boolean;
  isPublished: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const spuSchema = new Schema<ISpu>({
  product_id: { type: String, required: true, unique: true }, // e.g., 'spu_12345'
  product_name: { type: String, required: true },
  product_thumb: { type: String, required: true },
  product_description: { type: String },
  product_slug: { type: String, index: true },
  product_price: { type: Number, required: true },
  product_category: { type: [String], default: [] },
  product_shop: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },

  // Attributes common to all variants (e.g., Brand, Material for clothes)
  product_attributes: { type: Schema.Types.Mixed, required: true },

  // Summary of available variations for easy filtering (Denormalization)
  // Example: { colors: ["Red", "Blue"], sizes: ["S", "M"] }
  product_variations: { type: Schema.Types.Mixed, default: [] },

  isDraft: { type: Boolean, default: true, index: true, select: false },
  isPublished: { type: Boolean, default: false, index: true, select: false },
  isDeleted: { type: Boolean, default: false },
}, {
  timestamps: true,
  collection: COLLECTION_NAME
});

// Middleware for slug
spuSchema.pre('save', function(next) {
  if (this.isModified('product_name')) {
    this.product_slug = slugify(this.product_name, { lower: true });
  }
  next();
});

export const SpuModel = model<ISpu>(DOCUMENT_NAME, spuSchema);