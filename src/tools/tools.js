import Redis from "ioredis";
import {
  logSuccess,
  logWarning,
  logError,
  logInfo,
  log
} from "../cli/logger.js";

let redis = null;

export async function initRedis(port = 12000) {
  if (redis) return redis;

  redis = new Redis({
    host: "127.0.0.1",
    port,
    lazyConnect: true
  });

  try {
    await redis.connect();
    logSuccess(`Connected to Redis at 127.0.0.1:${port}`);
  } catch (err) {
    logError(`Failed to connect to Redis at 127.0.0.1:${port}`);
    logInfo("Make sure you have already run:");
    log("  -> docker compose up -d");
    log("  -> Or that Redis is running manually");
    process.exit(1);
  }

  return redis;
}

export async function listKeys() {
  const keys = await redis.keys("*");

  if (!keys.length) {
    logWarning("No keys found in Redis");
  } else {
    logSuccess("Keys in Redis:");
    keys.forEach(k => log(` - ${k}`));
  }

  process.exit(0);
}

export async function getKey(key) {
  const value = await redis.get(key);

  if (!value) {
    logWarning("Key not found");
  } else {
    try {
      const parsed = JSON.parse(value);
      logSuccess(`${key}:`);
      log(JSON.stringify(parsed, null, 2));
    } catch (err) {
      logSuccess(`${key}: ${value}`);
    }
  }

  process.exit(0);
}

export async function deleteKey(key) {
  const result = await redis.del(key);

  if (result === 0) {
    logWarning("Key not found");
  } else {
    logSuccess("Key deleted successfully");
  }

  process.exit(0);
}

export async function flushAll() {
  await redis.flushall();
  logWarning("All keys have been deleted");
  process.exit(0);
}
