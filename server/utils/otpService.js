const axios = require('axios');

const sendOTPWithoutDLT = async (mobileNumber, otp) => {
  try {
    const res = await axios.get('https://www.fast2sms.com/dev/bulkV2', {
      params: {
        authorization: process.env.FAST2SMS_API_KEY,
        variables_values: otp, // Yahan sirf numbers (OTP) jayenge
        route: 'otp',          // 'otp' route bina DLT ke chalta hai
        numbers: mobileNumber,
      }
    });
    return res.data.return; // Returns true if sent
  } catch (error) {
    console.error("Fast2SMS Error:", error.message);
    return false;
  }
};

module.exports = sendOTPWithoutDLT;