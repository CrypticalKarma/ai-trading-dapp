import express from "express";
import { getPortfolio, analyzePortfolio } from "../controllers/walletController.js";

const router = express.Router();

// Routes
router.get("/portfolio/:walletAddress", getPortfolio);
router.get("/analysis/:walletAddress", analyzePortfolio);

export default router;
