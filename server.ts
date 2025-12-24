import "dotenv/config";
import app from "./src/app";
import { initReids } from "./src/configs/redis-config";
import {
    initElasticsearch,
    closeElasticsearch,
    getElasticsearch,
} from "./src/configs/elasticsearch-config";
import { closeRedis } from "./src/configs/redis-config";
const PORT = 3055;

// init db
require("./src/databases/init_mongoose");
initReids();
initElasticsearch();
const esClient = getElasticsearch();

const server = app.listen(PORT, () => {
    console.log(`WSV eCommerce start with port ${PORT}`);
});

process.on("SIGINT", async () => {
    server.close(() => console.log(`Exit Server Express`));
    await closeRedis();
    await closeElasticsearch();
    process.exit();
});
