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
  const { walletAddress, symbols = [], userQuestion = "", watchlist = [] } = req.body;

  if (!walletAddress) {
    return res.status(400).json({ error: "walletAddress is required." });
  }

  try {
    const analysis = await analyzeTrades(walletAddress, symbols, userQuestion, watchlist);
    res.json(analysis);
  } catch (err) {
    console.error("Error in /api/analyze route:", err);
    res.status(500).json({ error: "Failed to analyze trades." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
