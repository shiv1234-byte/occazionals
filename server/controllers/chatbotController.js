const { GoogleGenerativeAI } = require("@google/generative-ai");
const Product = require("../models/productModel");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.handleChat = async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ message: "Query required" });

  try {
    // 1. Database se real data uthao
    const products = await Product.find({}, "name availability price category");
    
    const inventory = products.length > 0 
      ? products.map(p => `${p.name}: ${p.availability ? 'In Stock' : 'Booked'}, Price: ₹${p.price}`).join(" | ")
      : "No items found in database.";

      console.log("DEBUG INVENTORY DATA:", inventory);

    // 2. Temperature 0.0 rakhein taaki AI apni 'fabulous' baatein na kare
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: { 
        maxOutputTokens: 40, 
        temperature: 0.0, // Creativity zero kar di
        topP: 0.1 
      } 
    });

    // 3. Strict Command Prompt
    const prompt = `
      COMMAND: You are a database query assistant for Occazionals. 
      DATA: ${inventory}
      
      RULES:
      - Answer ONLY using the DATA provided above.
      - DO NOT use the words "Fabulous", "Occasional", "Shine", or "Exquisite".
      - DO NOT give price ranges like 8000-25000 if they are not in the DATA.
      - Answer in maximum 10 words.
      - If user asks for price, look at the DATA and give the exact price.

      User Query: ${query}
      Assistant Answer:`;

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();

    res.status(200).json({ response: text });
  } catch (error) {
    console.error("Chat Error:", error);
    res.status(500).json({ response: "Error: Database not responding." });
  }
};