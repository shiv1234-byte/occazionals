require('dotenv').config();
// ... rest of your imports
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Ensure you have this file to connect to Atlas
const { errorHandler } = require('./middleware/errorMiddleware');



// Load environment variables
dotenv.config();

// Connect to Database
connectDB(); 

const app = express();

// 1. GLOBAL MIDDLEWARES
app.use(express.json()); // To parse JSON bodies
app.use(cors({
  origin: ["https://occazionals.vercel.app/"], // Apne Vercel link se replace karein
  credentials: true
}));         // To allow cross-origin requests from Vite

// 2. ROUTES
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/chatbot', require('./routes/chatbotRoutes'));

// 3. ERROR HANDLING MIDDLEWARE (Must be after routes)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
