import { Client, type ClientOptions } from "@elastic/elasticsearch";

// Constants for connection timeout handling
const ES_CONNECT_TIMEOUT = 10000;
const ES_CONNECT_MESSAGE = {
    code: -99,
    message: {
        vn: "Elasticsearch LOI ROI AE",
        en: "Elasticsearch SERVICE connect error",
    },
};

// Connection status tracking
const statusConnectES = {
    CONNECT: "connect",
    END: "end",
    RECONNECT: "reconnecting",
    ERROR: "error",
};

let client: Client | null = null;
let connectionTimeout: NodeJS.Timeout | null = null;

/**
 * Handle timeout error for Elasticsearch connection
 */
const handleTimeoutError = () => {
    if (connectionTimeout) clearTimeout(connectionTimeout);
    connectionTimeout = setTimeout(() => {
        console.error(
            `Elasticsearch Connection Error: ${ES_CONNECT_MESSAGE.message.en} - ${ES_CONNECT_MESSAGE.message.vn}`
        );
    }, ES_CONNECT_TIMEOUT);
};

/**
 * Parse Elasticsearch node URLs from environment variable
 * Supports comma-separated nodes for cluster configuration
 * @returns Array of node URLs
 */
const parseNodeUrls = (): string[] => {
    const nodeEnv = process.env.ES_NODES || "http://localhost:9200";
    return nodeEnv.split(",").map((node) => node.trim());
};

/**
 * Build Elasticsearch client configuration from environment variables
 * @returns Client options object
 */
const buildClientConfig = (): ClientOptions => {
    const nodes = parseNodeUrls();
    const isDev = process.env.NODE_ENV !== "production";

    const config: ClientOptions = {
        nodes,
    };

    // Add authentication if configured
    if (process.env.ES_USERNAME && process.env.ES_PASSWORD) {
        config.auth = {
            username: process.env.ES_USERNAME,
            password: process.env.ES_PASSWORD,
        };
    }

    // Add API key if configured (alternative to username/password)
    if (process.env.ES_API_KEY) {
        config.auth = {
            apiKey: process.env.ES_API_KEY,
        };
    }

    // TLS configuration for production
    if (!isDev && process.env.ES_CA_FINGERPRINT) {
        config.tls = {
            caFingerprint: process.env.ES_CA_FINGERPRINT,
        };
    }

    // Request timeout configuration
    config.requestTimeout =
        parseInt(process.env.ES_REQUEST_TIMEOUT || "30000", 10);

    // Connection pool configuration
    config.maxRetries = parseInt(process.env.ES_MAX_RETRIES || "3", 10);
    config.retryOnTimeout = true;

    // Sniffing for cluster discovery (disabled in dev, enabled in prod)
    if (!isDev && process.env.ES_SNIFF_ENABLED === "true") {
        config.sniffOnStart = true;
        config.sniffInterval = parseInt(
            process.env.ES_SNIFF_INTERVAL || "300000",
            10
        ); // 5 minutes default
        config.sniffOnConnectionFault = true;
    }

    // Compression for better performance
    config.compression = process.env.ES_COMPRESSION === "gzip" ? "gzip" : false;

    return config;
};

/**
 * Initialize Elasticsearch client with connection event handlers
 */
export const initElasticsearch = () => {
    try {
        const config = buildClientConfig();
        const instance = new Client(config);

        // Setup connection monitoring
        setupConnectionMonitoring(instance);

        client = instance;

        // Verify connection on init
        verifyConnection();

        return instance;
    } catch (error) {
        console.error("Failed to initialize Elasticsearch:", error);
        throw error;
    }
};

/**
 * Setup connection event monitoring for Elasticsearch client
 * Note: Node.js ES client uses different event patterns
 */
const setupConnectionMonitoring = (instance: Client) => {
    // The @elastic/elasticsearch client doesn't emit standard Node events
    // We'll monitor connection through ping/health checks
    if (!client) {
        console.log("Elasticsearch - Client created, verifying connection...");
    }
};

/**
 * Verify Elasticsearch connection by pinging the cluster
 */
const verifyConnection = async () => {
    if (!client) return;

    try {
        const response = await client.ping();
        if (response) {
            console.log("Elasticsearch - Connection status: connected");
            if (connectionTimeout) clearTimeout(connectionTimeout);
        }
    } catch (error) {
        console.log("Elasticsearch - Connection status: error");
        handleTimeoutError();
    }
};

/**
 * Get Elasticsearch client instance
 * Throws error if client not initialized
 * @returns Elasticsearch Client
 */
export const getElasticsearch = (): Client => {
    if (!client) {
        throw new Error(
            "Elasticsearch client not initialized. Call initElasticsearch() first."
        );
    }
    return client;
};

/**
 * Check if Elasticsearch client is initialized and connected
 * @returns true if client exists
 */
export const isElasticsearchReady = (): boolean => {
    return client !== null;
};

/**
 * Close Elasticsearch connection
 */
export const closeElasticsearch = async () => {
    if (client) {
        try {
            await client.close();
            client = null;
            console.log("Elasticsearch - Connection closed");
        } catch (error) {
            console.error("Elasticsearch - Error closing connection:", error);
        }
    }
};

/**
 * Get cluster health information
 * Useful for health checks and monitoring
 * @returns Cluster health status
 */
export const getClusterHealth = async () => {
    const esClient = getElasticsearch();
    try {
        return await esClient.cluster.health();
    } catch (error) {
        console.error("Elasticsearch - Failed to get cluster health:", error);
        throw error;
    }
};

/**
 * Get cluster info (version, name, etc.)
 * @returns Cluster information
 */
export const getClusterInfo = async () => {
    const esClient = getElasticsearch();
    try {
        return await esClient.info();
    } catch (error) {
        console.error("Elasticsearch - Failed to get cluster info:", error);
        throw error;
    }
};

/**
 * Health check helper for monitoring systems
 * Returns true if cluster is green or yellow
 * @returns true if healthy, false otherwise
 */
export const healthCheck = async (): Promise<boolean> => {
    try {
        const health = await getClusterHealth();
        return (
            health.status === "green" ||
            health.status === "yellow"
        );
    } catch {
        return false;
    }
};

// Export configuration constants for use in other modules
export const ES_CONFIG = {
    indices: {
        products: process.env.ES_INDEX_PRODUCTS || "ecommerce-products",
        spu: process.env.ES_INDEX_SPU || "ecommerce-spu",
        sku: process.env.ES_INDEX_SKU || "ecommerce-sku",
    },
    sync: {
        queueKey:
            process.env.ES_SYNC_QUEUE_KEY || "es:sync:queue",
        batchSize: parseInt(
            process.env.ES_SYNC_BATCH_SIZE || "100",
            10
        ),
    },
    search: {
        defaultSize: parseInt(
            process.env.ES_SEARCH_DEFAULT_SIZE || "20",
            10
        ),
        maxSize: parseInt(process.env.ES_SEARCH_MAX_SIZE || "100", 10),
    },
};