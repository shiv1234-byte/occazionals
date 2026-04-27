const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendOTPWithoutDLT = require('../utils/otpService');
const nodemailer = require('nodemailer');

// --- 1. SEND OTP (For Signup - Background Process) ---
exports.sendOTP = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ success: false, message: "Phone required" });

    const otp = Math.floor(1000 + Math.random() * 9000);

    // ⚡ Response turant bhej do taaki timeout na ho
    res.status(200).json({ 
      success: true, 
      message: "OTP process started!", 
      otpValue: otp 
    });

    // ⚡ SMS background mein bhejo
    sendOTPWithoutDLT(phone, otp).catch(err => console.log("Background SMS Error:", err.message));

  } catch (error) {
    if (!res.headersSent) res.status(500).json({ success: false, message: error.message });
  }
};

// --- 2. REGISTER ---
exports.register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const userExists = await User.findOne({ $or: [{ email }, { phone }] });
    if (userExists) return res.status(400).json({ success: false, message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, phone, password: hashedPassword });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({ success: true, token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// --- 3. LOGIN ---
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
      res.json({ 
        success: true, token, 
        user: { id: user._id, name: user.name, email: user.email, phone: user.phone, addresses: user.addresses || [], isAdmin: user.isAdmin } 
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// --- 4. FORGOT PASSWORD (OTP on Email) ---
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const otp = Math.floor(1000 + Math.random() * 9000);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    const mailOptions = {
      from: `"Occasionals Jewels" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset Password OTP - Occasionals",
      html: `
        <div style="font-family: serif; border: 1px solid #ddd; padding: 20px;">
          <h2 style="color: #db2777;">Occasionals.</h2>
          <p>Your OTP to reset your password is: <strong>${otp}</strong></p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>`
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "OTP sent to email", otpValue: otp });

  } catch (error) {
    console.error("Email Error:", error.message);
    res.status(500).json({ success: false, message: "Email service failed" });
  }
};

// --- 5. RESET PASSWORD (Final Step) ---
exports.resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ success: true, message: "Password updated! Please login." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to reset password" });
  }
};

// --- 6. ADDRESS MANAGEMENT ---
exports.addInitialAddress = async (req, res) => {
  try {
    const { email, address } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      user.addresses.push(address);
      await user.save();
      res.status(200).json({ success: true });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};