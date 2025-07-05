import React from 'react';

const TermsAndConditions = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4">
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full text-left">
      <h1 className="text-2xl font-bold mb-4">Terms & Conditions</h1>
      <h2 className="font-semibold mt-4 mb-2">Introduction</h2>
      <p className="mb-2">By using our website, you agree to these terms and conditions. Please read them carefully before making a purchase.</p>
      <h2 className="font-semibold mt-4 mb-2">Use of Service</h2>
      <p className="mb-2">You agree to use our site for lawful purposes only. You must not misuse our services or attempt to access unauthorized areas.</p>
      <h2 className="font-semibold mt-4 mb-2">Purchases</h2>
      <p className="mb-2">All purchases are subject to product availability and confirmation of payment. We reserve the right to refuse or cancel any order.</p>
      <h2 className="font-semibold mt-4 mb-2">Returns</h2>
      <p className="mb-2">Returns are accepted within 30 days of delivery. Items must be unused and in original packaging. Please contact support for return instructions.</p>
      <h2 className="font-semibold mt-4 mb-2">User Responsibilities</h2>
      <p className="mb-2">You are responsible for maintaining the confidentiality of your account and password. Notify us immediately of any unauthorized use.</p>
      <h2 className="font-semibold mt-4 mb-2">Limitation of Liability</h2>
      <p className="mb-2">We are not liable for any indirect, incidental, or consequential damages arising from your use of our site or products.</p>
      <h2 className="font-semibold mt-4 mb-2">Changes</h2>
      <p className="mb-2">We may update these terms at any time. Continued use of the site constitutes acceptance of the new terms.</p>
      <h2 className="font-semibold mt-4 mb-2">Contact</h2>
      <p className="mb-2">For questions about these terms, please <a href="/contactus" className="underline text-yellow-700">contact us</a>.</p>
    </div>
  </div>
);

export default TermsAndConditions; 