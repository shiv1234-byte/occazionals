const Product = require('../models/Product');

/**
 * @desc    Get all products (Includes Category & Price Filtering)
 * @route   GET /api/products
 */
exports.getProducts = async (req, res) => {
  try {
    const { category, maxPrice, adminView, type } = req.query;
    let filter = {};

    // 1. Availability Logic (Customer view vs Admin view)
    if (adminView !== 'true') {
      filter.isAvailable = true;
    }

    // 2. Category Filter (Case-insensitive)
    if (category) {
      filter.category = { $regex: new RegExp(category, 'i') };
    }

    // 3. Price Filtering ($lte = Less than or equal to)
    if (maxPrice) {
      filter.salePrice = { $lte: Number(maxPrice) };
    }

    // 4. Backward Compatibility for Rent/Sale
    if (type === 'rent') filter.isForRent = true;
    if (type === 'sale') filter.isForSale = true;

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error("Fetch Error:", error.message);
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
    console.error("GetById Error:", error.message);
    res.status(500).json({ message: "Invalid Product ID" });
  }
};

/**
 * @desc    Add new product (Admin Only)
 * @route   POST /api/products
 */
exports.addProduct = async (req, res) => {
  try {
    const { 
      name, description, category, salePrice, 
      images, countInStock 
    } = req.body;

    console.log("Adding Jewelry with data:", req.body);

    const product = await Product.create({
      name, 
      description, 
      category, 
      salePrice: Number(salePrice), 
      rentalPrice: 0, 
      images: Array.isArray(images) ? images : [images],
      isForRent: false, 
      isForSale: true, 
      countInStock: Number(countInStock) || 1, 
      isAvailable: true 
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
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
      product.isAvailable = !product.isAvailable;
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating status" });
  }
};