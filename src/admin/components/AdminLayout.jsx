import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: '🏠' },
  { label: 'Orders', path: '/admin/orders', icon: '📦' },
  { label: 'Products', path: '/admin/products', icon: '🛒' },
  { label: 'Customers', path: '/admin/customers', icon: '👥' },
  { label: 'Blogs', path: '/admin/blogs', icon: '📝' },
  { label: 'Emails', path: '/admin/emails', icon: '✉️' },
  { label: 'Settings', path: '/admin/settings', icon: '⚙️' },
];

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-64'} md:translate-x-0 md:static md:inset-0`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <span className="text-xl font-bold text-yellow-700">Admin Panel</span>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <span className="text-2xl">×</span>
          </button>
        </div>
        <nav className="mt-6 space-y-1">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center px-6 py-3 text-lg font-medium rounded-lg transition
                ${location.pathname === link.path ? 'bg-yellow-100 text-yellow-700' : 'text-gray-700 hover:bg-gray-50'}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="mr-3 text-xl">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-20 md:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="flex items-center justify-between bg-white shadow px-6 py-4 sticky top-0 z-10">
          <button className="md:hidden text-2xl" onClick={() => setSidebarOpen(true)}>
            ☰
          </button>
          <div className="flex-1 text-xl font-bold text-gray-900">{navLinks.find(l => location.pathname.startsWith(l.path))?.label || 'Admin'}</div>
          <div className="flex items-center gap-4">
            <span className="font-semibold text-gray-700">{adminUser?.name || 'Admin'}</span>
            <button
              className="bg-yellow-400 text-white px-4 py-2 rounded font-semibold hover:bg-yellow-500 transition"
              onClick={() => {
                localStorage.removeItem('adminToken');
                localStorage.removeItem('adminUser');
                window.location.href = '/admin/login';
              }}
            >
              Logout
            </button>
          </div>
        </header>
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout; 