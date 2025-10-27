import express from "express";
import productController from "../../controllers/product-controller";
import { asyncHandler } from "../../helpers/asyncHandler";
import { authentication, authenticationV2 } from "../../auth/check-auth";

const router = express.Router();

// Public routes
router.get("/search/:keySearch", asyncHandler(productController.searchProductByUser));

// Apply authentication middleware to all product routes
router.use(authentication);

router.post("/", asyncHandler(productController.createProduct));
router.get("/drafts/all", asyncHandler(productController.findAllDraftForShop));
router.get(
    "/published/all",
    asyncHandler(productController.findAllPublishForShop)
);
router.patch("/publish/:id", asyncHandler(productController.publishProductByShop));
router.patch(
    "/unpublish/:id",
    asyncHandler(productController.unpublishProductByShop)
);

export default router;

