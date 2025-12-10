import { Redis } from "ioredis";
import { RedisErrorRespone } from "../core/error-respone";

let client: Redis, connectionTimeout: NodeJS.Timeout;

const statusConnectRedis = {
    CONNECT: "connect",
    END: "end",
    RECONNECT: "reconnecting",
    ERROR: "error",
};

const REDIS_CONNECT_TIMEOUT = 10000,
    REDIS_CONNECT_MESSAGE = {
        code: -99,
        message: {
            vn: "REDIS LOI ROI AE",
            en: "SERVICE connect error",
        },
    };

const handleTimeoutError = () => {
    if (connectionTimeout) clearTimeout(connectionTimeout);
    connectionTimeout = setTimeout(() => {
        console.error(
            `Redis Connection Error: ${REDIS_CONNECT_MESSAGE.message.en} - ${REDIS_CONNECT_MESSAGE.message.vn}`
        );
    }, REDIS_CONNECT_TIMEOUT);
};

const handleEventConnection = (connectionRedis: Redis) => {
    // check if connection is null
    if (!connectionRedis) {
        throw new Error("Connection is null");
    }

    connectionRedis.on(statusConnectRedis.CONNECT, () => {
        console.log(`ConnectionRedis - Connection status: connected`);
        clearTimeout(connectionTimeout);
    });

    connectionRedis.on(statusConnectRedis.END, () => {
        console.log(`ConnectionRedis - Connection status: disconnected`);
        handleTimeoutError();
    });

    connectionRedis.on(statusConnectRedis.RECONNECT, () => {
        console.log(`ConnectionRedis - Connection status: reconnecting`);
        clearTimeout(connectionTimeout);
    });

    connectionRedis.on(statusConnectRedis.ERROR, () => {
        console.log(`ConnectionRedis - Connection status: error`);
        handleTimeoutError();
    });
};

export const initReids = () => {
    const instanceRedis = new Redis({
        retryStrategy: (times) => 10000,
        
    });

    client = instanceRedis;
    handleEventConnection(instanceRedis);
};

export const getRedis = () => client;

export const closeRedis = () => client.quit();
