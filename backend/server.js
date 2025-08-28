import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { analyzeTrades } from './tradeAnalyzer.js';

dotenv.config();
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// API route for conversational trading mentor
app.post('/api/analyze', async (req, res) => {
  const { userQuestion = "", symbols = [], watchlist = [] } = req.body;

  // Wallet is now optional, pulled from session or null
  const walletAddress = req.user?.wallet || null;

  try {
    const analysis = await analyzeTrades(walletAddress, symbols, userQuestion);
    res.json(analysis);
  } catch (err) {
    console.error("Error in /api/analyze route:", err);
    res.status(500).json({ error: "Failed to analyze trades." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
