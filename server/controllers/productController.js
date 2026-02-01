const Product = require('../models/Product');

/**
 * @desc    Get all products (Filter: only show available to customers)
 * @route   GET /api/products
 */
exports.getProducts = async (req, res) => {
  try {
    const { type, adminView } = req.query;

    let filter = {};

    // Logic: If not adminView, hide explicitly unavailable items
    if (adminView !== 'true') {
      filter.isAvailable = { $ne: false }; 
    }

    if (type === 'rent') filter.isForRent = true;
    if (type === 'sale') filter.isForSale = true;

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server Error fetching products" });
  }
};

/**
 * @desc    Get single product by ID
 * @route   GET /api/products/:id
 */
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Invalid Product ID" });
  }
};

/**
 * @desc    Add new product (Admin Only)
 * @route   POST /api/products
 */
exports.addProduct = async (req, res) => {
  try {
    // Destructure all fields from req.body
    const { 
      name, description, category, salePrice, 
      rentalPrice, images, sizes, isForRent, isForSale, countInStock 
    } = req.body;

    // Validation Check: Log body to terminal to debug if something is missing
    console.log("Adding Product with data:", req.body);

    const product = await Product.create({
      name, 
      description, 
      category, 
      // Force conversion to Numbers to avoid Mongoose validation errors
      salePrice: Number(salePrice), 
      rentalPrice: Number(rentalPrice), 
      // Ensure these are arrays (AdminDashboard split them, but we double-check)
      images: Array.isArray(images) ? images : [images],
      sizes: Array.isArray(sizes) ? sizes : [sizes], 
      isForRent: isForRent || Number(rentalPrice) > 0, 
      isForSale: isForSale || Number(salePrice) > 0, 
      countInStock: Number(countInStock) || 1, 
      isAvailable: true 
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    // This console log will show you EXACTLY which field failed in your VS Code terminal
    console.error("Mongoose Validation Error:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete a product (Admin Only)
 * @route   DELETE /api/products/:id
 */
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (product) {
      res.json({ message: 'Product removed successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting product" });
  }
};

/**
 * @desc    Toggle Product Availability (Admin Only)
 * @route   PATCH /api/products/:id/status
 */
exports.toggleProductStatus = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (product) {
      // Toggle logic
      product.isAvailable = product.isAvailable === false ? true : false;
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating status" });
  }
};