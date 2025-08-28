import dotenv from "dotenv";
import OpenAI from "openai";
import { getWalletTrades, getWalletHoldings } from "./wallet/zerionClient.js";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function analyzeTrades(walletAddress = null, symbols = [], userQuestion = "") {
  let trades = [];
  let holdings = [];

  if (walletAddress) {
    try {
      trades = await getWalletTrades(walletAddress);
      holdings = await getWalletHoldings(walletAddress);
    } catch (err) {
      console.warn("Error fetching wallet data:", err);
      trades = [];
      holdings = [];
    }
  }

  const filteredTrades = trades.length > 0 && symbols.length > 0
    ? trades.filter(trade => symbols.includes(trade.symbol.replace('USDT', '')))
    : trades;

  const prompt = `
You are an AI trading mentor with a therapeutic approach.
- The user may have no trades or holdings yet. Focus on guiding them step by step.
- Always prioritize the user's question before adding extra commentary.
- Ask **only one question at a time** to keep the conversation manageable.
- Wait for the user's answer before giving more guidance.
- Keep your tone supportive, conversational, and reflective.
User trades: ${JSON.stringify(filteredTrades)}
User holdings: ${JSON.stringify(holdings)}
User input: ${userQuestion}
`;


  console.log("Prompt being sent to OpenAI:", prompt);

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }]
    });

    console.log("OpenAI response:", response);

    const mentorReply = response.choices[0]?.message?.content || "No response from AI.";
    return { result: mentorReply };
  } catch (err) {
    console.error("Error calling OpenAI API:", err);
    return { result: "AI could not generate a response.", details: err.message };
  }
}
