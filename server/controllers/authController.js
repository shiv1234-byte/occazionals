const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const twilio = require('twilio');

// Twilio Initialize
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// --- 1. SEND OTP ---
exports.sendOTP = async (req, res) => {
  try {
    const { phone } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Ensure .env has TWILIO_WHATSAPP_NUMBER without 'whatsapp:' prefix if you add it here
    await client.messages.create({
      body: `Your Occasionals Jewels verification code is: ${otp}`,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:+91${phone}` 
    });

    res.status(200).json({ success: true, otpHash: otp });
  } catch (error) {
    console.error("Twilio Error:", error.message);
    res.status(500).json({ success: false, message: "OTP send nahi ho paya" });
  }
};

// --- 2. REGISTER ---
exports.register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    
    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ email }, { phone }] });
    if (userExists) return res.status(400).json({ success: false, message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, phone, password: hashedPassword });
    
    res.status(201).json({ success: true, message: "User registered!" });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// --- 3. LOGIN (Fixed for Button Issue) ---
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

      // Yeh response frontend ke 'login' function ko milna zaroori hai
      res.json({ 
        success: true, 
        token, 
        user: { 
          id: user._id,
          name: user.name, 
          email: user.email,
          phone: user.phone,
          addresses: user.addresses || [], // Ensure addresses are sent
          isAdmin: user.isAdmin 
        } 
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// --- 4. ADD ADDRESS (Profile Page ke liye) ---
exports.addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.addresses.push(req.body);
    await user.save();
    res.status(200).json({ success: true, addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// --- 5. INITIAL ADDRESS (Signup Step 3 ke liye) ---
exports.addInitialAddress = async (req, res) => {
  try {
    const { email, address } = req.body;
    const user = await User.findOne({ email });
    
    if (user) {
      user.addresses.push(address);
      await user.save();
      res.status(200).json({ success: true, message: "Address added successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};