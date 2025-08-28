import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { analyzeTrades } from './tradeAnalyzer.js';

dotenv.config();
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// In-memory user sessions
const userSessions = new Map();

function getUserSession(walletAddress) {
  if (!userSessions.has(walletAddress)) {
    userSessions.set(walletAddress, {
      history: [],
    });
  }
  return userSessions.get(walletAddress);
}

app.post('/api/analyze', async (req, res) => {
  try {
    const userQuestion = req.body.userQuestion || "";
    const walletAddress = req.body.wallet || "guest";

    const session = getUserSession(walletAddress);

    // Build messages array for AI with chat history
    const messages = session.history.map(h => [
      { role: "user", content: h.user },
      { role: "assistant", content: h.ai }
    ]).flat();

    messages.push({ role: "user", content: userQuestion });

    const analysis = await analyzeTrades(walletAddress, [], messages);

    // Save to history
    session.history.push({ user: userQuestion, ai: analysis.result });

    res.json({ result: analysis.result, memory: session });
  } catch (err) {
    console.error("Error in /api/analyze:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
