import React, { useEffect, useState } from 'react';
import AdminLayout from './components/AdminLayout';
import { getAdminDashboardStats } from '../services/api';
import { productService } from '../services/productService';
import { orderService } from '../services/orderService';
import {Link} from 'react-router-dom'

const quickActions = [
  { label: 'Add Product', icon: '➕', href: '/admin/products/add' },
  { label: 'View Orders', icon: '📦', href: '/admin/orders' },
  { label: 'Write Blog', icon: '📝', href: '/admin/blogs' },
];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const statsRes = await getAdminDashboardStats();
        setStats(statsRes.stats);
        // Get all products, sort by sales (if available), or just show top 3
        const productsRes = await productService.getAdminProducts();
        let top = productsRes.products;
        if (top && top.length > 0) {
          top = [...top].sort((a, b) => (b.sales || 0) - (a.sales || 0)).slice(0, 3);
        }
        setTopProducts(top || []);
        // Get all orders, sort by createdAt desc, take top 3
        const ordersRes = await orderService.getAdminOrders();
        let orders = ordersRes.orders;
        if (orders && orders.length > 0) {
          orders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3);
        }
        setRecentOrders(orders || []);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <AdminLayout>
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
            <p className="text-gray-600 text-sm sm:text-base">Welcome to your admin dashboard</p>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {quickActions.map((action) => (
              <Link 
                key={action.label} 
                to={action.href} 
                className="flex items-center gap-2 bg-yellow-500 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-medium hover:bg-yellow-600 transition-colors text-sm sm:text-base"
              >
                <span className="text-lg">{action.icon}</span> 
                <span className="hidden sm:inline">{action.label}</span>
                <span className="sm:hidden">{action.label.split(' ')[0]}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg mb-6">{error}</div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="text-2xl sm:text-3xl font-bold text-yellow-600 mb-1">{stats?.orders ?? '-'}</div>
              <div className="text-gray-600 font-medium text-sm">Total Orders</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1">${stats?.sales?.toLocaleString() ?? '-'}</div>
              <div className="text-gray-600 font-medium text-sm">Revenue</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">{stats?.products ?? '-'}</div>
              <div className="text-gray-600 font-medium text-sm">Products</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-1">{stats?.users ?? '-'}</div>
              <div className="text-gray-600 font-medium text-sm">Customers</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="text-2xl sm:text-3xl font-bold text-indigo-600 mb-1">{stats?.reviews ?? '-'}</div>
              <div className="text-gray-600 font-medium text-sm">Reviews</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="text-2xl sm:text-3xl font-bold text-pink-600 mb-1">{stats?.blogs ?? '-'}</div>
              <div className="text-gray-600 font-medium text-sm">Blogs</div>
            </div>
          </div>

          {/* Sales Chart Placeholder */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-900">Sales Trends</h2>
            <div className="h-48 sm:h-64 flex items-center justify-center text-gray-400 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-4xl mb-2">📊</div>
                <p className="text-sm">Sales Chart Placeholder</p>
              </div>
            </div>
          </div>

          {/* Tables Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Top Products */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-900">Top Products</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-gray-500 text-xs uppercase border-b border-gray-200">
                      <th className="font-semibold pb-3 pr-2">Product</th>
                      <th className="font-semibold pb-3 px-2">Sales</th>
                      <th className="font-semibold pb-3 pl-2">Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProducts.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="text-gray-400 py-6 text-center text-sm">No products available</td>
                      </tr>
                    ) : (
                      topProducts.map((p) => (
                        <tr key={p._id || p.id || p.name} className="border-b border-gray-100 last:border-b-0">
                          <td className="py-3 pr-2">
                            <div className="flex items-center space-x-3">
                              <img 
                                src={p.images?.[0]?.url || p.images?.[0] || ''} 
                                alt={p.name}
                                className="w-8 h-8 object-cover rounded bg-gray-100"
                              />
                              <span className="font-medium text-sm truncate">{p.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-2 text-sm">{p.sales ?? '-'}</td>
                          <td className="py-3 pl-2 text-sm">{p.stock ?? '-'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-900">Recent Orders</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-gray-500 text-xs uppercase border-b border-gray-200">
                      <th className="font-semibold pb-3 pr-2">Order ID</th>
                      <th className="font-semibold pb-3 px-2">Customer</th>
                      <th className="font-semibold pb-3 px-2">Total</th>
                      <th className="font-semibold pb-3 pl-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-gray-400 py-6 text-center text-sm">No orders available</td>
                      </tr>
                    ) : (
                      recentOrders.map((o) => (
                        <tr key={o._id || o.id} className="border-b border-gray-100 last:border-b-0">
                          <td className="py-3 pr-2">
                            <span className="font-mono text-sm text-gray-600">
                              {String(o._id || o.id).slice(-8)}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-sm">{o.user?.name || o.customer || '-'}</td>
                          <td className="py-3 px-2 text-sm font-medium">
                            ${o.totalPrice?.toFixed(2) || o.total || '-'}
                          </td>
                          <td className="py-3 pl-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              o.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                              o.status === 'Processing' ? 'bg-yellow-100 text-yellow-700' : 
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {o.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard; 