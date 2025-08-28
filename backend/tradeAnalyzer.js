import dotenv from "dotenv";
import OpenAI from "openai";
import { getWalletTrades, getWalletHoldings } from "./wallet/zerionClient.js";

dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function analyzeTrades(walletAddress = null, symbols = [], messages = []) {
  let trades = [];
  let holdings = [];

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

  // System message for context
  const systemMessage = {
    role: "system",
    content: `
You are a trading mentor who speaks like a friendly coach.
- Address the user by name if known.
- Ask one question at a time; do not overload the user.
- Reference past answers if available.
- Reflect on the user's goals, emotions, and learning style.
- Use trades and holdings only if available.
- Keep explanations short and digestible.
User trades: ${JSON.stringify(trades)}
User holdings: ${JSON.stringify(holdings)}
`
  };

  const chatMessages = [systemMessage, ...messages];

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
