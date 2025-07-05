import React, { useEffect, useState } from 'react';
import AdminLayout from './components/AdminLayout';
import { userService } from '../services/userService';
import { useNavigate } from 'react-router-dom';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch customers
  const fetchCustomers = () => {
    setLoading(true);
    setError('');
    userService.getAllUsers()
      .then(data => setCustomers(data.users || []))
      .catch(() => setError('Failed to load customers'))
      .finally(() => setLoading(false));
  };
  useEffect(() => { fetchCustomers(); }, []);

  // Search/filter logic
  const filtered = customers.filter(c =>
    (c.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.email && c.email.toLowerCase().includes(search.toLowerCase())) ||
    (c.phone && c.phone.toLowerCase().includes(search.toLowerCase()))
  );

  // Delete customer
  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      await userService.deleteUser(deleteId);
      setShowDelete(false);
      setDeleteId(null);
      fetchCustomers();
    } catch {
      setError('Failed to delete customer');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen w-full p-0 bg-white">
        <div className="flex items-center justify-between mb-6 px-8 pt-8">
          <h1 className="text-2xl font-bold">Customers</h1>
        </div>
        <div className="flex items-center mb-4 px-8">
          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-64"
          />
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-6 mx-8">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="text-gray-400 py-8 text-center">No customers found.</div>
        ) : (
          <div className="overflow-x-auto rounded-xl shadow mx-8">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-500 text-xs uppercase bg-gray-50">
                  <th className="font-semibold py-3 px-2">Avatar</th>
                  <th className="font-semibold py-3 px-2">Name</th>
                  <th className="font-semibold py-3 px-2">Email</th>
                  <th className="font-semibold py-3 px-2">Phone</th>
                  <th className="font-semibold py-3 px-2">Status</th>
                  <th className="font-semibold py-3 px-2">Created At</th>
                  <th className="font-semibold py-3 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(customer => (
                  <tr key={customer._id || customer.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-2">
                      <img
                        src={customer.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(customer.name || 'User')}&background=F3F4F6&color=374151&size=64&bold=true`}
                        alt={customer.name}
                        className="w-10 h-10 object-cover rounded-full bg-gray-100"
                        onError={e => { e.target.onerror = null; e.target.src = '/download.jpg'; }}
                      />
                    </td>
                    <td className="py-2 px-2 font-semibold">{customer.name}</td>
                    <td className="py-2 px-2">{customer.email || '-'}</td>
                    <td className="py-2 px-2">{customer.phone || '-'}</td>
                    <td className="py-2 px-2">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${customer.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{customer.isActive ? 'Active' : 'Inactive'}</span>
                    </td>
                    <td className="py-2 px-2">{customer.createdAt ? new Date(customer.createdAt).toLocaleString() : '-'}</td>
                    <td className="py-2 px-2 flex  gap-4">
                      <button
                        className="text-yellow-700 underline font-semibold mr-2"
                        onClick={() => setSelectedCustomer(customer)}
                      >
                        View
                      </button>
                      <button
                        className="text-blue-700 underline font-semibold mr-2"
                        onClick={() => navigate(`/admin/customers/edit/${customer._id || customer.id}`)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-700 underline font-semibold"
                        onClick={() => { setShowDelete(true); setDeleteId(customer._id || customer.id); }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {/* Customer Details Modal */}
        {selectedCustomer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-2xl mx-4 w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">Customer Details - {selectedCustomer.name}</h3>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    {selectedCustomer.avatar ? (
                      <img src={selectedCustomer.avatar} alt={selectedCustomer.name} className="w-32 h-32 object-cover rounded-full bg-gray-100 mx-auto" onError={e => { e.target.onerror = null; e.target.src = '/default-avatar.png'; }} />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 font-bold text-5xl mx-auto">
                        {selectedCustomer.name?.[0]?.toUpperCase() || '?'}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="mb-2"><span className="font-semibold">Name:</span> {selectedCustomer.name || '-'}</div>
                    <div className="mb-2"><span className="font-semibold">Email:</span> {selectedCustomer.email || '-'}</div>
                    <div className="mb-2"><span className="font-semibold">Phone:</span> {selectedCustomer.phone || '-'}</div>
                    <div className="mb-2"><span className="font-semibold">Status:</span> {selectedCustomer.isActive ? 'Active' : 'Inactive'}</div>
                    <div className="mb-2"><span className="font-semibold">Created At:</span> {selectedCustomer.createdAt ? new Date(selectedCustomer.createdAt).toLocaleString() : '-'}</div>
                    {/* Add more fields as needed */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Delete Confirmation Modal */}
        {showDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md mx-4 w-full">
              <h3 className="text-xl font-bold mb-6">Delete Customer</h3>
              <p className="mb-6">Are you sure you want to delete this customer?</p>
              <div className="flex gap-4 justify-end">
                <button
                  className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300"
                  onClick={() => setShowDelete(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded bg-red-500 text-white font-semibold hover:bg-red-600"
                  onClick={handleDelete}
                  disabled={deleteLoading}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCustomers; 