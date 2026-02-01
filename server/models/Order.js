const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderItems: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    orderType: { type: String, enum: ['Rent', 'Sale'], required: true },
    rentalDuration: { type: Number }, 
    price: { type: Number, required: true }
  }],
  totalPrice: { type: Number, required: true },
  isPaid: { type: Boolean, default: false },
  paidAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);