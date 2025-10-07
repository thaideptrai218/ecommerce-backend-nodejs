import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";

const app = express();

// init middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

// init db
require("./databases/init_mongoose");
const { checkOverload } = require("./helpers/check-connect");

checkOverload();

// init routes
app.get("/", (req, res, next) => {
    const strCompress = "Hello From TipsJs";
    return res.status(200).json({
        message: "Welcome Fantipsjs!",
        metadata: strCompress.repeat(10000),
    });
});

export default app;
