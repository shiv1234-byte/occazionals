const express = require('express');
const router = express.Router();
const { 
  addOrderItems, 
  getMyOrders, 
  createRazorpayOrder, 
  generateInvoice,
  updateOrderStatus // Ye bhi import karna zaroori hai
} = require('../controllers/orderController');

// --- DHAYAN DEIN: Yahan admin ko bhi destructure karein ---
const { protect, admin } = require('../middleware/authMiddleware'); 

// Routes
router.post('/', protect, addOrderItems);
router.get('/myorders', protect, getMyOrders);
router.post('/razorpay', protect, createRazorpayOrder);
router.get('/:id/invoice', protect, generateInvoice);

// --- Status Update Route (Jo aapne abhi add kiya) ---
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;