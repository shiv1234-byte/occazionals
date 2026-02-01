const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order'); 

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createRazorpayOrder = async (req, res) => {
  const { amount } = req.body;
  const options = {
    amount: Math.round(amount * 100), // Ensure it's an integer
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    res.status(500).json({ message: "Razorpay order creation failed", error });
  }
};

exports.verifyOrder = async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature, 
      orderItems, 
      amount 
    } = req.body;

    // 1. Verification Logic
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      
      // LOG THE DATA: Terminal mein check karein ki req.user._id mil raha hai ya nahi
      console.log("User from protect middleware:", req.user);

      const newOrder = new Order({
        user: req.user._id,
        orderItems: orderItems,
        totalPrice: amount,
        paymentInfo: {
          id: razorpay_payment_id,
          status: "Paid",
        },
        paidAt: Date.now(),
        // AGAR aapke model mein ye fields required hain toh inhe add karein:
        shippingAddress: req.body.shippingAddress || { address: "Not Provided", city: "NA", postalCode: "000000", country: "India" },
        status: "Processing"
      });

      const savedOrder = await newOrder.save();
      
      return res.status(200).json({ 
        success: true, 
        message: "Payment verified and order saved!", 
        order: savedOrder 
      });
    } else {
      return res.status(400).json({ success: false, message: "Invalid signature!" });
    }
  } catch (error) {
    // YEH LINE AAPKO TERMINAL MEIN ASLI ERROR DIKHAYEGI
    console.error("DETAILED VERIFICATION ERROR:", error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server Error fetching orders" });
  }
};