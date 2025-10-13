import type { Request, Response, NextFunction } from "express";
import {
    addProduct,
    addCart,
    addOrder,
    addInventory,
    addToCart
} from "../services/ecommerce-service";

const createProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { product } = req.body;
        const addedProduct = await addProduct(product);
        res.status(201).json({
            elements: addedProduct,
        });
    } catch (error) {
        next(error);
    }
};

const createInventory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { inventory } = req.body;

        const addedInventory = await addInventory(inventory);
        res.status(201).json({
            elements: addedInventory,
        });
    } catch (error) {
        next(error);
    }
};

const createCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cart = await addCart(req.body);
        res.status(201).json(cart);
    } catch (error) {
        next(error);
    }
};

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const order = await addOrder(req.body);
        res.status(201).json(order);
    } catch (error) {
        next(error);
    }
};

const addProductToCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, productId, quantity } = req.body;

        if (!userId || !productId) {
            return res.status(400).json({ message: 'userId and productId are required.' });
        }

        const cart = await addToCart({ userId, productId, quantity });
        res.status(200).json(cart);
    } catch (error) {
        // Check for specific error messages from the service
        if (error.message === 'Product not in stock or insufficient quantity.') {
            return res.status(409).json({ message: error.message }); // 409 Conflict
        }
        next(error); // Pass other errors to the generic error handler
    }
};

export { createProduct, createCart, createOrder, createInventory, addProductToCart };