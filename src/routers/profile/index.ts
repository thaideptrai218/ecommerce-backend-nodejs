import express from "express";
import profileController from "../../controllers/profile-controller";
import { grantAccess } from "../../middleware/rbac";

const router = express.Router();

router.get(
    "/viewAny",
    grantAccess("readAny", "profile"),
    profileController.profiles
);

router.get(
    "viewOwn",
    grantAccess("readOwn", "profile"),
    profileController.profile
);

export default router;
