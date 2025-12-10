import "dotenv/config";
import app from "./src/app";
import { initReids } from "./src/configs/redis-config";
const PORT = 3055;

// init db
require("./src/databases/init_mongoose");
initReids();
const server = app.listen(PORT, () => {
    console.log(`WSV eCommerce start with port ${PORT}`);
});

process.on("SIGINT", () => {
    server.close(() => console.log(`Exit Server Express`));
    process.exit();
});
