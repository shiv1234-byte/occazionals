const twilio = require('twilio');

const sendWhatsAppInvoice = async (orderDetails) => {
  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

  // Dynamic Message for GenZ Vibe
  const messageBody = `
✨ *Occasionals Jewels* ✨
Tradition Meets Trend

Hi ${orderDetails.user.name},
Aapka order confirm ho gaya hai! 💖
Order ID: #${orderDetails._id.toString().slice(-6)}
Total: ₹${orderDetails.totalPrice}

Aapka premium jewelry collection jaldi hi dispatch hoga. 🚚
View Invoice: https://occasionalsjewels.in/my-orders

Stay Elegant! 💍
`;

  try {
    await client.messages.create({
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:+91${orderDetails.shippingAddress.phone}`, // User ka number
      body: messageBody
    });
    console.log("✅ WhatsApp Invoice Sent!");
  } catch (error) {
    console.error("❌ WhatsApp Error:", error.message);
  }
};

module.exports = sendWhatsAppInvoice;