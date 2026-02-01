const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  images: [{ type: String }], 
  category: { type: String, required: true },
  salePrice: { type: Number },
  rentalPrice: { type: Number },
  isForRent: { type: Boolean, default: true },
  isForSale: { type: Boolean, default: true },
  sizes: [String],
  stock: { type: Number, default: 1 },

isAvailable: {
  type: Boolean,
  required: true,
  default: true // This ensures NEW products start as "In Stock"
},
  countInStock: {
    type: Number,
    required: true,
    default: 0,
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);