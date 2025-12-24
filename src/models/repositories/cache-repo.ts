import { RedisErrorRespone } from "../../core/error-respone";
import { getRedis } from "../../configs/redis-config";

const NULL_MARKER = "__NULL__";

const client = getRedis();

const serialize = (value: unknown): string => {
    if (value === null || value === undefined) return NULL_MARKER;
    return JSON.stringify(value);
};

const deserialize = <T>(value: string | null): T | null => {
    if (value === null || value === undefined) return null;
    if (value === NULL_MARKER) return null;
    try {
        return JSON.parse(value) as T;
    } catch {
        return value as T;
    }
};

const getErrorMsg = (error: unknown): string => {
    if (error instanceof Error) return error.message;
    return String(error);
};

export const cacheGet = async <T>(key: string): Promise<T | null> => {
    try {
        const value = await client.get(key);
        return deserialize<T>(value);
    } catch (error) {
        throw new RedisErrorRespone(`Cache get failed: ${getErrorMsg(error)}`);
    }
};

export const cacheSet = async (key: string, value: unknown, ttl?: number): Promise<"OK"> => {
    try {
        const serialized = serialize(value);
        if (ttl && ttl > 0) {
            return await client.setex(key, ttl, serialized);
        }
        return await client.set(key, serialized);
    } catch (error) {
        throw new RedisErrorRespone(`Cache set failed: ${getErrorMsg(error)}`);
    }
};

export const cacheDel = async (key: string): Promise<number> => {
    try {
        return await client.del(key);
    } catch (error) {
        throw new RedisErrorRespone(`Cache delete failed: ${getErrorMsg(error)}`);
    }
};

export const cacheMget = async <T>(keys: string[]): Promise<(T | null)[]> => {
    if (keys.length === 0) return [];
    try {
        const values = await client.mget(...keys);
        return values.map(v => deserialize<T>(v));
    } catch (error) {
        throw new RedisErrorRespone(`Cache mget failed: ${getErrorMsg(error)}`);
    }
};

export const cacheMset = async (keyValuePairs: Record<string, unknown>, ttl?: number): Promise<void> => {
    const pipeline = client.pipeline();
    for (const [key, value] of Object.entries(keyValuePairs)) {
        const serialized = serialize(value);
        if (ttl && ttl > 0) {
            pipeline.setex(key, ttl, serialized);
        } else {
            pipeline.set(key, serialized);
        }
    }
    try {
        const results = await pipeline.exec();
        if (!results) throw new Error("Pipeline exec returned null");
        const hasError = results.some(([err]) => err);
        if (hasError) throw new Error("Pipeline exec has errors");
    } catch (error) {
        throw new RedisErrorRespone(`Cache mset failed: ${getErrorMsg(error)}`);
    }
};

export const cacheIncr = async (key: string): Promise<number> => {
    try {
        return await client.incr(key);
    } catch (error) {
        throw new RedisErrorRespone(`Cache incr failed: ${getErrorMsg(error)}`);
    }
};

export const cacheIncrBy = async (key: string, value: number): Promise<number> => {
    try {
        return await client.incrby(key, value);
    } catch (error) {
        throw new RedisErrorRespone(`Cache incrby failed: ${getErrorMsg(error)}`);
    }
};

export const cacheDecr = async (key: string): Promise<number> => {
    try {
        return await client.decr(key);
    } catch (error) {
        throw new RedisErrorRespone(`Cache decr failed: ${getErrorMsg(error)}`);
    }
};

export const cacheExpire = async (key: string, ttl: number): Promise<number> => {
    try {
        return await client.expire(key, ttl);
    } catch (error) {
        throw new RedisErrorRespone(`Cache expire failed: ${getErrorMsg(error)}`);
    }
};

export const cacheTtl = async (key: string): Promise<number> => {
    try {
        return await client.ttl(key);
    } catch (error) {
        throw new RedisErrorRespone(`Cache ttl failed: ${getErrorMsg(error)}`);
    }
};

export const cacheExists = async (key: string): Promise<number> => {
    try {
        return await client.exists(key);
    } catch (error) {
        throw new RedisErrorRespone(`Cache exists failed: ${getErrorMsg(error)}`);
    }
};

export const cacheKeys = async (pattern: string): Promise<string[]> => {
    try {
        return await client.keys(pattern);
    } catch (error) {
        throw new RedisErrorRespone(`Cache keys failed: ${getErrorMsg(error)}`);
    }
};

export const cacheFlushDb = async (): Promise<"OK"> => {
    try {
        return await client.flushdb();
    } catch (error) {
        throw new RedisErrorRespone(`Cache flushdb failed: ${getErrorMsg(error)}`);
    }
};