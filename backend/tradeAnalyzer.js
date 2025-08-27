import dotenv from 'dotenv';
dotenv.config();
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Mock trades data
const mockTrades = [
  { symbol: "BTCUSDT", action: "BUY", quantity: 0.01, price: 30000, date: "2025-08-25" },
  { symbol: "ETHUSDT", action: "BUY", quantity: 0.2, price: 1800, date: "2025-08-26" },
  { symbol: "BTCUSDT", action: "SELL", quantity: 0.005, price: 31000, date: "2025-08-27" }
];

// Mock watchlist
const mockWatchlist = ["BTCUSDT", "ETHUSDT", "SOLUSDT"];

export async function analyzeTrades(walletAddress, symbols, userQuestion) {
  // Filter mock trades to only include requested symbols
  const tradesToAnalyze = mockTrades.filter(trade => symbols.includes(trade.symbol));

  console.log("Loaded trades:", tradesToAnalyze);

  if (!tradesToAnalyze || tradesToAnalyze.length === 0) {
    return { message: "No trades found for the selected symbols. Let's start analyzing once you have trades!" };
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      messages: [
        {
          role: "system",
          content: "You are a trading mentor AI. Be conversational, explain why certain patterns might happen, teach the user, answer questions, and review trades."
        },
        {
          role: "user",
          content: JSON.stringify({
            walletAddress,
            trades: tradesToAnalyze,
            watchlist: mockWatchlist,
            userQuestion
          })
        }
      ]
    });

    const insights = response.choices[0]?.message?.content;

    if (!insights) {
      return { message: "AI did not return insights, but your mock trades loaded correctly." };
    }

    return { message: insights };

  } catch (err) {
    console.error("Error calling OpenAI API:", err);
    return { message: "Failed to analyze trades. Using mock conversational response.", error: err.message };
  }
}
