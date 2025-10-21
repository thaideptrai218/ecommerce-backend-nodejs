// level 01

const dev = {
    app: {
        port: process.env["PORT"] || 3000,
    },
    db: {
        host: process.env["DB_HOST"] || "localhost",
        port: process.env["DB_PORT"] || 27017,
        name: process.env["DB_NAME"] || "dbDev",
    },
};

const pro = {
    app: {
        port: process.env["PORT"] || 3000,
    },
    db: {
        host: process.env["DB_HOST"] || "localhost",
        port: process.env["DB_PORT"] || 27017,
        name: process.env["DB_NAME"] || "dbProduct",
    },
};

const config: object = { dev, pro };
const env = process.env["NODE_ENV"] || "dev";
export default config[env as keyof typeof config];
