import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL ?? "");
redis.on("error", (error) => console.log("Redis client error:", error));

export default redis;
