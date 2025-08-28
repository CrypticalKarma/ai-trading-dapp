import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { analyzeTrades } from './tradeAnalyzer.js';

dotenv.config();
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Simple in-memory store for user sessions (per wallet)
const userSessions = new Map();

function getUserSession(walletAddress) {
  if (!userSessions.has(walletAddress)) {
    userSessions.set(walletAddress, {
      goals: null,
      riskTolerance: null,
      lastTopic: null,
      history: [],
    });
  }
  return userSessions.get(walletAddress);
}

app.post('/api/analyze', async (req, res) => {
  try {
    const userQuestion = req.body.userQuestion || "";
    const walletAddress = req.body.wallet || "guest"; // default to "guest" if not logged in
    const symbols = req.body.symbols || [];

    // Get or create session
    const session = getUserSession(walletAddress);

    // Call analyzer with memory
    const analysis = await analyzeTrades(walletAddress, symbols, userQuestion, session);

    // Save conversation history
    session.history.push({ user: userQuestion, ai: analysis });

    res.json({
      response: analysis,
      memory: session,
    });
  } catch (err) {
    console.error("Error in /api/analyze route:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
