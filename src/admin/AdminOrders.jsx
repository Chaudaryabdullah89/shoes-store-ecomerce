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

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Orders</h1>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-6">{error}</div>
      ) : (
        <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500 text-xs uppercase">
                <th className="font-semibold pb-2">Order ID</th>
                <th className="font-semibold pb-2">Customer</th>
                <th className="font-semibold pb-2">Total</th>
                <th className="font-semibold pb-2">Status</th>
                <th className="font-semibold pb-2">Date</th>
                <th className="font-semibold pb-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan={6} className="text-gray-400 py-4 text-center">No orders found</td></tr>
              ) : (
                orders.map((order) => (
                  <React.Fragment key={order._id || order.id}>
                    <tr className="border-b">
                      <td className="py-2 font-semibold">{order.orderNumber}</td>
                      <td className="py-2">{order.user?.name || '-'}</td>
                      <td className="py-2">${order.totalPrice?.toFixed(2) || '-'}</td>
                      <td className="py-2">{order.status}</td>
                      <td className="py-2">{new Date(order.createdAt).toLocaleString()}</td>
                      <td className="py-2">
                        <button
                          className="text-yellow-700 underline font-semibold flex items-center"
                          onClick={() => toggleExpand(order._id)}
                        >
                          {expandedOrderId === order._id ? <FaChevronUp /> : <FaChevronDown />}
                          <span className="ml-1">{expandedOrderId === order._id ? 'Hide' : 'View'} Details</span>
                        </button>
                      </td>
                    </tr>
                    {expandedOrderId === order._id && (
                      <tr>
                        <td colSpan={6} className="bg-gray-50 p-4">
                          {/* Order Details Section */}
                          <div>
                            <h3 className="font-semibold mb-2">Items</h3>
                            <ul>
                              {order.items.map((item, idx) => (
                                <li key={idx}>
                                  {item.name} x {item.quantity} @ ${item.price} = <b>${(item.price * item.quantity).toFixed(2)}</b>
                                </li>
                              ))}
                            </ul>
                            <h3 className="font-semibold mt-4 mb-2">Shipping Address</h3>
                            <div>{order.shippingAddress?.name}<br/>{order.shippingAddress?.address}<br/>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}<br/>{order.shippingAddress?.country}</div>
                            <h3 className="font-semibold mt-4 mb-2">Billing Address</h3>
                            <div>{order.billingAddress?.name}<br/>{order.billingAddress?.address}<br/>{order.billingAddress?.city}, {order.billingAddress?.state} {order.billingAddress?.zipCode}<br/>{order.billingAddress?.country}</div>
                            <h3 className="font-semibold mt-4 mb-2">Payment Info</h3>
                            <div>Method: {order.paymentInfo?.method || '-'}</div>
                            <div>Status: {order.paymentInfo?.status || '-'}</div>
                            <h3 className="font-semibold mt-4 mb-2">Order Summary</h3>
                            <div>Subtotal: ${order.itemsPrice?.toFixed(2)}</div>
                            <div>Tax: ${order.taxPrice?.toFixed(2)}</div>
                            <div>Shipping: ${order.shippingPrice?.toFixed(2)}</div>
                            <div>Total: <b>${order.totalPrice?.toFixed(2)}</b></div>
                            <div className="mt-4">
                              <h3 className="font-semibold mb-2">Admin Actions</h3>
                              <form
                                onSubmit={e => {
                                  e.preventDefault();
                                  handleStatusUpdate(order, e.target.status.value, e.target.note.value);
                                }}
                                className="flex gap-2 items-center"
                              >
                                <select name="status" defaultValue={order.status} className="border rounded px-2 py-1">
                                  {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                                <input name="note" type="text" placeholder="Note (optional)" className="border rounded px-2 py-1" />
                                <button
                                  type="submit"
                                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                                  disabled={actionLoading === order._id}
                                >
                                  {actionLoading === order._id ? 'Saving...' : 'Update Status'}
                                </button>
                              </form>
                              {order.status !== 'cancelled' && (
                                <button
                                  className="bg-red-500 text-white px-3 py-1 rounded mt-2"
                                  onClick={() => handleCancelOrder(order)}
                                  disabled={actionLoading === order._id}
                                >
                                  {actionLoading === order._id ? 'Cancelling...' : 'Cancel Order'}
                                </button>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminOrders; 