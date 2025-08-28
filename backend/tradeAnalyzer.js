// backend/tradeAnalyzer.js
import dotenv from 'dotenv';
dotenv.config();
import OpenAI from 'openai';
import { getWalletTrades, getWalletHoldings } from './wallet/zerionClient.js';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function analyzeTrades(walletAddress, symbols = [], userQuestion = "") {
  let trades = [];
  let holdings = [];

  try {
    trades = await getWalletTrades(walletAddress);
    holdings = await getWalletHoldings(walletAddress);
  } catch (err) {
    console.warn("Zerion API not set or failed, using mock data.", err);

    // Mock fallback data
    trades = [
      { symbol: 'BTCUSDT', action: 'BUY', quantity: 0.01, price: 30000, date: '2025-08-27' },
      { symbol: 'ETHUSDT', action: 'BUY', quantity: 0.2, price: 1800, date: '2025-08-27' },
      { symbol: 'BTCUSDT', action: 'SELL', quantity: 0.005, price: 31000, date: '2025-08-28' }
    ];

    holdings = [
      { symbol: 'BTCUSDT', quantity: 0.005 },
      { symbol: 'ETHUSDT', quantity: 0.2 },
      { symbol: 'SOLUSDT', quantity: 10 }
    ];
  }

  // Filter trades if symbols provided
  const filteredTrades = symbols.length > 0
    ? trades.filter(trade => symbols.includes(trade.symbol.replace('USDT', '')))
    : trades;

  if (filteredTrades.length === 0) {
    return { result: "No trades found for the selected symbols." };
  }

  const prompt = `
You are an AI trading mentor with a therapeutic approach. 
- Always prioritize the user's question before adding extra commentary. ${userQuestion}
- Guide the user through their trading strategy and decisions, encouraging self-reflection.
- Use trades and holdings to understand style (swing, day, long-term), only highlight past trades when necessary.
- Explain why trades may be good/risky, discuss market context, technical analysis, psychology.
- Encourage critical thinking; ask thought-provoking questions when it helps the user learn, but only when relevant.
- Include insights from the user's watchlist if available.
- Keep your tone supportive, conversational, educational, and reflective.
User trades: ${JSON.stringify(filteredTrades)}
User holdings: ${JSON.stringify(holdings)}
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      messages: [{ role: "user", content: prompt }]
    });

    const mentorReply = response.choices[0]?.message?.content || "No response from AI.";
    return { result: mentorReply };
  } catch (err) {
    console.error("Error calling OpenAI API:", err);
    return { result: "Error analyzing trades.", details: err.message };
  }
}
