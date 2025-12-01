import express from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import uploadController from "../../controllers/upload-controller";
import { uploadDisk } from "../../configs/multer-config";

const router = express.Router();

router.post("/product", asyncHandler(uploadController.uploadFile));
router.post("/product/thumb", uploadDisk.single("file"), asyncHandler(uploadController.uploadFileThumb));


export default router;
