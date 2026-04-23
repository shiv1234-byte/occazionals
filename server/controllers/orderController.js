const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const puppeteer = require('puppeteer');
const ejs = require('ejs');
const path = require('path');
const twilio = require('twilio');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Twilio Client Initialize
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// --- Notification Logic (Customer & Admin) ---
const sendOrderAlerts = async (order) => {
  try {
    // 1. Customer Notification
    const customerMsg = `✨ *Occasionals Jewels* ✨\n\nHi ${order.user.name},\nOrder Confirm ho gaya hai! 💖\n\n🆔 Order ID: #${order._id.toString().slice(-8).toUpperCase()}\n💰 Total: ₹${order.totalPrice}\n\nThank you for choosing elegance!\nwww.occasionalsjewels.in`;

    await client.messages.create({
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:+91${order.shippingAddress.phone}`,
      body: customerMsg
    });

    // 2. Admin Notification (Aapke liye)
    const adminMsg = `📢 *NAYA ORDER AAYA HAI!* 📢\n\n🆔 ID: ${order._id}\n👤 Customer: ${order.user.name}\n📞 Phone: ${order.shippingAddress.phone}\n💰 Amount: ₹${order.totalPrice}\n📍 City: ${order.shippingAddress.city}`;

    await client.messages.create({
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:+917042011696`, // Aapka Number
      body: adminMsg
    });

    console.log("✅ All WhatsApp Alerts Sent (Customer & Admin)");
  } catch (err) {
    console.error("❌ Notification Error:", err.message);
  }
};

// --- Create Razorpay Order ---
exports.createRazorpayOrder = async (req, res) => {
  try {
    const options = {
      amount: Math.round(req.body.amount * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Razorpay failed" });
  }
};

// --- Save Order ---
exports.addOrderItems = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, totalPrice, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    if (!orderItems || orderItems.length === 0) return res.status(400).json({ message: "No items" });

    if (paymentMethod === 'Online') {
      const sign = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSign = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(sign).digest("hex");
      if (razorpay_signature !== expectedSign) return res.status(400).json({ message: "Invalid Signature" });
    }

    const newOrder = new Order({
      user: req.user._id,
      orderItems: orderItems.map(item => ({ ...item, orderType: "Sale" })),
      shippingAddress, 
      paymentMethod, 
      totalPrice,
      isPaid: paymentMethod === 'Online',
      paidAt: paymentMethod === 'Online' ? Date.now() : null,
      status: "Processing"
    });

    const savedOrder = await newOrder.save();
    
    // User details populate karke alerts bhejein
    const fullOrder = await Order.findById(savedOrder._id).populate('user', 'name email');
    
    // Dono ko message bhej raha hai (Customer & Admin)
    await sendOrderAlerts(fullOrder);

    res.status(201).json({ success: true, order: savedOrder });
  } catch (error) {
    console.error("Save Error:", error.message);
    res.status(500).json({ message: "Save Error", error: error.message });
  }
};

// --- Generate Premium Invoice ---
exports.generateInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return res.status(404).send("Order not found");

    const templatePath = path.join(process.cwd(), 'views', 'invoice.ejs');
    const html = await ejs.renderFile(templatePath, { order }, { cache: false });

    const browser = await puppeteer.launch({ 
      headless: "new", 
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'] 
    });
    
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({ 
      format: 'A4', 
      printBackground: true,
      margin: { top: '0px', bottom: '0px' }
    });

    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=Invoice_${order._id}.pdf`,
      'Cache-Control': 'no-cache'
    });
    res.send(pdfBuffer);
  } catch (error) {
    console.error("PDF Error:", error);
    res.status(500).send("Invoice failed");
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Fetch failed" });
  }
};
// Admin status update karega
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.status = req.body.status; // e.g., 'Shipped', 'Delivered'
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};