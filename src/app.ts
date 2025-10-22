import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import dotenv from "dotenv";

import { router } from "./routers";
import { NotFoundError, ErrorResponse } from "./core/error-respone";
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
app.use(
    express.urlencoded({
        extended: true,
    })
);

// init db
require("./databases/init_mongoose");
// init routes
app.use("/", router);

// init error handling
app.use((req, res, next) => {
    next(new NotFoundError("Not Found"));
});

app.use((error: ErrorResponse, req: Request, res: Response, next: NextFunction) => {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
        status: "error",
        code: statusCode,
        message: error.message || "Internal Server Error",
    });
});

export default app;
