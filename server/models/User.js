const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String, required: true },
  state: { type: String, required: true },
  isDefault: { type: Boolean, default: false }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phone: { type: String, unique: true, required: true }, // OTP ke liye zaroori
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  // Multiple addresses store karne ke liye array
  addresses: [addressSchema], 
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);