import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';

const statusOptions = [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded',
];

const AdminOrderDetail = () => {
  const { orderNumber } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  // Fetch order on mount or orderNumber change
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError('');
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await fetch(`/api/admin/orders/number/${orderNumber}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : undefined,
          },
          credentials: 'include',
        });
        const data = await res.json();
        if (!res.ok || !data.order) {
          setError(data.message || 'Order not found');
          setOrder(null);
        } else {
          setOrder(data.order);
          setStatus(data.order.status);
        }
      } catch {
        setError('Failed to load order. Please check the order number or your admin permissions.');
        setOrder(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchOrder();
    return () => { isMounted = false; };
  }, [orderNumber]);

  // Handle status update (still uses orderService for simplicity)
  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/orders/${order._id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : undefined,
        },
        credentials: 'include',
        body: JSON.stringify({ status, note }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update status');
      setOrder(data.order);
      setNote('');
    } catch (err) {
      setError(err.message || 'Failed to update status. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // UI states
  if (loading) return <AdminLayout><div className="p-8 text-center">Loading order details...</div></AdminLayout>;
  if (error) return <AdminLayout><div className="p-8 text-center text-red-500">{error}</div></AdminLayout>;
  if (!order) return <AdminLayout><div className="p-8 text-center text-gray-500">Order not found.</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-8 mt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Order #{order.orderNumber}</h2>
          <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-700">Back</button>
        </div>
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Status</h3>
          <form onSubmit={handleUpdateStatus} className="flex gap-4 items-end">
            <select value={status} onChange={e => setStatus(e.target.value)} className="border rounded px-3 py-2">
              {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <input type="text" placeholder="Note (optional)" value={note} onChange={e => setNote(e.target.value)} className="border rounded px-3 py-2" />
            <button type="submit" className="bg-yellow-500 text-white px-4 py-2 rounded font-semibold" disabled={saving}>{saving ? 'Saving...' : 'Update'}</button>
          </form>
        </div>
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Customer</h3>
          <div>{order.user?.name || '-'} ({order.user?.email || '-'})</div>
        </div>
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Items</h3>
          <ul>
            {order.items.map((item, idx) => (
              <li key={idx} className="mb-2">
                {item.name} x {item.quantity} @ ${item.price} = <b>${(item.price * item.quantity).toFixed(2)}</b>
              </li>
            ))}
          </ul>
        </div>
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Shipping Address</h3>
          <div>{order.shippingAddress?.name}<br/>{order.shippingAddress?.address}<br/>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}<br/>{order.shippingAddress?.country}</div>
        </div>
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Billing Address</h3>
          <div>{order.billingAddress?.name}<br/>{order.billingAddress?.address}<br/>{order.billingAddress?.city}, {order.billingAddress?.state} {order.billingAddress?.zipCode}<br/>{order.billingAddress?.country}</div>
        </div>
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Payment Info</h3>
          <div>Method: {order.paymentInfo?.method || '-'}</div>
          <div>Status: {order.paymentInfo?.status || '-'}</div>
        </div>
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Order Summary</h3>
          <div>Subtotal: ${order.itemsPrice?.toFixed(2)}</div>
          <div>Tax: ${order.taxPrice?.toFixed(2)}</div>
          <div>Shipping: ${order.shippingPrice?.toFixed(2)}</div>
          <div>Total: <b>${order.totalPrice?.toFixed(2)}</b></div>
        </div>
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Status History</h3>
          <ul>
            {order.statusHistory?.map((s, idx) => (
              <li key={idx}>{s.status} - {new Date(s.timestamp).toLocaleString()} {s.note && <span>({s.note})</span>}</li>
            ))}
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOrderDetail; 