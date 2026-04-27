const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendOTPWithoutDLT = require('../utils/otpService');
const nodemailer = require('nodemailer');

// --- 1. SEND OTP (Background Process) ---
exports.sendOTP = async (req, res) => {
    try {
        const { phone } = req.body;
        if (!phone) return res.status(400).json({ success: false, message: "Phone required" });

        const otp = Math.floor(1000 + Math.random() * 9000);

        // ⚡ Turant response bhej do taaki frontend "Loading" mein na fasa rahe
        res.status(200).json({ 
            success: true, 
            message: "OTP generation process started", 
            otpValue: otp 
        });

        // Background mein SMS jane do
        sendOTPWithoutDLT(phone, otp).catch(err => console.log("SMS Error handled silently:", err.message));

    } catch (error) {
        if (!res.headersSent) res.status(500).json({ success: false, message: "Server error in OTP" });
    }
};

// --- 2. REGISTER (Signup) ---
exports.register = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;
        
        const userExists = await User.findOne({ $or: [{ email }, { phone }] });
        if (userExists) return res.status(400).json({ success: false, message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, phone, password: hashedPassword });
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(201).json({ 
            success: true, 
            token, 
            user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin } 
        });
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
            
            // ✅ Yahan isAdmin field bhejna zaroori hai Navbar ke liye
            res.json({ 
                success: true, 
                token, 
                user: { 
                    id: user._id, 
                    name: user.name, 
                    email: user.email, 
                    phone: user.phone, 
                    addresses: user.addresses || [], 
                    isAdmin: user.isAdmin 
                } 
            });
        } else {
            res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Login failed on server" });
    }
};

// --- 4. FORGOT PASSWORD (Email OTP) ---
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ success: false, message: "Email not registered" });

        const otp = Math.floor(1000 + Math.random() * 9000);

        // ✅ Nodemailer configuration optimization
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            secure: true,
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
        });

        const mailOptions = {
            from: `"Occasionals Jewels" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Reset Password - OCCASIONALS.",
            html: `
                <div style="font-family: 'Georgia', serif; border: 2px solid #db2777; padding: 25px; border-radius: 20px; max-width: 500px; margin: auto;">
                    <h1 style="color: #db2777; text-align: center; letter-spacing: -1px;">OCCASIONALS.</h1>
                    <p style="font-size: 16px; color: #333;">Password reset karne ke liye aapka verification code niche diya gaya hai:</p>
                    <div style="background: #fff1f2; text-align: center; padding: 15px; border-radius: 10px; margin: 20px 0;">
                        <span style="font-size: 32px; font-weight: 900; letter-spacing: 5px; color: #000;">${otp}</span>
                    </div>
                    <p style="font-size: 12px; color: #999; text-align: center;">This code is valid for 10 minutes only.</p>
                </div>`
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: "OTP sent to email", otpValue: otp });

    } catch (error) {
        console.error("Mail Error:", error.message);
        res.status(500).json({ success: false, message: "Email service failed" });
    }
};

// --- 5. RESET PASSWORD ---
exports.resetPassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ success: false, message: "User session expired" });

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ success: true, message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to reset password" });
    }
};

// --- 6. ADD INITIAL ADDRESS ---
exports.addInitialAddress = async (req, res) => {
    try {
        const { email, address } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            user.addresses.push(address);
            await user.save();
            res.status(200).json({ success: true, message: "Address saved" });
        } else {
            res.status(404).json({ success: false, message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- 7. ADD ADDRESS (Profile Page) ---
exports.addAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        user.addresses.push(req.body);
        await user.save();
        res.status(200).json({ success: true, addresses: user.addresses });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};