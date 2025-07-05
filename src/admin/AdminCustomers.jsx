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
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Customers</h1>
          <p className="text-gray-600 text-sm sm:text-base">Manage your customer database</p>
        </div>

        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search customers by name, email, or phone..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">👥</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No customers found</h3>
            <p className="text-gray-600 text-sm">Try adjusting your search criteria</p>
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4">
              {filtered.map(customer => (
                <div key={customer._id || customer.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                  <div className="flex items-start space-x-4">
                    <img
                      src={customer.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(customer.name || 'User')}&background=F3F4F6&color=374151&size=64&bold=true`}
                      alt={customer.name}
                      className="w-12 h-12 object-cover rounded-full bg-gray-100 flex-shrink-0"
                      onError={e => { e.target.onerror = null; e.target.src = '/download.jpg'; }}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{customer.name}</h3>
                      <p className="text-gray-600 text-xs sm:text-sm">{customer.email || 'No email'}</p>
                      <p className="text-gray-500 text-xs">{customer.phone || 'No phone'}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          customer.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {customer.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <div className="flex space-x-2">
                          <button
                            className="text-blue-600 text-xs font-medium hover:text-blue-700"
                            onClick={() => setSelectedCustomer(customer)}
                          >
                            View
                          </button>
                          <button
                            className="text-yellow-600 text-xs font-medium hover:text-yellow-700"
                            onClick={() => navigate(`/admin/customers/edit/${customer._id || customer.id}`)}
                          >
                            Edit
                          </button>
                          <button
                            className="text-red-600 text-xs font-medium hover:text-red-700"
                            onClick={() => { setShowDelete(true); setDeleteId(customer._id || customer.id); }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-gray-500 text-xs uppercase bg-gray-50 border-b border-gray-200">
                      <th className="font-semibold py-4 px-6">Avatar</th>
                      <th className="font-semibold py-4 px-6">Name</th>
                      <th className="font-semibold py-4 px-6">Email</th>
                      <th className="font-semibold py-4 px-6">Phone</th>
                      <th className="font-semibold py-4 px-6">Status</th>
                      <th className="font-semibold py-4 px-6">Created At</th>
                      <th className="font-semibold py-4 px-6">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(customer => (
                      <tr key={customer._id || customer.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6">
                          <img
                            src={customer.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(customer.name || 'User')}&background=F3F4F6&color=374151&size=64&bold=true`}
                            alt={customer.name}
                            className="w-10 h-10 object-cover rounded-full bg-gray-100"
                            onError={e => { e.target.onerror = null; e.target.src = '/download.jpg'; }}
                          />
                        </td>
                        <td className="py-4 px-6 font-semibold text-gray-900">{customer.name}</td>
                        <td className="py-4 px-6 text-gray-600">{customer.email || '-'}</td>
                        <td className="py-4 px-6 text-gray-600">{customer.phone || '-'}</td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            customer.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {customer.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-500">
                          {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : '-'}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex space-x-3">
                            <button
                              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                              onClick={() => setSelectedCustomer(customer)}
                            >
                              View
                            </button>
                            <button
                              className="text-yellow-600 hover:text-yellow-700 font-medium text-sm"
                              onClick={() => navigate(`/admin/customers/edit/${customer._id || customer.id}`)}
                            >
                              Edit
                            </button>
                            <button
                              className="text-red-600 hover:text-red-700 font-medium text-sm"
                              onClick={() => { setShowDelete(true); setDeleteId(customer._id || customer.id); }}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Customer Details Modal */}
        {selectedCustomer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] overflow-y-auto">
              <div className="p-6 sm:p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Customer Details</h3>
                  <button
                    onClick={() => setSelectedCustomer(null)}
                    className="text-gray-400 hover:text-gray-700 transition-colors p-2"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-shrink-0">
                      {selectedCustomer.avatar ? (
                        <img 
                          src={selectedCustomer.avatar} 
                          alt={selectedCustomer.name} 
                          className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-full bg-gray-100" 
                          onError={e => { e.target.onerror = null; e.target.src = '/default-avatar.png'; }} 
                        />
                      ) : (
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 font-bold text-3xl sm:text-4xl">
                          {selectedCustomer.name?.[0]?.toUpperCase() || '?'}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{selectedCustomer.name}</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center">
                          <span className="font-medium text-gray-700 w-20">Email:</span>
                          <span className="text-gray-900">{selectedCustomer.email || 'Not provided'}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium text-gray-700 w-20">Phone:</span>
                          <span className="text-gray-900">{selectedCustomer.phone || 'Not provided'}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium text-gray-700 w-20">Status:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            selectedCustomer.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {selectedCustomer.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium text-gray-700 w-20">Joined:</span>
                          <span className="text-gray-900">
                            {selectedCustomer.createdAt ? new Date(selectedCustomer.createdAt).toLocaleDateString() : 'Unknown'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional customer information can be added here */}
                  <div className="border-t border-gray-200 pt-4">
                    <h5 className="font-semibold text-gray-900 mb-3">Account Information</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Customer ID:</span>
                        <span className="ml-2 text-gray-900 font-mono">{selectedCustomer._id}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Last Updated:</span>
                        <span className="ml-2 text-gray-900">
                          {selectedCustomer.updatedAt ? new Date(selectedCustomer.updatedAt).toLocaleDateString() : 'Unknown'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Delete Customer</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to delete this customer? This action cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  onClick={() => setShowDelete(false)}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
                  onClick={handleDelete}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? 'Deleting...' : 'Delete'}
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