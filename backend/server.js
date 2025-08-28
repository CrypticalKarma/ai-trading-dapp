import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { analyzeTrades } from './tradeAnalyzer.js';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// In-memory conversation store
const conversations = {}; // { userId: [ { role, text }, ... ] }

// Middleware to assign a session/user ID
app.use((req, res, next) => {
  if (!req.headers['x-user-id']) {
    req.userId = uuidv4(); // assign new ID if none provided
  } else {
    req.userId = req.headers['x-user-id'];
  }
  next();
});

// Conversational trading mentor route
app.post('/api/analyze', async (req, res) => {
  const userId = req.userId;
  const userQuestion = req.body.userQuestion || "";

  // Initialize conversation for user if needed
  if (!conversations[userId]) conversations[userId] = [];

  // Add user message to conversation
  conversations[userId].push({ role: "user", text: userQuestion });

  try {
    // Send entire conversation to AI
    const analysis = await analyzeTrades(null, [], conversations[userId]);

    // Add AI response to conversation
    conversations[userId].push({ role: "assistant", text: analysis.result });

    res.json({ result: analysis.result, userId });
  } catch (err) {
    console.error("Error in /api/analyze route:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
