import React, { useState, useEffect } from 'react';
import { orderService } from '../services/orderService';
import { useParams } from 'react-router-dom';

const OrderTracking = () => {
  const { orderNumber } = useParams();
  const [orderNum, setOrderNum] = useState(orderNumber || '');
  const [status, setStatus] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (orderNumber) {
      setOrderNum(orderNumber);
      setError('');
      setStatus(null);
      setLoading(true);
      orderService.trackOrder(orderNumber)
        .then(data => setStatus(data))
        .catch(err => setError(err.message || 'Order not found.'))
        .finally(() => setLoading(false));
    }
  }, [orderNumber]);

  const handleTrack = async (e) => {
    e.preventDefault();
    setError('');
    setStatus(null);
    if (!orderNum) {
      setError('Please enter your Order Number.');
      return;
    }
    setLoading(true);
    try {
      const data = await orderService.trackOrder(orderNum);
      setStatus(data);
    } catch (err) {
      setError(err.message || 'Order not found.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4">Track Your Order</h1>
        <form onSubmit={handleTrack} className="space-y-4 mb-4">
          <input
            type="text"
            placeholder="Order Number"
            value={orderNum}
            onChange={e => setOrderNum(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <button type="submit" className="w-full bg-yellow-400 text-white py-2 rounded font-semibold hover:bg-yellow-500 transition" disabled={loading}>{loading ? 'Tracking...' : 'Track Order'}</button>
        </form>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {status && (
          <div className="mt-6 text-left">
            <h2 className="text-lg font-semibold mb-2">Order Status: <span className="text-yellow-600">{status.status}</span></h2>
            <p className="mb-2 text-sm text-gray-600">Order Number: {status.orderNumber}</p>
            <div className="mb-4">
              <h3 className="font-semibold mb-1">Status History</h3>
              <ul className="mb-2 text-sm">
                {status.statusHistory && status.statusHistory.map((step, idx) => (
                  <li key={idx}>{step.status} <span className="text-gray-500">({new Date(step.timestamp).toLocaleString()})</span> {step.note && <span className="text-xs text-gray-400">- {step.note}</span>}</li>
                ))}
              </ul>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold mb-1">Shipping Info</h3>
              <div className="text-xs text-gray-500 mb-1">Carrier: {status.shippingInfo?.carrier}</div>
              <div className="text-xs text-gray-500 mb-1">Tracking Number: {status.shippingInfo?.trackingNumber || 'N/A'}</div>
              <div className="text-xs text-gray-500 mb-1">Estimated Delivery: {status.shippingInfo?.estimatedDelivery ? new Date(status.shippingInfo.estimatedDelivery).toLocaleDateString() : 'N/A'}</div>
            </div>
            <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 text-xs rounded">
              <b>Need help?</b> Contact our <a href="/contactus" className="underline">customer support</a> for assistance with your order.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking; 