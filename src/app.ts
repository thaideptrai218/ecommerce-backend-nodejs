import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import dotenv from "dotenv";
import cors from "cors";

import router from "./routers";
import { NotFoundError } from "./core/error-respone";
dotenv.config({
    quiet: true,
});
const app = express();

// init middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(cors());

// init db
require("./databases/init_mongoose");
// init routes
app.use("/", router);

// init error handling
app.use((req, res, next) => {
    next(new NotFoundError("Not Found"));
});

app.use((error, req, res, next) => {
    const statusCode = error.status || 500;
    console.log(error);
    return res.status(statusCode).json({
        status: "error",
        code: statusCode,
        message: error.message || "Internal Server Error",
    });
});

export default app;
