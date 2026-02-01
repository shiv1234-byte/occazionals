const express = require('express');
const router = express.Router();

// Combine all your controller functions into one single import block
const { 
  getProducts, 
  getProductById, 
  addProduct, // If this is for adding products
  deleteProduct, 
  toggleProductStatus 
} = require('../controllers/productController');

// Import middleware once
const { protect, admin } = require('../middleware/authMiddleware'); 

// --- PUBLIC ROUTES ---
router.get('/', getProducts);
router.get('/:id', getProductById);

// --- ADMIN ROUTES ---
// Only logged-in Admins can perform these actions
router.post('/', protect, admin, addProduct); // Ensure addProduct is exported in controller
router.delete('/:id', protect, admin, deleteProduct);
router.patch('/:id/status', protect, admin, toggleProductStatus);

module.exports = router;