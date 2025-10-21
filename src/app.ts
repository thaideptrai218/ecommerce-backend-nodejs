import express, { json } from "express";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import dotenv from "dotenv";

import { router } from "./routers";
dotenv.config({
    quiet: true,
    debug: true,
});
const app = express();

console.log(`Process: `, process.env);

// init middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({
    extended: true,
}))

// init db
require("./databases/init_mongoose");
// init routes

app.use("/", router);

app.get("/", (req, res, next) => {
    const strCompress = "Hello From TipsJs";
    return res.status(200).json({
        message: "Welcome Fantipsjs!",
    });
});

export default app;
