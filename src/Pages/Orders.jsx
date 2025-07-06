import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { toast } from 'react-hot-toast';
import { FaBox, FaShippingFast, FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaTruck, FaEye, FaEyeSlash, FaMapMarkerAlt, FaCreditCard, FaCalendarAlt } from 'react-icons/fa';

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    setLoading(true);
    orderService.getOrders()
      .then(data => setOrders(data.orders || []))
      .catch(() => setError('Failed to load orders'))
      .finally(() => setLoading(false));
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'delivered':
        return 'Delivered';
      case 'shipped':
        return 'Shipped';
      case 'processing':
        return 'Processing';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Pending';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <FaCheckCircle className="text-green-500" title="Delivered" />;
      case 'shipped':
        return <FaTruck className="text-blue-500" title="Shipped" />;
      case 'processing':
        return <FaHourglassHalf className="text-yellow-500" title="Processing" />;
      case 'cancelled':
        return <FaTimesCircle className="text-red-500" title="Cancelled" />;
      default:
        return <FaBox className="text-gray-400" title="Pending" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const filteredOrders = orders.filter(order => 
    filterStatus === 'all' ? true : order.status === filterStatus
  );

  const handleCancelOrder = async (orderId) => {
    try {
      await orderService.cancelOrder(orderId);
      setOrders(prev =>
        prev.map(o =>
          o._id === orderId
            ? { ...o, status: 'cancelled' }
            : o
        )
      );
      toast.success('Order cancelled successfully');
    } catch {
      toast.error('Failed to cancel order');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-4 sm:py-6 lg:py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Skeleton */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="h-8 sm:h-10 lg:h-12 bg-gray-300 rounded mb-3 sm:mb-4 w-48 sm:w-64 animate-pulse"></div>
            <div className="h-4 sm:h-5 lg:h-6 bg-gray-300 rounded w-64 sm:w-80 animate-pulse"></div>
          </div>

          {/* Filter Tabs Skeleton */}
          <div className="flex flex-wrap justify-center gap-2 mb-6 sm:mb-8">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-8 sm:h-10 bg-gray-300 rounded-lg sm:rounded-xl w-20 sm:w-24 animate-pulse"></div>
            ))}
          </div>

          {/* Orders List Skeleton */}
          <div className="space-y-4 sm:space-y-6">
            {[1, 2, 3, 4, 5].map(orderIndex => (
              <div key={orderIndex} className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                {/* Order Header Skeleton */}
                <div className="p-4 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 sm:gap-3 mb-2">
                        <div className="w-5 h-5 bg-gray-300 rounded animate-pulse"></div>
                        <div className="h-6 sm:h-7 bg-gray-300 rounded w-32 sm:w-40 animate-pulse"></div>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <div className="flex items-center gap-1">
                          <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
                          <div className="h-4 bg-gray-300 rounded w-24 animate-pulse"></div>
                        </div>
                        <div className="h-5 sm:h-6 bg-gray-300 rounded w-20 animate-pulse"></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-8 bg-gray-300 rounded w-20 animate-pulse"></div>
                      <div className="h-8 bg-gray-300 rounded w-8 animate-pulse"></div>
                    </div>
                  </div>
                </div>

                {/* Order Items Skeleton */}
                <div className="p-4 sm:p-6">
                  <div className="space-y-4">
                    {[1, 2, 3].map(itemIndex => (
                      <div key={itemIndex} className="flex gap-4 p-3 bg-gray-50 rounded-lg">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-300 rounded-lg animate-pulse flex-shrink-0"></div>
                        <div className="flex-1">
                          <div className="h-5 bg-gray-300 rounded mb-2 w-3/4 animate-pulse"></div>
                          <div className="h-4 bg-gray-300 rounded mb-1 w-1/2 animate-pulse"></div>
                          <div className="h-4 bg-gray-300 rounded w-1/3 animate-pulse"></div>
                        </div>
                        <div className="text-right">
                          <div className="h-5 bg-gray-300 rounded mb-2 w-16 animate-pulse"></div>
                          <div className="h-4 bg-gray-300 rounded w-12 animate-pulse"></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary Skeleton */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-300 rounded w-24 animate-pulse"></div>
                        <div className="h-4 bg-gray-300 rounded w-20 animate-pulse"></div>
                        <div className="h-4 bg-gray-300 rounded w-28 animate-pulse"></div>
                      </div>
                      <div className="text-right space-y-2">
                        <div className="h-4 bg-gray-300 rounded w-16 animate-pulse"></div>
                        <div className="h-4 bg-gray-300 rounded w-12 animate-pulse"></div>
                        <div className="h-5 bg-gray-300 rounded w-20 animate-pulse"></div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons Skeleton */}
                  <div className="mt-6 flex gap-3">
                    <div className="h-10 bg-gray-300 rounded w-24 animate-pulse"></div>
                    <div className="h-10 bg-gray-300 rounded w-28 animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaTimesCircle className="text-red-500 text-2xl" />
            </div>
            <h1 className="text-3xl font-bold mb-4 text-gray-800">My Orders</h1>
            <p className="text-gray-600 mb-8 text-lg">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="bg-black text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-900 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Start Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaBox className="text-gray-400 text-2xl" />
            </div>
            <h1 className="text-3xl font-bold mb-4 text-gray-800">My Orders</h1>
            <p className="text-gray-600 mb-8 text-lg">You haven't placed any orders yet.</p>
            <button
              onClick={() => navigate('/')}
              className="bg-black text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-900 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Start Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-4 sm:py-6 lg:py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-gray-800">My Orders</h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600">Track your order history and status</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-6 sm:mb-8">
          {['all', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-200 text-xs sm:text-sm ${
                filterStatus === status
                  ? 'bg-black text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {status === 'all' ? 'All Orders' : getStatusText(status)}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-4 sm:space-y-6">
          {filteredOrders.map((order) => (
            <div key={order._id || order.id} className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300">
              {/* Order Header */}
              <div className="p-4 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2">
                      {getStatusIcon(order.status)}
                      <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                        Order #{order.orderNumber || order._id || order.id}
                      </h3>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <FaCalendarAlt className="text-gray-400" />
                        <span>{formatDate(order.createdAt || order.date)}</span>
                      </div>
                      <span className="text-base sm:text-lg font-bold text-gray-800">
                        ${order.totalPrice?.toFixed(2) || order.total?.toFixed(2) || '0.00'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-3 lg:mt-0">
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)} {getStatusText(order.status)}
                    </span>
                    
                    <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                      <button
                        onClick={() => setExpandedOrderId(expandedOrderId === (order._id || order.id) ? null : (order._id || order.id))}
                        className="px-2 sm:px-3 py-1 rounded bg-gray-100 text-gray-700 text-xs font-semibold hover:bg-gray-200 transition border border-gray-200"
                      >
                        {expandedOrderId === (order._id || order.id) ? 'Hide' : 'View'}
                      </button>
                      
                      {order.orderNumber && (
                        <button
                          onClick={() => {
                            navigate(`/order-tracking/${order.orderNumber}`)
                          }}
                          className="bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-800 text-xs px-2 sm:px-3 py-1 rounded transition border border-blue-200"
                        >
                          Track
                        </button>
                      )}
                      
                      {order.status !== 'shipped' && order.status !== 'cancelled' && (
                        <button
                          onClick={async () => {
                            try {
                              await orderService.cancelOrder(order._id);
                              setOrders(prev =>
                                prev.map(o =>
                                  o._id === order._id
                                    ? { ...o, status: 'cancelled' }
                                    : o
                                )
                              );
                              toast.success('Order cancelled');
                            } catch {
                              toast.error('Failed to cancel order');
                            }
                          }}
                          className="bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-800 text-xs px-2 sm:px-3 py-1 rounded transition border border-red-200"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Order Items & Details */}
              <div
                className={`transition-all duration-300 ease-in-out ${expandedOrderId === (order._id || order.id) ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
              >
                {expandedOrderId === (order._id || order.id) && (
                  <div className="p-4 sm:p-6 bg-white">
                    <div className="space-y-3 sm:space-y-4">
                      <h4 className="font-semibold text-base sm:text-lg mb-2 border-b pb-2">Order Items</h4>
                      {order.items.map((item, idx) => (
                        <div key={item._id || item.id || idx} className="flex gap-3 sm:gap-4 items-center border-b pb-3 sm:pb-4 last:border-b-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 sm:w-16 sm:h-16 object-contain rounded shadow"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm sm:text-base">{item.name}</h4>
                            <div className="text-xs text-gray-500 mt-1">
                              {item.color && <span>Color: <span className="font-semibold text-gray-700">{item.color}</span></span>}
                              {item.size && <span className="ml-2">Size: <span className="font-semibold text-gray-700">{item.size}</span></span>}
                            </div>
                            <p className="text-gray-600 text-xs sm:text-sm">Qty: {item.quantity || item.qty}</p>
                            <p className="font-bold text-sm sm:text-base">${(item.price * (item.quantity || item.qty)).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Order Details */}
                    <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                      <div>
                        <h4 className="font-semibold mb-2 text-sm sm:text-base">Shipping Address</h4>
                        <div className="bg-gray-50 rounded-lg p-3 sm:p-4 text-xs sm:text-sm">
                          {order.shippingAddress?.name}<br />
                          {order.shippingAddress?.address}<br />
                          {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}<br />
                          {order.shippingAddress?.country}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2 text-sm sm:text-base">Order Details</h4>
                        <div className="space-y-1 text-xs sm:text-sm text-gray-600 bg-gray-50 rounded-lg p-3 sm:p-4">
                          <p><span className="font-medium">Payment:</span> {order.paymentInfo?.method || order.paymentMethod}</p>
                          {order.trackingNumber && <p><span className="font-medium">Tracking:</span> {order.trackingNumber}</p>}
                          {order.estimatedDelivery && <p><span className="font-medium">Estimated Delivery:</span> {formatDate(order.estimatedDelivery)}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 lg:p-8 max-w-4xl mx-4 w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold">Order Details - {selectedOrder.id}</h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {/* Order Status */}
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                  <div>
                    <h4 className="font-semibold text-sm sm:text-base">Order Status</h4>
                    <p className="text-gray-600 text-xs sm:text-sm">Placed on {formatDate(selectedOrder.date)}</p>
                  </div>
                  <span className={`px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                    {getStatusText(selectedOrder.status)}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Order Items</h4>
                <div className="space-y-3 sm:space-y-4">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex gap-3 sm:gap-4 p-3 sm:p-4 border rounded-lg">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <h5 className="font-semibold text-sm sm:text-base">{item.name}</h5>
                        <p className="text-gray-600 text-xs sm:text-sm">Quantity: {item.qty}</p>
                        <p className="text-gray-600 text-xs sm:text-sm">Price: ${item.price.toFixed(2)} each</p>
                        <p className="font-bold text-sm sm:text-base">Total: ${(item.price * item.qty).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <h4 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Order Summary</h4>
                <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${(selectedOrder.total * 0.92).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>FREE</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>${(selectedOrder.total * 0.08).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold border-t pt-2">
                    <span>Total:</span>
                    <span>${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Shipping & Payment Info */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <h4 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Shipping Address</h4>
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                    <p className="text-gray-600 text-xs sm:text-sm">
                      {selectedOrder.shippingAddress.name}<br />
                      {selectedOrder.shippingAddress.address}<br />
                      {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}<br />
                      {selectedOrder.shippingAddress.country}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Payment Information</h4>
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                    <p className="text-gray-600 text-xs sm:text-sm">
                      <span className="font-medium">Method:</span> {selectedOrder.paymentMethod}<br />
                      <span className="font-medium">Tracking:</span> {selectedOrder.trackingNumber}<br />
                      <span className="font-medium">Estimated Delivery:</span> {formatDate(selectedOrder.estimatedDelivery)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders; 