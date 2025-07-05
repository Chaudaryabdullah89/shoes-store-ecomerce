import React from 'react';
import { Link } from 'react-router-dom';

const Sitemap = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4">
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
      <h1 className="text-2xl font-bold mb-4">Sitemap</h1>
      <ul className="space-y-2 text-left">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/Shop">Shop</Link></li>
        <li><Link to="/Wishlist">Wishlist</Link></li>
        <li><Link to="/Cart">Cart</Link></li>
        <li><Link to="/Orders">Orders</Link></li>
        <li><Link to="/OrderTracking">Order Tracking</Link></li>
        <li><Link to="/About">About Us</Link></li>
        <li><Link to="/Login">Login</Link></li>
        <li><Link to="/Register">Register</Link></li>
      </ul>
    </div>
  </div>
);

export default Sitemap; 