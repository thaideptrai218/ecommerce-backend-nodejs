import express from "express";
import accessRouter from "./access";
import productRouter from "./product";
import discountRouter from "./discount";
import cartRouter from "./cart";
import checkoutRouter from "./checkout";
import inventoryRouter from "./inventory";
import commentRouter from "./comment";
import notificationRouter from "./notification";
import uploadRouter from "./upload";
import profileRouter from "./profile";
import rbacRouter from "./rbac";
import emailRouter from "./email";
import userRouter from "./user";
import spuRouter from "./spu";
import { apiKey, permission } from "../auth/check-auth";

const router = express.Router();
router.use("/v1/api/user", userRouter);
router.use("/v1/api/email", emailRouter);
router.use("/v1/api/upload", uploadRouter);
router.use("/v1/api/profile", profileRouter);
router.use("/v1/api/rbac", rbacRouter);
router.use(apiKey);
router.use(permission("0000"));

router.use("/v1/api", accessRouter);
router.use("/v1/api/product", productRouter);
router.use("/v1/api/discount", discountRouter);
router.use("/v1/api/inventory", inventoryRouter);
router.use("/v1/api/cart", cartRouter);
router.use("/v1/api/checkout", checkoutRouter);
router.use("/v1/api/comment", commentRouter);
router.use("/v1/api/notification", notificationRouter);
router.use("/v1/api/spu", spuRouter);

export default router;
