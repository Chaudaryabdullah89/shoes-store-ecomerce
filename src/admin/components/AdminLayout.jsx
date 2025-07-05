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
    <div className="min-h-screen flex bg-gray-50">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-gray-200">
          <span className="text-xl font-bold text-yellow-600">Admin Panel</span>
          <button 
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors" 
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3">
          <div className="space-y-2">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center px-4 py-3 text-base font-medium rounded-xl transition-all duration-200 group
                  ${location.pathname === link.path 
                    ? 'bg-yellow-100 text-yellow-700 shadow-sm' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="mr-3 text-xl group-hover:scale-110 transition-transform">{link.icon}</span>
                <span className="flex-1">{link.label}</span>
                {location.pathname === link.path && (
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                )}
              </Link>
            ))}
          </div>
        </nav>

        {/* User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {adminUser?.name?.charAt(0) || 'A'}
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{adminUser?.name || 'Admin'}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
        {/* Topbar */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors" 
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Page Title */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                {navLinks.find(l => location.pathname.startsWith(l.path))?.label || 'Admin'}
              </h1>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900">{adminUser?.name || 'Admin'}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <button
                className="bg-yellow-500 text-white px-3 sm:px-4 py-2 rounded-lg font-medium hover:bg-yellow-600 transition-colors text-sm"
                onClick={() => {
                  localStorage.removeItem('adminToken');
                  localStorage.removeItem('adminUser');
                  window.location.href = '/admin/login';
                }}
              >
                <span className="hidden sm:inline">Logout</span>
                <span className="sm:hidden">Exit</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 