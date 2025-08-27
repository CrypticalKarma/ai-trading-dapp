// backend/server.js
import express from "express";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

// Check if the API key is loaded
console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY);

import walletRoutes from "../frontend/src/routes/wallet.js";
import { analyzeTrades } from "./tradeAnalyzer.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Root endpoint
app.get("/", (req, res) => {
  res.send("AI Trading DApp Backend is running!");
});

// Wallet routes
app.use("/wallet", walletRoutes);

// AI Trade Analysis endpoint
app.get("/api/analyze", async (req, res) => {
  try {
    const insights = await analyzeTrades();
    res.json({ insights });
  } catch (err) {
    console.error("Error in /api/analyze:", err);
    res.status(500).json({ error: "Failed to analyze trades" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
