import express, { json } from "express";
import { router as accessRouter } from "./access";

const router = express.Router();

router.use("/v1/api", accessRouter);

export { router };
