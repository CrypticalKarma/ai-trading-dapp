import express from "express";
import dotenv from "dotenv";
import walletRoutes from "./src/routes/wallet.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Root endpoint
app.get("/", (req, res) => {
  res.send("AI Trading DApp Backend is running!");
});

// Wallet routes
app.use("/wallet", walletRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
