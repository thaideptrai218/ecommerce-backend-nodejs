import express from "express";
import spuController from "../../controllers/spu-controller";
import { asyncHandler } from "../../helpers/asyncHandler";
import { authentication } from "../../auth/check-auth";

const router = express.Router();

router.get("/shop/drafts", asyncHandler(spuController.findAllDraftsForShop));
router.get("/shop/published", asyncHandler(spuController.findAllPublishedForShop));
router.get("/:spu_id", asyncHandler(spuController.findSpu));
router.get("/", asyncHandler(spuController.findAllSpus));

router.use(authentication);

router.post("/", asyncHandler(spuController.createSpu));
router.patch("/:spu_id", asyncHandler(spuController.updateSpu));
router.delete("/:spu_id", asyncHandler(spuController.deleteSpu));
router.patch("/:spu_id/publish", asyncHandler(spuController.publishSpu));
router.patch("/:spu_id/unpublish", asyncHandler(spuController.unpublishSpu));

export default router;
