const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, "Please enter jewelry name"] 
  },
  description: { 
    type: String, 
    required: [true, "Please enter description"] 
  },
  images: [{ 
    type: String, 
    required: true 
  }], 
  category: { 
    type: String, 
    required: [true, "Please select a category"],
    // Inme se hi koi ek category honi chahiye jo aapne list ki thi
    enum: [
      "Long Sets", "Pearl Jewellery", "Kundan Jewellery", 
      "American Diamond", "Choker", "Anti Tarnish", 
      "Gold Jewellery", "Temple Jewellery", "Jhumka Earrings", "Kashmiri Earrings"
    ]
  },
  salePrice: { 
    type: Number, 
    required: [true, "Please enter selling price"],
    default: 0 
  },
  // Rental fields ko optional ya default 0 rakha hai taaki purana code na phate
  rentalPrice: { 
    type: Number, 
    default: 0 
  },
  isForRent: { 
    type: Boolean, 
    default: false // Strictly false for jewelry
  },
  isForSale: { 
    type: Boolean, 
    default: true 
  },
  // Artificial jewelry mein sizes (S,M,L) nahi hote, isliye ise hata diya
  countInStock: {
    type: Number,
    required: [true, "Please enter stock quantity"],
    default: 1
  },
  isAvailable: {
    type: Boolean,
    default: true 
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);