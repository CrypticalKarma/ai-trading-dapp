// backend/wallet/zerionClient.js
import fetch from 'node-fetch';

const ZERION_API_BASE = 'https://api.zerion.io/v1'; // placeholder
let API_KEY = process.env.ZERION_API_KEY || '';

export function setApiKey(key) {
  API_KEY = key;
}

// Fetch all trades for a given wallet
export async function getWalletTrades(walletAddress) {
  if (!API_KEY) throw new Error('Zerion API key not set');

  // Placeholder for actual Zerion call
  // Later replace with real API endpoint
  return [
    { symbol: 'BTCUSDT', action: 'BUY', quantity: 0.01, price: 30000, date: '2025-08-27' },
    { symbol: 'ETHUSDT', action: 'BUY', quantity: 0.2, price: 1800, date: '2025-08-27' },
    { symbol: 'BTCUSDT', action: 'SELL', quantity: 0.005, price: 31000, date: '2025-08-28' }
  ];
}

// Fetch wallet holdings
export async function getWalletHoldings(walletAddress) {
  if (!API_KEY) throw new Error('Zerion API key not set');

  // Placeholder data
  return [
    { symbol: 'BTCUSDT', quantity: 0.005 },
    { symbol: 'ETHUSDT', quantity: 0.2 },
    { symbol: 'SOLUSDT', quantity: 10 }
  ];
}
