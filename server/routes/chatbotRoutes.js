const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/', async (req, res) => {
  const { query } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.json({ response: "API Key is missing in your .env file." });
  }

  // ✅ CORRECT: v1 + gemini-1.5-flash
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  try {
    const response = await axios.post(
      url,
      {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `You are Occazi-Bot, the luxury fashion assistant for Occazionals.
Context: We rent luxury dresses in Delhi.
User Question: ${query}`
              }
            ]
          }
        ]
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    const botText =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!botText) {
      throw new Error("Unexpected Gemini response format");
    }

    res.json({ response: botText });

  } catch (err) {
    console.error("FINAL DEBUG LOG:", err.response?.data || err.message);
    res.json({
      response:
        "I'm currently updating my catalog. We offer premium 3-day rentals for designer wear. How else can I help?"
    });
  }
});

module.exports = router;
