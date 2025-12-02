import express from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import uploadController from "../../controllers/upload-controller";
import { uploadDisk, uploadMem } from "../../configs/multer-config";

const router = express.Router();

router.post("/product", asyncHandler(uploadController.uploadFile));
router.post("/product/thumb", uploadDisk.single("file"), asyncHandler(uploadController.vsuploadFileThumb));
router.post(
    "/product/multiple",
    uploadDisk.array("files", 3),
    asyncHandler(uploadController.uploadImageFromLocalFiles)
);
router.post(
    "/product/bucket",
    uploadMem.single("file"),
    asyncHandler(uploadController.uploadImageFromLocalS3)
);


export default router;
