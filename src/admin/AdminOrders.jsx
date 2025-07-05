import React, { useEffect, useState } from 'react';
import AdminLayout from './components/AdminLayout';
import { orderService } from '../services/orderService';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const statusOptions = [
    'pending',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
    'refunded',
  ];
  const [actionLoading, setActionLoading] = useState(null); // orderId for which action is loading

  useEffect(() => {
    setLoading(true);
    setError('');
    orderService.getAdminOrders()
      .then(data => setOrders(data.orders || []))
      .catch(() => setError('Failed to load orders'))
      .finally(() => setLoading(false));
  }, []);

  const toggleExpand = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const handleStatusUpdate = async (order, newStatus, note = '') => {
    setActionLoading(order._id);
    try {
      await orderService.updateOrderStatus(order._id, newStatus, note);
      toast.success('Order status updated and email sent!');
      // Refresh orders list
      const data = await orderService.getAdminOrders();
      setOrders(data.orders || []);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update status.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelOrder = async (order) => {
    setActionLoading(order._id);
    try {
      await orderService.cancelOrder(order._id);
      toast.success('Order cancelled and email sent!');
      // Refresh orders list
      const data = await orderService.getAdminOrders();
      setOrders(data.orders || []);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to cancel order.');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'shipped': return 'bg-blue-100 text-blue-700';
      case 'processing': return 'bg-yellow-100 text-yellow-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      case 'refunded': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Orders</h1>
          <p className="text-gray-600 text-sm sm:text-base">Manage customer orders and track shipments</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg">{error}</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600 text-sm">Orders will appear here once customers place them</p>
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4">
              {orders.map((order) => (
                <div key={order._id || order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm">Order #{order.orderNumber}</h3>
                      <p className="text-gray-600 text-xs">{order.user?.name || 'Guest'}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600 text-sm">${order.totalPrice?.toFixed(2) || '-'}</div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 mb-3">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      className="text-blue-600 text-xs font-medium hover:text-blue-700 flex items-center"
                      onClick={() => toggleExpand(order._id)}
                    >
                      {expandedOrderId === order._id ? <FaChevronUp className="mr-1" /> : <FaChevronDown className="mr-1" />}
                      {expandedOrderId === order._id ? 'Hide' : 'View'} Details
                    </button>
                  </div>

                  {/* Expanded Details */}
                  {expandedOrderId === order._id && (
                    <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                      {/* Order Items */}
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Items</h4>
                        <div className="space-y-2">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-xs">
                              <span>{item.name} x {item.quantity}</span>
                              <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Addresses */}
                      <div className="grid grid-cols-1 gap-3">
                        <div>
                          <h4 className="font-semibold text-sm mb-1">Shipping Address</h4>
                          <div className="text-xs text-gray-600">
                            {order.shippingAddress?.name}<br/>
                            {order.shippingAddress?.address}<br/>
                            {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}<br/>
                            {order.shippingAddress?.country}
                          </div>
                        </div>
                      </div>

                      {/* Order Summary */}
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Order Summary</h4>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>${order.itemsPrice?.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Tax:</span>
                            <span>${order.taxPrice?.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Shipping:</span>
                            <span>${order.shippingPrice?.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between font-bold border-t pt-1">
                            <span>Total:</span>
                            <span>${order.totalPrice?.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Admin Actions */}
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Update Status</h4>
                        <form
                          onSubmit={e => {
                            e.preventDefault();
                            handleStatusUpdate(order, e.target.status.value, e.target.note.value);
                          }}
                          className="space-y-2"
                        >
                          <select 
                            name="status" 
                            defaultValue={order.status} 
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                          >
                            {statusOptions.map(opt => (
                              <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                            ))}
                          </select>
                          <input 
                            name="note" 
                            type="text" 
                            placeholder="Note (optional)" 
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                          />
                          <button
                            type="submit"
                            className="w-full bg-yellow-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-yellow-600 transition-colors text-sm disabled:opacity-50"
                            disabled={actionLoading === order._id}
                          >
                            {actionLoading === order._id ? 'Saving...' : 'Update Status'}
                          </button>
                        </form>
                        
                        {order.status !== 'cancelled' && (
                          <button
                            className="w-full bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors text-sm mt-2 disabled:opacity-50"
                            onClick={() => handleCancelOrder(order)}
                            disabled={actionLoading === order._id}
                          >
                            {actionLoading === order._id ? 'Cancelling...' : 'Cancel Order'}
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-gray-500 text-xs uppercase bg-gray-50 border-b border-gray-200">
                      <th className="font-semibold py-4 px-6">Order ID</th>
                      <th className="font-semibold py-4 px-6">Customer</th>
                      <th className="font-semibold py-4 px-6">Total</th>
                      <th className="font-semibold py-4 px-6">Status</th>
                      <th className="font-semibold py-4 px-6">Date</th>
                      <th className="font-semibold py-4 px-6">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <React.Fragment key={order._id || order.id}>
                        <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-6 font-semibold text-gray-900">#{order.orderNumber}</td>
                          <td className="py-4 px-6 text-gray-600">{order.user?.name || 'Guest'}</td>
                          <td className="py-4 px-6 font-medium text-green-600">${order.totalPrice?.toFixed(2) || '-'}</td>
                          <td className="py-4 px-6">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-6">
                            <button
                              className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center"
                              onClick={() => toggleExpand(order._id)}
                            >
                              {expandedOrderId === order._id ? <FaChevronUp className="mr-1" /> : <FaChevronDown className="mr-1" />}
                              {expandedOrderId === order._id ? 'Hide' : 'View'} Details
                            </button>
                          </td>
                        </tr>
                        {expandedOrderId === order._id && (
                          <tr>
                            <td colSpan={6} className="bg-gray-50 p-6">
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Left Column */}
                                <div className="space-y-4">
                                  <div>
                                    <h3 className="font-semibold mb-3 text-gray-900">Order Items</h3>
                                    <div className="space-y-2">
                                      {order.items.map((item, idx) => (
                                        <div key={idx} className="flex justify-between text-sm">
                                          <span>{item.name} x {item.quantity}</span>
                                          <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  <div>
                                    <h3 className="font-semibold mb-3 text-gray-900">Shipping Address</h3>
                                    <div className="text-sm text-gray-600">
                                      {order.shippingAddress?.name}<br/>
                                      {order.shippingAddress?.address}<br/>
                                      {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}<br/>
                                      {order.shippingAddress?.country}
                                    </div>
                                  </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-4">
                                  <div>
                                    <h3 className="font-semibold mb-3 text-gray-900">Order Summary</h3>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span>Subtotal:</span>
                                        <span>${order.itemsPrice?.toFixed(2)}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Tax:</span>
                                        <span>${order.taxPrice?.toFixed(2)}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Shipping:</span>
                                        <span>${order.shippingPrice?.toFixed(2)}</span>
                                      </div>
                                      <div className="flex justify-between font-bold border-t pt-2">
                                        <span>Total:</span>
                                        <span>${order.totalPrice?.toFixed(2)}</span>
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <h3 className="font-semibold mb-3 text-gray-900">Admin Actions</h3>
                                    <form
                                      onSubmit={e => {
                                        e.preventDefault();
                                        handleStatusUpdate(order, e.target.status.value, e.target.note.value);
                                      }}
                                      className="space-y-3"
                                    >
                                      <select 
                                        name="status" 
                                        defaultValue={order.status} 
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                                      >
                                        {statusOptions.map(opt => (
                                          <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                                        ))}
                                      </select>
                                      <input 
                                        name="note" 
                                        type="text" 
                                        placeholder="Note (optional)" 
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                                      />
                                      <div className="flex gap-2">
                                        <button
                                          type="submit"
                                          className="flex-1 bg-yellow-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-yellow-600 transition-colors disabled:opacity-50"
                                          disabled={actionLoading === order._id}
                                        >
                                          {actionLoading === order._id ? 'Saving...' : 'Update Status'}
                                        </button>
                                        {order.status !== 'cancelled' && (
                                          <button
                                            type="button"
                                            className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
                                            onClick={() => handleCancelOrder(order)}
                                            disabled={actionLoading === order._id}
                                          >
                                            {actionLoading === order._id ? 'Cancelling...' : 'Cancel'}
                                          </button>
                                        )}
                                      </div>
                                    </form>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminOrders; 