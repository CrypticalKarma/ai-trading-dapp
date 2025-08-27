import OpenAI from "openai";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

console.log("Loaded OPENAI_API_KEY:", process.env.OPENAI_API_KEY);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Function to read mock trades
function getMockTrades() {
  const filePath = path.join(process.cwd(), "mock-data", "trades.json");
  if (!fs.existsSync(filePath)) {
    console.error("Trades file not found:", filePath);
    return [];
  }
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
}

// Analyze trades with ChatGPT
export async function analyzeTrades() {
  const trades = getMockTrades();
  if (trades.length === 0) return "No trades found";

  try {
    console.log("Sending trades to OpenAI:", trades);
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an AI trading coach. Analyze trades and return JSON with profitability, risk_level, and advice."
        },
        {
          role: "user",
          content: JSON.stringify(trades)
        }
      ]
    });

    console.log("OpenAI response object:", response);
    const insights = response.choices?.[0]?.message?.content;
    console.log("Insights:", insights);
    return insights || "No insights returned";
  } catch (err) {
    console.error("OpenAI call failed:", err);
    throw err; // throw so server can see exact error
  }
}
