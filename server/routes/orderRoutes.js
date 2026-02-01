const express = require('express');
const router = express.Router();
const { 
  createRazorpayOrder, 
  verifyOrder, // <--- You need to import this
  getMyOrders 
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');


// Route to create the order with Razorpay
router.post('/pay', protect, createRazorpayOrder);

// Route to verify the payment signature and save to MongoDB
router.post('/verify', protect, verifyOrder); // <--- Add this line!

// Route to fetch user's past orders
router.get('/myorders', protect, getMyOrders);

module.exports = router;