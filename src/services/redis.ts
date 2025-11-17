import Redis from "ioredis";
import { InventoryRepository } from "../models/repositories/inventory-repo";

const redisClient = new Redis({
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379"),
    maxRetriesPerRequest: 3,
});

const acquireLock = async (
    productId: string,
    quantity: number,
    cartId: string
): Promise<string | null> => {
    const key = `lock_2025_${productId}`;
    const retryTimes = 10;
    const expireTime = 3000; // 3 seconds in milliseconds

    for (let i = 0; i < retryTimes; i++) {
        // Atomic set with expiration and NX (only if not exists)
        const result = await redisClient.set(
            key,
            cartId,
            "PX",
            expireTime,
            "NX"
        );

        if (result === "OK") {
            await InventoryRepository.reservationInventory({
                productId,
                quantity,
                cartId,
            });
            return key;
        }

        // Proper delay between retry attempts
        await new Promise((resolve) => setTimeout(resolve, 50));
    }

    return null; // Failed to acquire lock
};

const releaseLock = async (keyLock: string): Promise<number> => {
    return await redisClient.del(keyLock);
};

export { acquireLock, releaseLock, redisClient };
