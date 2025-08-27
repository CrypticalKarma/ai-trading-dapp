// backend/tradeAnalyzer.js
import OpenAI from "openai";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Function to read mock trades
function getMockTrades() {
  const filePath = path.join(process.cwd(), "mock-data", "trades.json");
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
}

// Analyze trades with ChatGPT
export async function analyzeTrades() {
  const trades = getMockTrades();

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an AI trading coach. Analyze trades and return JSON with profitability, risk_level, and advice."
        },
        {
          role: "user",
          content: JSON.stringify(trades)
        }
      ]
    });

    const insights = response.choices[0].message.content;
    return insights;
  } catch (err) {
    console.error("Error analyzing trades:", err);
    return null;
  }
}
