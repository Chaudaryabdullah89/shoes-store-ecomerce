import React from 'react';

const PrivacyPolicy = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4">
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full text-left">
      <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>
      <h2 className="font-semibold mt-4 mb-2">Introduction</h2>
      <p className="mb-2">We value your privacy and are committed to protecting your personal information. This policy explains how we collect, use, and safeguard your data when you use our website.</p>
      <h2 className="font-semibold mt-4 mb-2">Information We Collect</h2>
      <ul className="list-disc pl-6 mb-2">
        <li>Personal information you provide (name, email, address, etc.)</li>
        <li>Order and payment details</li>
        <li>Usage data and cookies</li>
      </ul>
      <h2 className="font-semibold mt-4 mb-2">How We Use Your Information</h2>
      <ul className="list-disc pl-6 mb-2">
        <li>To process orders and provide customer service</li>
        <li>To improve our website and services</li>
        <li>To send updates, offers, and marketing (you can opt out anytime)</li>
      </ul>
      <h2 className="font-semibold mt-4 mb-2">Data Security</h2>
      <p className="mb-2">We implement industry-standard security measures to protect your data. However, no method of transmission over the Internet is 100% secure.</p>
      <h2 className="font-semibold mt-4 mb-2">Third-Party Services</h2>
      <p className="mb-2">We may use third-party services (such as payment processors) that have their own privacy policies. We are not responsible for their practices.</p>
      <h2 className="font-semibold mt-4 mb-2">Your Rights</h2>
      <ul className="list-disc pl-6 mb-2">
        <li>Access, update, or delete your personal information</li>
        <li>Opt out of marketing communications</li>
        <li>Request information about how your data is used</li>
      </ul>
      <h2 className="font-semibold mt-4 mb-2">Changes to This Policy</h2>
      <p className="mb-2">We may update this policy from time to time. Please review it regularly for changes.</p>
      <h2 className="font-semibold mt-4 mb-2">Contact Us</h2>
      <p className="mb-2">If you have questions about this policy, please <a href="/ContactUs" className="underline text-yellow-700">contact us</a>.</p>
    </div>
  </div>
);

export default PrivacyPolicy; 