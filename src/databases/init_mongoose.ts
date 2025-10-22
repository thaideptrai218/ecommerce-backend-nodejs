import mongoose from "mongoose";
import { countConnect, checkOverload } from "../helpers/check-connect";
import dbconfig from "../configs/config-mongodb";

const connectString = `mongodb://${dbconfig.db.host}:${dbconfig.db.port}/${dbconfig.db.name}`;

console.log(`connectionString:: `, connectString);

class Database {
    static instance: any;
    constructor() {
        this.connect();
    }

    connect(type = "mongodb") {
        if (1 === 1) {
            mongoose.set("debug", true);
            mongoose.set("debug", { color: true });
        }
        mongoose
            .connect(connectString, {
                maxPoolSize: 50,
            })
            .then((_) =>
                console.log(
                    `Connected success, number of connections ${countConnect()}`
                )
            )
            .catch((err) => {
                throw err;
            });
    }
    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}

const instanceMongodb = Database.getInstance();

export default instanceMongodb;
