import { createClient } from "redis";
import { REDIS_URL } from "./config.js";

const redisClient = createClient({
  url: REDIS_URL, 
});

redisClient.on("error", (err) => console.log("Redis error", err));

const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("🔴 Conectado a Redis");
  } catch (error) {
    console.error("Error conectando a Redis:", error);
  }
};

connectRedis();

export default redisClient;
