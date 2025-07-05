import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const OrderConfirmation = () => {
  const location = useLocation();
  const order = location.state?.order;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full text-center">
        <svg className="mx-auto mb-4" width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2l4-4m5 2a9 9 0 11-18 0a9 9 0 0118 0z" />
        </svg>
        <h1 className="text-3xl font-bold mb-2 text-green-600">Thank You for Your Order!</h1>
        <p className="text-gray-700 mb-2">Your order has been placed successfully. We appreciate your business!</p>
        <p className="text-gray-500 mb-6">A confirmation email with your order details has been sent to your inbox. If you have any questions, please contact our support team.</p>
        {order && (
          <div className="mb-10 text-left">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Order Summary</h2>
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-gray-500">Order #</span>
                    <span className="font-semibold text-gray-800">{order.orderNumber || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Date</span>
                    <span className="text-gray-700">{order.date ? new Date(order.date).toLocaleDateString() : (new Date()).toLocaleDateString()}</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-gray-500">Total</span>
                    <span className="font-semibold text-gray-800">${order.totalPrice?.toFixed(2) || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Payment</span>
                    <span className="text-gray-700 capitalize">{order.paymentMethod || order.paymentInfo?.method || 'N/A'}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-gray-500 mb-1">Shipping Address</div>
                  <div className="text-gray-700 text-sm leading-relaxed">
                    {order.shippingAddress ? (
                      <>
                        {order.shippingAddress.name && <span>{order.shippingAddress.name}<br /></span>}
                        {order.shippingAddress.address}<br />
                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode || order.shippingAddress.zip}<br />
                        {order.shippingAddress.country}
                      </>
                    ) : 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-gray-500">Status</span>
                    <span className="inline-block px-2 py-1 rounded bg-green-100 text-green-700 font-semibold text-xs">
                      {order.status || 'Confirmed'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Est. Delivery</span>
                    <span className="text-gray-700">{order.estimatedDelivery || '3-7 business days'}</span>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <div className="font-semibold mb-2 text-gray-800">Items</div>
                <ul className="divide-y divide-gray-100">
                  {order.items?.map((item, idx) => (
                    <li key={idx} className="flex items-center py-2">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="w-10 h-10 object-contain rounded border border-gray-200 mr-3" />
                      )}
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">{item.name}</div>
                        <div className="text-xs text-gray-500">Qty: {item.quantity}</div>
                      </div>
                      <div className="font-semibold text-gray-700">${(item.price * item.quantity).toFixed(2)}</div>
                    </li>
                  ))}
                </ul>
              </div>
              {order.orderNotes && (
                <div className="mt-4">
                  <div className="font-semibold text-gray-800 mb-1">Order Note</div>
                  <p className="text-gray-600 text-sm">{order.orderNotes}</p>
                </div>
              )}
            </div>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                <h3 className="font-semibold text-yellow-700 mb-1">Next Steps</h3>
                <ul className="list-disc list-inside text-yellow-800 text-sm space-y-1">
                  <li>You'll receive a shipping confirmation email once your order is dispatched.</li>
                  <li>Track your order status in your <Link to="/Orders" className="underline text-yellow-700">Orders</Link> page.</li>
                  <li>Need changes? Contact us as soon as possible.</li>
                </ul>
              </div>
              <div className="flex-1 bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                <h3 className="font-semibold text-blue-700 mb-1">Need Help?</h3>
                <p className="text-blue-800 text-sm">
                  Questions or concerns? Email <a href="mailto:support@example.com" className="underline">support@example.com</a> or call <a href="tel:+1234567890" className="underline">+1 (234) 567-890</a>.
                </p>
              </div>
            </div>
          </div>
        )}
        {!order && (
          <div className="mb-8 text-gray-500">
            <p>We could not find your order details. If you believe this is an error, please contact our support team.</p>
          </div>
        )}
        <div className="flex flex-col gap-3">
          <Link to="/Shop" className="bg-yellow-400 text-white px-6 py-2 rounded font-semibold hover:bg-yellow-500 transition">Continue Shopping</Link>
          <Link to="/Orders" className="text-yellow-600 underline font-semibold">View My Orders</Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation; 