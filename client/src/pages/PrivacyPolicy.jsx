import React, { useEffect } from 'react';

const PrivacyPolicy = () => {
  useEffect(() => window.scrollTo(0, 0), []);
  return (
    <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto dark:text-white">
      <h1 className="text-4xl font-serif font-bold mb-8 text-pink-600">Privacy Policy</h1>
      <div className="space-y-6 text-gray-600 dark:text-gray-300 leading-relaxed">
        <p>Your privacy is our priority. We only collect data necessary to provide you with a smooth shopping experience.</p>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Data Collection</h3>
        <p>We collect your name, email, phone number, and address during checkout. We do NOT store your credit card or payment details (processed securely via encrypted gateways).</p>
      </div>
    </div>
  );
};
export default PrivacyPolicy;