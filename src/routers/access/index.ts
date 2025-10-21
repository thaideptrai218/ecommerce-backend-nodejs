import express from "express";
import accessController from "../../controllers/access-controller";

const router = express.Router();

// sign up
router.post("/shop/signup", accessController.signUp);

export { router };
