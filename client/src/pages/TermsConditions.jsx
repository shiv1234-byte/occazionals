import React, { useEffect } from 'react';

const TermsConditions = () => {
  useEffect(() => window.scrollTo(0, 0), []);
  return (
    <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto dark:text-white">
      <h1 className="text-4xl font-serif font-bold mb-8 text-pink-600">Terms & Conditions</h1>
      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">By using our website, you agree to comply with our terms. All designs are property of Occasionals Jewels. Misuse of content or fraudulent orders will lead to legal action.</p>
    </div>
  );
};
export default TermsConditions;