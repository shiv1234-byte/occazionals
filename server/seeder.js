const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product'); // Ensure this matches your filename
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const products = [
  {
    name: "Royal Velvet Saree",
    category: "Ethnic Wear",
    images: ["https://images.unsplash.com/photo-1583391733956-6c78276477e2?q=80&w=1000"],
    rentalPrice: 1500,
    salePrice: 12000,
    sizes: ["S", "M", "L"],
    description: "A premium royal velvet saree perfect for winter weddings.",
    countInStock: 5
  },
  {
    name: "Emerald Lehenga Choli",
    category: "Bridal",
    images: ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000"],
    rentalPrice: 4500,
    salePrice: 35000,
    sizes: ["M", "L", "XL"],
    description: "Deep emerald green lehenga with intricate gold zari work.",
    countInStock: 3
  },
  {
    name: "Modern Silk Gown",
    category: "Western",
    images: ["https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1000"],
    rentalPrice: 2000,
    salePrice: 15000,
    sizes: ["S", "M"],
    description: "Elegant silk gown for cocktail parties and formal events.",
    countInStock: 8
  }
];

const importData = async () => {
  try {
    await Product.deleteMany(); // Clears existing products to avoid duplicates
    await Product.insertMany(products);
    console.log('✅ Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

importData();