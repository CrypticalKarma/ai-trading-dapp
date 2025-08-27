import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { analyzeTrades } from './tradeAnalyzer.js';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Root route to confirm server is running
app.get('/', (req, res) => {
  res.send('AI Trading Dapp backend is running!');
});

// API route for conversational trading mentor
app.post('/api/analyze', async (req, res) => {
  const { walletAddress, symbols, userQuestion } = req.body;

  if (!walletAddress || !symbols || symbols.length === 0) {
    return res.status(400).json({ error: "walletAddress and symbols are required." });
  }

  try {
    const analysis = await analyzeTrades(walletAddress, symbols, userQuestion || "");
    res.json(analysis);
  } catch (err) {
    console.error("Error in /api/analyze route:", err);
    res.status(500).json({ error: "Failed to analyze trades." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
