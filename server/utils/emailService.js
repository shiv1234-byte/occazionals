const nodemailer = require('nodemailer');

const sendOrderEmail = async (customerEmail, orderDetails) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Aapka Gmail
      pass: process.env.EMAIL_PASS, // Gmail App Password
    },
  });

  const mailOptions = {
    from: `"Occasionals Jewels" <${process.env.EMAIL_USER}>`,
    to: customerEmail,
    subject: `Order Confirmed! - ${orderDetails.orderId}`,
    html: `
      <div style="font-family: serif; border: 1px solid #ddd; padding: 20px;">
        <h1 style="color: #db2777;">Occasionals.</h1>
        <p>Thank you for shopping with us!</p>
        <hr/>
        <p><strong>Product:</strong> ${orderDetails.productName}</p>
        <p><strong>Amount Paid:</strong> ₹${orderDetails.amount}</p>
        <p><strong>Payment Method:</strong> ${orderDetails.method}</p>
        <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
        <hr/>
        <p style="font-size: 12px; color: #666;">Your premium jewelry is being packed from our Kota Hub.</p>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
};

module.exports = { sendOrderEmail };