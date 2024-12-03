// src/utilities/cache/redis.utility.ts
import Redis from "ioredis";
import { errorLogger, infoLogger } from "../logger/logger.utility";

class RedisUtility {
  private redis: Redis;

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
      infoLogger.info("Redis is connected!");
    });

    this.redis.on("ready", () => {
      infoLogger.info("Redis is ready to accept commands!");
    });

    this.redis.on("error", (err) => {
      if (err.message.includes("WRONGPASS")) {
        errorLogger.error("Authentication failed: Check Redis password.");
        this.redis.disconnect(); // Disconnect after authentication failure
      } else {
        errorLogger.error(`Redis error: ${err}`);
      }
    });

    this.redis.on("close", () => {
      infoLogger.info("Redis connection is closed!");
    });
  }

  // Set a value with an optional expiration time (in seconds)
  async set(key: string, value: any, ttl?: number): Promise<void> {
    const stringValue = JSON.stringify(value);
    await this.redis.set(key, stringValue, "EX", ttl || 60);
  }

  // Get a value and parse it back to JSON
  async get<T>(key: string): Promise<T | null> {
    const result = await this.redis.get(key);
    return result ? JSON.parse(result) : null;
  }

  // Delete a key
  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }

  // Check if a key exists
  async exists(key: string): Promise<boolean> {
    const exists = await this.redis.exists(key);
    return exists > 0;
  }

  // Clear all keys (use with caution in production)
  async flushAll(): Promise<void> {
    await this.redis.flushall();
  }

  // Close Redis connection
  async quit(): Promise<void> {
    await this.redis.quit();
  }
}

// Export an instance of RedisUtility
export const redisUtility = new RedisUtility();
