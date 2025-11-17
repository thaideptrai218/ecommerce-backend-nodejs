import express from "express";
import accessRouter from "./access";
import productRouter from "./product"; // Import product router
import discountRouter from "./discount"; // Import discount router
import cartRouter from "./cart"; // Import cart router
import checkoutRouter from "./checkout"; // Import checkout router
import inventoryRouter from "./inventory"
import { apiKey, permission } from "../auth/check-auth";

const router = express.Router();

// check ApiKey
router.use(apiKey);
router.use(permission("0000"));

router.use("/v1/api", accessRouter);
router.use("/v1/api/product", productRouter); // Mount product router
router.use("/v1/api/discount", discountRouter); // Mount discount router
router.use("v1/api/inventory", inventoryRouter)
router.use("/v1/api/cart", cartRouter); // Mount cart router
router.use("/v1/api/checkout", checkoutRouter); // Mount checkout router

export default router;
