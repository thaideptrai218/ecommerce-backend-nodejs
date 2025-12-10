import "dotenv/config";
import app from "./src/app";

const PORT = 3055;

// init db
require("./src/databases/init_mongoose");

const server = app.listen(PORT, () => {
    console.log(`WSV eCommerce start with port ${PORT}`);
});

process.on("SIGINT", () => {
    server.close(() => console.log(`Exit Server Express`));
    process.exit();
});
