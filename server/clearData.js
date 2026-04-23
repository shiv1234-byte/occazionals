const mongoose = require('mongoose');
const Product = require('./models/Product'); // Apna model path check karein
require('dotenv').config();

const clearDatabase = async () => {
  try {
    // 1. Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/Occazionals');
    console.log("Connected to MongoDB...");

    // 2. Delete All Products
    const result = await Product.deleteMany({}); 
    console.log(`${result.deletedCount} dresses removed from database.`);

    // 3. Close Connection
    mongoose.connection.close();
    process.exit();
  } catch (error) {
    console.error("Error clearing database:", error);
    process.exit(1);
  }
};

clearDatabase();