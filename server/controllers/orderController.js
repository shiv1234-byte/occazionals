const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const puppeteer = require('puppeteer');
const ejs = require('ejs');
const path = require('path');
const axios = require('axios'); // Fast2SMS ke liye
const nodemailer = require('nodemailer'); // Email ke liye

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// --- 1. Email Config (Nodemailer) ---
const sendOrderEmail = async (order) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // 16 digit app password
      },
    });

    const mailOptions = {
      from: `"Occasionals Jewels" <${process.env.EMAIL_USER}>`,
      to: order.user.email,
      subject: `Order Confirmed! #${order._id.toString().slice(-6).toUpperCase()}`,
      html: `
        <div style="font-family: 'serif'; max-width: 600px; border: 1px solid #eee; padding: 20px;">
          <h1 style="color: #db2777; text-align: center;">Occasionals.</h1>
          <p>Hi ${order.user.name},</p>
          <p>Your order has been successfully placed! Here are the details:</p>
          <hr/>
          <p><strong>Order ID:</strong> #${order._id}</p>
          <p><strong>Total Amount:</strong> ₹${order.totalPrice}</p>
          <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
          <p><strong>Delivery To:</strong> ${order.shippingAddress.street}, ${order.shippingAddress.city}</p>
          <hr/>
          <p style="font-size: 12px; color: #666;">Packaged with love from our Kota Hub. 📍</p>
        </div>
      `,
    };
    await transporter.sendMail(mailOptions);
    console.log("✅ Confirmation Email Sent");
  } catch (err) {
    console.error("❌ Email Error:", err.message);
  }
};

// --- 2. Sasta SMS Alert (Fast2SMS) ---
const sendSMSAlert = async (phone, message) => {
  try {
    await axios.get('https://www.fast2sms.com/dev/bulkV2', {
      params: {
        authorization: process.env.FAST2SMS_API_KEY,
        route: 'q', // Quick SMS route
        message: message,
        numbers: phone,
      }
    });
    console.log("✅ SMS Alert Sent");
  } catch (err) {
    console.error("❌ SMS Error:", err.message);
  }
};

// --- Add Order Items ---
exports.addOrderItems = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, totalPrice, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!orderItems || orderItems.length === 0) return res.status(400).json({ message: "No items" });

    // Payment Verification
    if (paymentMethod === 'Online') {
      const sign = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSign = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(sign).digest("hex");
      if (razorpay_signature !== expectedSign) return res.status(400).json({ message: "Payment Verification Failed" });
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
    const fullOrder = await Order.findById(savedOrder._id).populate('user', 'name email');

    // --- AUTOMATIC NOTIFICATIONS ---
    // 1. Email bhejein (Free & Professional)
    await sendOrderEmail(fullOrder);

    // 2. Customer ko sasta SMS bhejein
    const customerSms = `Hi ${fullOrder.user.name}, your Occasionals order #${fullOrder._id.toString().slice(-6).toUpperCase()} of Rs.${fullOrder.totalPrice} is confirmed!`;
    await sendSMSAlert(fullOrder.shippingAddress.phone, customerSms);

    // 3. Admin (Aapko) SMS bhejein
    const adminSms = `NAYA ORDER! Customer: ${fullOrder.user.name}, Amount: Rs.${fullOrder.totalPrice}. Check Admin Panel.`;
    await sendSMSAlert('7042011696', adminSms);

    res.status(201).json({ success: true, order: savedOrder });
  } catch (error) {
    res.status(500).json({ message: "Order Error", error: error.message });
  }
};

// --- Razorpay Order Create ---
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
    res.status(500).json({ message: "Razorpay setup failed" });
  }
};

// --- Generate Invoice ---
exports.generateInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    const templatePath = path.join(process.cwd(), 'views', 'invoice.ejs');
    const html = await ejs.renderFile(templatePath, { order });

    const browser = await puppeteer.launch({ 
      headless: "new", 
      args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });
    const page = await browser.newPage();
    await page.setContent(html);
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();

    res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename=Invoice.pdf` });
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).send("Invoice error");
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

exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.status = req.body.status;
      await order.save();
      res.json({ message: "Status Updated" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};