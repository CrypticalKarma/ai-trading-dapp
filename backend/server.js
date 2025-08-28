import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { analyzeTrades } from "./tradeAnalyzer.js";
import { getConversation, addMessage } from "./memory.js";

dotenv.config();
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Conversational trading mentor route
app.post("/api/analyze", async (req, res) => {
  try {
    const userId = req.user?.id || "guest"; // Replace with session/user ID if available
    const userQuestion = req.body.userQuestion || "";

    // Add user message to memory
    addMessage(userId, "user", userQuestion);

    // Retrieve conversation history
    const history = getConversation(userId);

    // Call analyzeTrades with full conversation
    const analysis = await analyzeTrades(req.user?.wallet || null, [], history);

    // Save AI response to memory
    addMessage(userId, "assistant", analysis.result);

    res.json(analysis);
  } catch (err) {
    console.error("Error in /api/analyze route:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
