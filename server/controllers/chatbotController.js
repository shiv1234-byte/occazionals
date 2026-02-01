const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini with your API Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * @desc    Get AI response for user query
 * @route   POST /api/chatbot
 */
exports.handleChat = async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ message: "Query is required" });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // SYSTEM INSTRUCTIONS: Setting the AI's personality
    const prompt = `
      You are the AI assistant for "Occazionals", a premium luxury fashion rental and sales platform based in Delhi (DTU Campus).
      
      Your rules:
      1. Be polite, professional, and helpful.
      2. Answer questions about: rental duration (usually 3 days), hygiene (5-step process), delivery (24h before event), and fashion advice.
      3. If asked about something outside of fashion or Occazionals, politely bring the conversation back.
      4. Keep answers concise (max 2-3 sentences).
      
      User Question: ${query}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ response: text });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ 
      response: "I'm having trouble connecting to my brain right now. Please try again later!" 
    });
  }
};