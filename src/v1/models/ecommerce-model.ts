import { Schema, model, Document } from "mongoose";

// Interface for Product
export interface IProduct extends Document {
    productId: number;
    code: string;
    name: string;
    brand: string;
    description: string;
    release_date: Date;
    spec: { k: string; v: string; }[];
}

// Interface for Cart
export interface ICart extends Document {
    userId: number;
    cartId: number;
    status: 'active' | 'completed' | 'abandoned';
    products: { productId: number; quantity: number; }[];
    modifiedOn: Date;
}

// Interface for Order
export interface IOrder extends Document {
    cartId: number;
    orderId: number;
    userId: number;
    shipping: {
        address: string;
        city: string;
        pincode: string;
    };
    payment: {
        method: string;
        transactionId: string;
    };
    products: { productId: number; quantity: number; price: number; }[];
}

// Interface for Inventory
export interface IInventory extends Document {
    productId: number;
    quantity: number;
    reservations: { userId: number; quantity: number; productId: number; }[];
    create_at: Date;
}


const productSchema = new Schema<IProduct>({
    productId: { type: Number, required: true, unique: true },
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    brand: { type: String },
    description: { type: String },
    release_date: { type: Date },
    spec: [{
        k: { type: String },
        v: { type: String },
        _id: false
    }]
}, { timestamps: true, collection: 'products' });

const cartSchema = new Schema<ICart>({
    userId: { type: Number, required: true },
    cartId: { type: Number, required: true, unique: true },
    status: { type: String, enum: ['active', 'completed', 'abandoned'], default: 'active' },
    products: [{
        productId: { type: Number, required: true },
        quantity: { type: Number, required: true, default: 1 }
    }]
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'modifiedOn' } });

const orderSchema = new Schema<IOrder>({
    cartId: { type: Number, required: true },
    orderId: { type: Number, required: true, unique: true },
    userId: { type: Number, required: true },
    shipping: {
        address: { type: String },
        city: { type: String },
        pincode: { type: String }
    },
    payment: {
        method: { type: String },
        transactionId: { type: String }
    },
    products: [{
        productId: { type: Number },
        quantity: { type: Number },
        price: { type: Number }
    }]
}, { timestamps: true });

const inventorySchema = new Schema<IInventory>({
    productId: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 0 },
    reservations: [{
        userId: { type: Number },
        quantity: { type: Number },
        productId: { type: Number }
    }]
}, { timestamps: { createdAt: 'create_at', updatedAt: false } });


export const Product = model<IProduct>('Product', productSchema);
export const Cart = model<ICart>('Cart', cartSchema);
export const Order = model<IOrder>('Order', orderSchema);
export const Inventory = model<IInventory>('Inventory', inventorySchema);