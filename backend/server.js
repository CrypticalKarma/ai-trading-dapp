import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { analyzeTrades } from './tradeAnalyzer.js';

dotenv.config();
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Conversational trading mentor route
app.post('/api/analyze', async (req, res) => {
  try {
    const userQuestion = req.body.userQuestion || "";

    // Optional wallet pulled from session/onboarding
    const walletAddress = req.user?.wallet || null;

    // Optional symbols (can be empty)
    const symbols = req.body.symbols || [];

    // Only call analyzeTrades; it handles empty wallet gracefully
    const analysis = await analyzeTrades(walletAddress, symbols, userQuestion);

    res.json(analysis);
  } catch (err) {
    console.error("Error in /api/analyze route:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
