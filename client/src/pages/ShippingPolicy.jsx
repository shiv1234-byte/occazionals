import React, { useEffect } from 'react';

const ShippingPolicy = () => {
  useEffect(() => window.scrollTo(0, 0), []);
  return (
    <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto dark:text-white">
      <h1 className="text-4xl font-serif font-bold mb-8 text-pink-600">Shipping Policy</h1>
      <div className="space-y-6 text-gray-600 dark:text-gray-300 leading-relaxed">
        <p>At <strong>Occasionals Jewels</strong>, we ensure that your luxury reaches you safely and swiftly.</p>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Delivery Timeline</h3>
        <p>All orders are processed within 1-2 business days. Shipping across India typically takes 5-7 business days depending on your location (Kota to your doorstep).</p>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Shipping Charges</h3>
        <p>Standard shipping is free for orders above ₹999. For orders below this, a nominal fee of ₹70 is charged.</p>
      </div>
    </div>
  );
};
export default ShippingPolicy;