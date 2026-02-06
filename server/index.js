require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

// Connect to Database
connectDB(); 

const app = express();

// 1. CORS CONFIGURATION (Sabse Pehle)
// Isse browser ko permission milti hai data lene ki
app.use(cors({
  origin: [
    "https://occazionals.vercel.app", 
    "http://localhost:5173", 
    "http://localhost:3000"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// 2. BODY PARSERS (CORS ke Niche)
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// 3. ROUTES
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/chatbot', require('./routes/chatbotRoutes'));

// 4. ERROR HANDLING (Sabse Aakhri Mein)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
