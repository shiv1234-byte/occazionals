const express = require('express');
const router = express.Router();
// ✅ Saare functions ko destructure karke import karein
const { 
    register, 
    login, 
    sendOTP, 
    addAddress, 
    forgotPassword, 
    resetPassword, 
    addInitialAddress 
} = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');

// --- 1. Authentication Routes ---
router.post('/register', register);
router.post('/login', login);
router.post('/send-otp', sendOTP); 

// --- 2. Password Recovery (Email OTP) ---
// Inhe add karna zaroori hai Forgot Password feature ke liye
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// --- 3. Address Management ---
// Signup ke Step 3 ke liye (Bina token ke kaam karega email base par)
router.post('/add-initial-address', addInitialAddress);

// Profile page par naya address add karne ke liye (Token zaroori hai)
router.post('/add-address', protect, addAddress);

module.exports = router;