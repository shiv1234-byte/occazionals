import React, { useEffect } from 'react';

const ReturnsPolicy = () => {
  useEffect(() => window.scrollTo(0, 0), []);
  return (
    <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto dark:text-white">
      <h1 className="text-4xl font-serif font-bold mb-8 text-pink-600">Return & Exchange</h1>
      <div className="space-y-6 text-gray-600 dark:text-gray-300 leading-relaxed">
        <p>Due to the intimate nature of jewelry and hygiene reasons, we have a specific policy.</p>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Unboxing Video Mandatory</h3>
        <p className="bg-pink-50 dark:bg-pink-900/20 p-4 border-l-4 border-pink-600 italic">
          Important: We only accept returns or exchanges if the product is damaged during transit. A continuous unboxing video (no cuts/edits) is mandatory to claim any damage.
        </p>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Process</h3>
        <p>Send the unboxing video to <strong>support@occasionalsjewels.in</strong> or WhatsApp us within 24 hours of delivery.</p>
      </div>
    </div>
  );
};
export default ReturnsPolicy;