import dotenv from "dotenv";
import OpenAI from "openai";
import { getWalletTrades, getWalletHoldings } from "./wallet/zerionClient.js";

dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Analyze trades with conversational memory.
 * @param {string|null} walletAddress - optional wallet address
 * @param {Array} symbols - optional symbols filter
 * @param {string} userQuestion - latest user question
 * @param {Object} session - user session object containing history, goals, etc.
 */
export async function analyzeTrades(walletAddress = null, symbols = [], userQuestion = "", session = {}) {
  let trades = [];
  let holdings = [];

  // Only fetch wallet data if available
  if (walletAddress && walletAddress !== "guest") {
    try {
      trades = await getWalletTrades(walletAddress);
      holdings = await getWalletHoldings(walletAddress);
    } catch (err) {
      console.warn("Error fetching wallet data:", err);
      trades = [];
      holdings = [];
    }
  }

  // Filter trades if symbols provided
  const filteredTrades = trades.length > 0 && symbols.length > 0
    ? trades.filter(trade => symbols.includes(trade.symbol.replace('USDT', '')))
    : trades;

  // Build system prompt
  const systemMessage = {
    role: "system",
    content: `
You are a friendly trading mentor AI.
- Address the user by name if available.
- Speak naturally, one question at a time.
- Reference previous answers from the session memory.
- Reflect on user's goals, emotions, and trading style.
- Use trades and holdings only if available.
- Keep explanations concise, educational, and supportive.
User trades: ${JSON.stringify(filteredTrades)}
User holdings: ${JSON.stringify(holdings)}
Session memory: ${JSON.stringify(session)}
`
  };

  // Build chat messages array: system + previous history + latest user question
  const chatMessages = [systemMessage];

  if (session.history && session.history.length > 0) {
    // Convert past session history into AI messages
    session.history.forEach(entry => {
      if (entry.user) chatMessages.push({ role: "user", content: entry.user });
      if (entry.ai?.result) chatMessages.push({ role: "assistant", content: entry.ai.result });
    });
  }

  // Add latest user question
  chatMessages.push({ role: "user", content: userQuestion });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: chatMessages
    });

    const mentorReply = response.choices[0]?.message?.content || "No response from AI.";
    return { result: mentorReply };
  } catch (err) {
    console.error("Error calling OpenAI API:", err);
    return { result: "AI could not generate a response.", details: err.message };
  }
}
