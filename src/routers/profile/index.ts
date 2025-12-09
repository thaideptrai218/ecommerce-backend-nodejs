import express from "express";
import profileController from "../../controllers/profile-controller";

const router = express.Router();

router.get("/viewAny", profileController.profiles);

router.get("viewOwn", profileController.profile);

export default router;
