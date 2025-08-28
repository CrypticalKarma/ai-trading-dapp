// backend/wallet/zerionClient.js
import fetch from "node-fetch";

const ZERION_API_BASE = "https://api.zerion.io/v1"; 
let API_KEY = process.env.ZERION_API_KEY || "";

// Simple in-memory cache
const cache = {}; 

function setApiKey(key) {
  API_KEY = key;
}

// Core fetch helper
async function fetchFromZerion(endpoint) {
  const url = `${ZERION_API_BASE}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Basic ${Buffer.from(API_KEY + ":").toString("base64")}`,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Zerion API error: ${text}`);
  }

  return response.json();
}

// Cache wrapper
async function fetchWithCache(key, endpoint, ttl = 30000) {
  const now = Date.now();

  if (cache[key] && now - cache[key].timestamp < ttl) {
    return cache[key].data;
  }

  const data = await fetchFromZerion(endpoint);
  cache[key] = { data, timestamp: now };
  return data;
}

// Get wallet trades
export async function getWalletTrades(address) {
  return fetchWithCache(
    `trades-${address}`,
    `/wallets/${address}/trades?page[size]=10`,
    30000 // 30 sec cache
  );
}

// Get wallet holdings
export async function getWalletHoldings(address) {
  return fetchWithCache(
    `holdings-${address}`,
    `/wallets/${address}/positions`,
    60000 // 1 min cache
  );
}

export { setApiKey };
