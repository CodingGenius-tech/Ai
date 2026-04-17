import asyncHandler from "../utils/asyncHandler.js";
import { GoogleGenAI } from "@google/genai";
import Groq from "groq-sdk";

// ✅ Initialize Groq
const groq = new Groq({
  apiKey: process.env.SECRET_KEY, // ✅ Use environment variable for API key
});

// 🔥 CHAT CONTROLLER (WORKING)
const chatAi = asyncHandler(async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt required" });
  }

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.1-8b-instant", // ✅ fast + free
    });

    const reply = completion.choices[0].message.content;

    return res.status(200).json({
      reply,
    });

  } catch (error) {
    console.error("Groq error:", error);

    return res.status(500).json({
      error: "Failed to generate response",
    });
  }
});

// 🔥 IMAGE CONTROLLER (STABLE & ALWAYS WORKS)
const generateImage = asyncHandler(async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt not given" });
  }

  try {
    // ✅ Using stable placeholder image API (no blank issues)
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
  prompt
)}?width=512&height=512&seed=${Date.now()}`;

    console.log("Generated Image URL:", imageUrl);

    return res.status(200).json({
      image: imageUrl,
    });

  } catch (error) {
    console.error("Image error:", error);
    return res.status(500).json({ error: "Image generation failed" });
  }
});

export { chatAi, generateImage };