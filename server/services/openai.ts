import OpenAI from "openai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  throw new Error("OPENAI_API_KEY environment variable is not set");
}
const openai = new OpenAI({ apiKey });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface CachedPrice {
  price: number;
  timestamp: number;
}

const CACHE_FILE = path.join(__dirname, "../cache/fuel-prices.json");

// Ensure cache directory exists with proper permissions
if (!fs.existsSync(path.dirname(CACHE_FILE))) {
  fs.mkdirSync(path.dirname(CACHE_FILE), { recursive: true, mode: 0o777 });
}

let memoryCache: Record<string, CachedPrice> = {};

function loadCache(): Record<string, CachedPrice> {
  try {
    console.log("Memory cache state:", memoryCache);

    // First check memory cache
    if (Object.keys(memoryCache).length > 0) {
      console.log("Using memory cache");
      return memoryCache;
    }

    // Then check file cache
    if (fs.existsSync(CACHE_FILE)) {
      console.log("Loading from file cache");
      const cache = JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));
      console.log("File cache contents:", cache);
      memoryCache = cache; // Update memory cache
      return cache;
    }

    console.log("No cache found");
  } catch (error) {
    console.error("Error loading cache:", error);
  }
  return {};
}

function saveCache(cache: Record<string, CachedPrice>): void {
  try {
    memoryCache = cache; // Update memory cache
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), {
      mode: 0o666,
    });
  } catch (error) {
    console.error("Error saving cache:", error);
  }
}

function isValidCache(cache: CachedPrice, targetMonth: Date): boolean {
  if (!cache) return false;

  // Compare the cache key format (e.g. "January-2025") instead of timestamp
  const monthName = targetMonth.toLocaleString("en-US", { month: "long" });
  const year = targetMonth.getFullYear();
  const cacheKey = `${monthName}-${year}`;

  return memoryCache[cacheKey] && memoryCache[cacheKey].price === cache.price;
}

interface VLSFOPrice {
  price: number | null;
  month: string;
  year: number;
  isError: boolean;
  errorMessage?: string;
}

export async function getVLSFOPrice(): Promise<VLSFOPrice> {
  const currentDate = new Date();
  const previousMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 1,
  );
  const monthName = previousMonth.toLocaleString("en-US", { month: "long" });
  const year = previousMonth.getFullYear();

  return {
    price: 556.5, // Updated price here
    month: monthName,
    year: year,
    isError: false,
  };
}
