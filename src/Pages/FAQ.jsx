import React from 'react';

const FAQ = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4">
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full text-left">
      <h1 className="text-2xl font-bold mb-4">Frequently Asked Questions</h1>
      <div className="mb-4">
        <h2 className="font-semibold">How do I track my order?</h2>
        <p className="text-gray-600">You can track your order using the Order Tracking page. Enter your order ID and email to see the status.</p>
      </div>
      <div className="mb-4">
        <h2 className="font-semibold">What is your return policy?</h2>
        <p className="text-gray-600">We accept returns within 30 days of delivery. Please contact our support for more details.</p>
      </div>
      <div className="mb-4">
        <h2 className="font-semibold">How can I contact customer service?</h2>
        <p className="text-gray-600">You can reach us via the Contact Us page or email us at support@example.com.</p>
      </div>
    </div>
  </div>
);

export default FAQ; 