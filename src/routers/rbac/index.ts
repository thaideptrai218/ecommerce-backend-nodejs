import express from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import {
    listResource,
    listRole,
    newResource,
    newRole,
} from "../../controllers/rbac-controller";

const router = express.Router();

router.post("/role", asyncHandler(newRole));
router.get("/roles", asyncHandler(listRole));

router.post("/resource", asyncHandler(newResource));
router.get("/resources", asyncHandler(listResource));

export default router;
