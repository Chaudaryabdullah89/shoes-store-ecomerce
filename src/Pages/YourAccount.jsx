import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiEdit2, FiUser, FiShoppingBag, FiHeart, FiSettings, FiLogOut, FiEye } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { useAuth } from '../Context/useAuth';
import defaultAvatar from '../assets/react.svg';
import api from '../services/api';

const Profile = () => {
  const navigate = useNavigate();
  const { user, token, loading: authLoading, logout, login } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || {
      street: '', city: '', state: '', zipCode: '', country: ''
    },
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Fetch orders from backend
  useEffect(() => {
    if (!user && !authLoading) {
      navigate('/login', { state: { from: '/profile' } });
      return;
    }
    if (user && token) {
      setIsLoading(true);
    Promise.all([
        api.get('/orders/my-orders')
      ]).then(([ordersRes]) => {
        setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : []);
      }).catch(() => {
        toast.error('Failed to load orders');
      }).finally(() => setIsLoading(false));
    }
    // eslint-disable-next-line
  }, [user, token, authLoading, navigate]);

  // Update formData when user changes
  useEffect(() => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || {
        street: '', city: '', state: '', zipCode: '', country: ''
      },
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.put('/users/profile', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address
      });
      if (res.data && res.data.user) {
        login(res.data.user, token); // update context
        toast.success('Profile updated successfully');
        setIsEditing(false);
      }
    } catch {
      toast.error('Profile update failed');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Only JPG, PNG and GIF files are allowed');
        return;
      }
      const form = new FormData();
      form.append('avatar', file);
      try {
        const response = await api.put('/users/avatar', form, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (response.data.avatar) {
          login({ ...user, avatar: response.data.avatar }, token);
          toast.success('Profile picture updated successfully');
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to update profile picture');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login', { replace: true });
      toast.success('Logged out successfully');
    } catch {
      toast.error('Failed to logout properly');
      navigate('/login', { replace: true });
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Sidebar */}
          <div className="md:col-span-1">
            <div
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <div className="flex flex-col items-center mb-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = defaultAvatar;
                          login({ ...user, avatar: null }, token);
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <FiUser className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors"
                  >
                    <FiEdit2 className="w-4 h-4" />
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>
                <h2 className="mt-4 text-xl font-bold text-gray-900">{user?.name}</h2>
                <p className="text-gray-500">{user?.email}</p>
                </div>

                <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'profile'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <FiUser className="w-5 h-5" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'orders'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <FiShoppingBag className="w-5 h-5" />
                  <span>Orders</span>
                </button>
                <button
                  onClick={() => setActiveTab('wishlist')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'wishlist'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <FiHeart className="w-5 h-5" />
                  <span>Wishlist</span>
                </button>
                    <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'settings'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <FiSettings className="w-5 h-5" />
                  <span>Settings</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                  <FiLogOut className="w-5 h-5" />
                  <span>Logout</span>
                    </button>
                </nav>
                </div>
              </div>

            {/* Main Content */}
          <div className="md:col-span-3">
            {activeTab === 'profile' && (
              <div
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold text-gray-900">Profile Information</h1>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                    className="text-blue-600 hover:text-blue-800 flex items-center space-x-2"
                    >
                    <FiEdit2 className="w-4 h-4" />
                    <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
                    </button>
                  </div>
                  
                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Full Name
                        </label>
                      <input
                        type="text"
                          name="name"
                          id="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Email
                        </label>
                      <input
                        type="email"
                          name="email"
                          id="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          id="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+1 (555) 555-5555"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="address.street" className="block text-sm font-medium text-gray-700">
                          Street Address
                        </label>
                        <input
                          type="text"
                          name="address.street"
                          id="address.street"
                          value={formData.address.street}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="address.city" className="block text-sm font-medium text-gray-700">
                          City
                        </label>
                        <input
                          type="text"
                          name="address.city"
                          id="address.city"
                          value={formData.address.city}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="address.state" className="block text-sm font-medium text-gray-700">
                          State
                        </label>
                        <input
                          type="text"
                          name="address.state"
                          id="address.state"
                          value={formData.address.state}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                        <label htmlFor="address.zipCode" className="block text-sm font-medium text-gray-700">
                          ZIP Code
                        </label>
                      <input
                        type="text"
                          name="address.zipCode"
                          id="address.zipCode"
                          value={formData.address.zipCode}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                        <label htmlFor="address.country" className="block text-sm font-medium text-gray-700">
                          Country
                        </label>
                      <input
                        type="text"
                          name="address.country"
                          id="address.country"
                          value={formData.address.country}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>

                    <div className="border-t pt-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Current Password</label>
                          <input
                            type="password"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">New Password</label>
                          <input
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                          <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        {isLoading ? 'Updating...' : 'Update Profile'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Name</h3>
                        <p className="mt-1 text-gray-900">{user?.name || 'Not provided'}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Email</h3>
                        <p className="mt-1 text-gray-900">{user?.email || 'Not provided'}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                        <p className="mt-1 text-gray-900">{user?.phone || 'Not provided'}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Address</h3>
                        <p className="mt-1 text-gray-900">
                          {user?.address?.street || 'Not provided'}<br />
                          {user?.address?.city || 'Not provided'}, {user?.address?.state || 'Not provided'} {user?.address?.zipCode || 'Not provided'}<br />
                          {user?.address?.country || 'Not provided'}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Member Since</h3>
                        <p className="mt-1 text-gray-900">
                          {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Not available'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                </div>
              )}

            {activeTab === 'orders' && (
              <div
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Recent Orders</h2>
                  <button
                    onClick={() => navigate('/orders')}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    View All
                  </button>
                </div>

                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <FiShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No orders yet</p>
                    <button
                      onClick={() => navigate('/shop')}
                      className="mt-4 text-blue-600 hover:text-blue-800"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order._id}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">Order #{order.orderNumber  || 'N/A'}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(order.status)}`}>
                            {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Unknown'}
                          </span>
                        </div>
                        <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <p className="text-sm text-gray-600">
                            Total: ${(order.totalPrice || 0).toFixed(2)}
                          </p>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => navigate(`/order-tracking/${order.orderNumber}`)}
                              className="bg-green-100 text-green-600 hover:bg-green-200 hover:text-green-800 text-sm px-3 py-1 rounded transition"
                            >
                              Track Now
                            </button>
                            {order.status !== 'shipped' && order.status !== 'cancelled' && (
                              <button
                                onClick={async () => {
                                  try {
                                    await api.put(`/orders/${order._id}/cancel`);
                                    toast.success('Order cancelled');
                                    setOrders(prev =>
                                      prev.map(o =>
                                        o._id === order._id
                                          ? { ...o, status: 'cancelled' }
                                          : o
                                      )
                                    );
                                  } catch {
                                    toast.error('Failed to cancel order');
                                  }
                                }}
                                className="bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-800 text-sm px-3 py-1 rounded transition"
                              >
                                Cancel Order
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                </div>
              )}

            {activeTab === 'wishlist' && (
              <div
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Wishlist</h2>
                <div className="text-center py-12">
                  <FiHeart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Your wishlist is empty</p>
                    <button
                    onClick={() => navigate('/shop')}
                    className="mt-4 text-blue-600 hover:text-blue-800"
                    >
                    Browse Products
                    </button>
                </div>
                </div>
              )}

            {activeTab === 'settings' && (
              <div
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h2>
                <div className="space-y-6">
                      <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
                    <div className="space-y-4">
                      <label className="flex items-center">
                        <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
                        <span className="ml-2 text-gray-700">Email notifications</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
                        <span className="ml-2 text-gray-700">Order updates</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
                        <span className="ml-2 text-gray-700">Promotional emails</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Privacy Settings</h3>
                    <div className="space-y-4">
                      <label className="flex items-center">
                        <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
                        <span className="ml-2 text-gray-700">Show my profile to other users</span>
                        </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
                        <span className="ml-2 text-gray-700">Allow product recommendations</span>
                        </label>
                    </div>
                  </div>

                  <div className="pt-6 border-t">
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                          // Handle account deletion
                        }
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete Account
                      </button>
                  </div>
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
