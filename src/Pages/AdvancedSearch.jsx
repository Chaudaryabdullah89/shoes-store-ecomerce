import React from 'react';

const AdvancedSearch = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4">
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
      <h1 className="text-2xl font-bold mb-4">Advanced Search</h1>
      <form className="space-y-4">
        <input type="text" placeholder="Search term..." className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400" />
        <input type="text" placeholder="Category..." className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400" />
        <input type="text" placeholder="Brand..." className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400" />
        <button type="submit" className="w-full bg-yellow-400 text-white py-2 rounded font-semibold hover:bg-yellow-500 transition">Search</button>
      </form>
      <p className="mt-4 text-gray-500 text-sm">This is a placeholder for advanced search functionality.</p>
    </div>
  </div>
);

export default AdvancedSearch; 