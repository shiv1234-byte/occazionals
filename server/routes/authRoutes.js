const express = require('express');
const router = express.Router();
const { register, login, sendOTP, addAddress } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);

// Ye wali line zaroori hai
router.post('/send-otp', sendOTP); 

// Address ke liye
router.post('/add-address', protect, addAddress);

module.exports = router;