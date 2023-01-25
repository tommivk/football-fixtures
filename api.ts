import redis from "./lib/redis";
import camelcaseKeys from "camelcase-keys";

const API_KEY = process.env.API_KEY ?? "";
const BASE_URL = "https://v3.football.api-sports.io";

export const fetchData = async (path: string, cacheTimeMinutes?: number) => {
  try {
    const cache = await redis.get(path);
    // await redis.flushall();
    // await redis.del(path);
    if (cache) {
      console.log("cached");
      return JSON.parse(cache);
    }

    console.log("no cache");

    const requestHeaders: HeadersInit = new Headers();
    requestHeaders.set("x-rapidapi-key", API_KEY);

    const response = await fetch(`${BASE_URL}${path}`, {
      headers: requestHeaders,
    });

    if (!response.ok) {
      throw new Error("Failed to fetch");
    }

    const json = await response.json();
    const data = camelcaseKeys(json.response, { deep: true });

    cacheTimeMinutes !== undefined
      ? await redis.set(path, JSON.stringify(data), "EX", 60 * cacheTimeMinutes)
      : await redis.set(path, JSON.stringify(data));

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
