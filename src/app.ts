import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import router from "./routers";
import { NotFoundError } from "./core/error-respone";
import crypto from "node:crypto";
import mylogger from "./loggers/mylogger";

const app = express();

app.use(cors());
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

app.use((req, res, next) => {
    const requestId = req.headers["x-request-id"];
    req.requestId = requestId ? requestId : crypto.randomUUID();
    mylogger.log("input params", {
        context: req.path,
        requestId: req.requestId,
        metadata: {
            method: req.method,
            query: req.query,
            body: req.body
        },
    });

    next();
});

// init routes
app.use("/", router);

// init error handling
app.use((req, res, next) => {
    next(new NotFoundError("Not Found"));
});

app.use((error, req, res, next) => {
    const statusCode = error.status || 500;
    // REPLACE console.log with mylogger.error
    mylogger.error(error.message, {
        context: req.path,
        requestId: req.requestId,
        metadata: {
            stack: error.stack,
            error: error
        }
    });
    return res.status(statusCode).json({
        status: "error",
        code: statusCode,
        message: error.message || "Internal Server Error",
    });
});

export default app;
