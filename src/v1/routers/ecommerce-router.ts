import express from "express";
import {
    createProduct,
    createCart,
    createOrder,
    createInventory,
    addProductToCart
} from "../controllers/ecommerce-controller";

const router = express.Router();

router.post("/products", createProduct);
router.post("/carts", createCart);
router.post("/orders", createOrder);
router.post("/inventories", createInventory);
router.post("/carts/add-product", addProductToCart);

export default router;