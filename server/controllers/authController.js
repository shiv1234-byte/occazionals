const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTER USER
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    res.status(201).json({ success: true, message: "User registered!" });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// LOGIN USER
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ success: true, token, user: { name: user.name, isAdmin: user.isAdmin } });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
};