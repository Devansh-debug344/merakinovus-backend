import express from "express";

const router = express.Router();

import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Get API key from .env file
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

router.post("/", async (req, res) => {
  try {
    const { query } = req.body;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent(query);
    const response = await result.response;
    const text = await response.text();

    res.status(200).json({ message: text });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
