import Redis from "ioredis";
import { errorLogger, infoLogger } from "../logger/logger.utility";
import { staticProps } from "../../constants";

class RedisUtility {
  private redis: Redis;
  private defaultTTL: number; // Define a default TTL value

  constructor() {
    this.redis = new Redis("redis://:root@127.0.0.1:6379", {
      retryStrategy: (times) => {
        if (times > 1) {
          return null;
        }
        return Math.min(times * 50, 2000);
      },
    });

    this.redis.on("connect", () => {
      infoLogger.info(staticProps.redis.REDIS_CONNECTED);
    });

    this.redis.on("ready", () => {
      infoLogger.info(staticProps.redis.REDIS_READY);
    });

    this.redis.on("error", (err) => {
      if (err.message.includes("WRONGPASS")) {
        errorLogger.error(staticProps.redis.REDIS_PASSWORD_ERROR);
        this.redis.disconnect(); // Disconnect after authentication failure
      } else {
        errorLogger.error(`Redis error: ${err}`);
      }
    });

    this.redis.on("close", () => {
      infoLogger.info(staticProps.redis.REDIS_CLOSE);
    });

    this.defaultTTL = 60;
  }

  // Set a value with an optional expiration time (in seconds)
  async set(key: string, value: any, ttl?: number): Promise<void> {
    const stringValue = JSON.stringify(value);
    // Use the default TTL if no TTL is provided
    const expirationTime = ttl || this.defaultTTL;
    await this.redis.set(key, stringValue, "EX", expirationTime);
    infoLogger.info(`Key: ${key} set in Redis with TTL: ${expirationTime}`);
  }

  // Get a value and parse it back to JSON
  async get<T>(key: string): Promise<T | null> {
    const result = await this.redis.get(key);
    infoLogger.info(`Key: ${key} fetched from Redis`);
    return result ? JSON.parse(result) : null;
  }

  // Delete a key
  async del(key: string): Promise<void> {
    await this.redis.del(key);
    infoLogger.info(`Key: ${key} deleted from Redis`);
  }

  // Check if a key exists
  async exists(key: string): Promise<boolean> {
    const exists = await this.redis.exists(key);
    infoLogger.info(`Key: ${key} exists in Redis: ${exists > 0}`);
    return exists > 0;
  }

  // Clear all keys (use with caution in production)
  async flushAll(): Promise<void> {
    await this.redis.flushall();
    infoLogger.info(staticProps.redis.REDIS_FLUSHED);
  }

  // Close Redis connection
  async quit(): Promise<void> {
    await this.redis.quit();
    infoLogger.info(staticProps.redis.REDIS_CLOSE);
  }
}

// Export an instance of RedisUtility
export const redisUtility = new RedisUtility();
