import dotenv from "dotenv";
import OpenAI from "openai";
import { getWalletTrades, getWalletHoldings } from "./wallet/zerionClient.js";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Analyze trades and act as a trading mentor with memory
 * @param {string|null} walletAddress - User's wallet address (optional)
 * @param {string[]} symbols - Array of token symbols to focus on
 * @param {Array} messages - Chat history [{ role: "user"|"assistant"|"system", content: string }]
 * @returns {Promise<{result: string, error?: string}>}
 */
export async function analyzeTrades(walletAddress = null, symbols = [], messages = []) {
  let trades = [];
  let holdings = [];

  // Try to fetch wallet data if wallet provided
  if (walletAddress) {
    try {
      trades = await getWalletTrades(walletAddress);
      holdings = await getWalletHoldings(walletAddress);
    } catch (err) {
      console.warn("Error fetching wallet data:", err.message);
      trades = [];
      holdings = [];
    }
  }

  // Core system instructions (mentor personality + memory cues)
  const systemMessage = {
    role: "system",
    content: `
You are a trading mentor who speaks like a friendly, human coach.
Guidelines:
- Address the user by name if it was shared in previous chats.
- Speak naturally, encouragingly, and with empathy.
- Ask only ONE thoughtful question at a time.
- Use details from past messages when helpful.
- Reference the user’s goals, style, or emotions if they’ve shared them.
- Use wallet trades/holdings if available, but don’t overwhelm with data.
- Keep responses short, clear, and conversational.
User trades: ${JSON.stringify(trades)}
User holdings: ${JSON.stringify(holdings)}
Symbols of focus: ${JSON.stringify(symbols)}
`
  };

  // Merge system message with prior conversation
  const chatMessages = [systemMessage, ...messages];

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: chatMessages,
      temperature: 0.7, // keep it natural + creative
      max_tokens: 500   // keep replies concise
    });

    const mentorReply = response.choices?.[0]?.message?.content?.trim() || 
      "I'm here and ready to guide you — what’s on your mind?";

    return { result: mentorReply };
  } catch (err) {
    console.error("Error calling OpenAI API:", err);
    return {
      result: "I wasn’t able to generate a response this time, but let’s try again.",
      error: err.message
    };
  }
}
