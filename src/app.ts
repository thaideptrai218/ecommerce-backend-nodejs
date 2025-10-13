import express from "express";
import router from "./v1/routers/ecommerce-router";
import dotenv from "dotenv";
import Database from "./v1/databases/init.mongodb";

dotenv.config();
Database.getInstance();

const app = express();

app.use(express.json());
app.use("/v1/ecommerce", router);

// init routes
app.get("/", (req, res) => {
    const strCompress = "Hello From TipsJs";
    return res.status(200).json({
        message: "Welcome Fantipsjs!",
        metadata: strCompress.repeat(10000),
    });
});

export default app;
