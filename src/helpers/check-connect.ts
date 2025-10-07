import mongooese from "mongoose";
import os from "os";
import process from "process";

const _SECOND = 5000;
const countConnect = (): number => {
    const numConnection = mongooese.connections.length;
    return numConnection;
};

const checkOverload = () => {
    setInterval(() => {
        const numberOfConnections = countConnect();
        const numbCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;
        // example maximum number of connections based on number of cores
        const maxConnections = numbCores * 5;

        console.log(`Active connections:: ${numberOfConnections}`);
        console.log(`Memory usage:: ${memoryUsage / 1024 / 1024} MB`);

        if (numberOfConnections > maxConnections) {
            console.log(`Connection overload detected!`);
        }
    }, _SECOND); //Monitor every 5 seconds
};

export { countConnect, checkOverload };
