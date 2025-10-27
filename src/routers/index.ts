import express from "express";
import accessRouter from "./access";
import { apiKey, permission } from "../auth/check-auth";

const router = express.Router();

// check ApiKey
// router.use(apiKey);
// router.use(permission("0000"));

router.use("/v1/api", accessRouter);

export default router;
