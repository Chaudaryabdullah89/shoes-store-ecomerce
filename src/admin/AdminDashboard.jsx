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
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
          <p className="text-gray-500">Welcome to your admin dashboard</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {quickActions.map((action) => (
            <Link key={action.label} to={action.href} className="flex items-center gap-2 bg-yellow-400 text-white px-4 py-2 rounded font-semibold hover:bg-yellow-500 transition">
              <span>{action.icon}</span> {action.label}
            </Link>
          ))}
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-6">{error}</div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6 mb-10">
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
              <div className="text-3xl font-bold text-yellow-700 mb-2">{stats?.orders ?? '-'}</div>
              <div className="text-gray-600 font-semibold">Total Orders</div>
            </div>
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
              <div className="text-3xl font-bold text-yellow-700 mb-2">${stats?.sales?.toLocaleString() ?? '-'}</div>
              <div className="text-gray-600 font-semibold">Revenue</div>
            </div>
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
              <div className="text-3xl font-bold text-yellow-700 mb-2">{stats?.products ?? '-'}</div>
              <div className="text-gray-600 font-semibold">Products</div>
            </div>
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
              <div className="text-3xl font-bold text-yellow-700 mb-2">{stats?.users ?? '-'}</div>
              <div className="text-gray-600 font-semibold">Customers</div>
            </div>
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
              <div className="text-3xl font-bold text-yellow-700 mb-2">{stats?.reviews ?? '-'}</div>
              <div className="text-gray-600 font-semibold">Reviews</div>
            </div>
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
              <div className="text-3xl font-bold text-yellow-700 mb-2">{stats?.blogs ?? '-'}</div>
              <div className="text-gray-600 font-semibold">Blogs</div>
            </div>
          </div>
          {/* Sales Chart Placeholder */}
          <div className="bg-white rounded-xl shadow p-6 mb-10">
            <h2 className="text-xl font-bold mb-4">Sales Trends</h2>
            <div className="h-48 flex items-center justify-center text-gray-400">[Sales Chart Placeholder]</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Top Products */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold mb-4">Top Products</h2>
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-500 text-xs uppercase">
                    <th className="font-semibold pb-2">Product</th>
                    <th className="font-semibold pb-2">Sales</th>
                    <th className="font-semibold pb-2">Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.length === 0 ? (
                    <tr><td colSpan={3} className="text-gray-400 py-4 text-center">No products</td></tr>
                  ) : (
                    topProducts.map((p) => (
                      <tr key={p._id || p.id || p.name} className="border-b">
                        <td className="py-2 font-semibold">{p.name}</td>
                        <td className="py-2">{p.sales ?? '-'}</td>
                        <td className="py-2">{p.stock ?? '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-500 text-xs uppercase">
                    <th className="font-semibold pb-2">Order ID</th>
                    <th className="font-semibold pb-2">Customer</th>
                    <th className="font-semibold pb-2">Total</th>
                    <th className="font-semibold pb-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.length === 0 ? (
                    <tr><td colSpan={4} className="text-gray-400 py-4 text-center">No orders</td></tr>
                  ) : (
                    recentOrders.map((o) => (
                      <tr key={o._id || o.id} className="border-b">
                        <td className="py-2 font-semibold">{o._id || o.id}</td>
                        <td className="py-2">{o.user?.name || o.customer || '-'}</td>
                        <td className="py-2">${o.totalPrice?.toFixed(2) || o.total || '-'}</td>
                        <td className="py-2">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${o.status === 'Delivered' ? 'bg-green-100 text-green-700' : o.status === 'Processing' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>{o.status}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard; 