import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../Admin/components/AdminLayout';
import { userService } from '../services/userService';

const EditCustomer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const data = await userService.getUser(id);
        console.log('Fetched user data:', data);
        if (!data || !data.user) {
          setError('User not found.');
          setLoading(false);
          return;
        }
        setForm(data.user);
      } catch {
        setError('Failed to load user');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      await userService.updateUser(id, form);
      setSuccess('Customer updated successfully!');
      setTimeout(() => navigate('/admin/customers'), 1200);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        (err?.response?.data?.errors && err.response.data.errors[0]?.msg) ||
        'Failed to update customer'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (error) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded border border-red-200 flex items-center gap-2">
            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 9v2m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0z" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (loading || !form) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-yellow-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-xl mx-auto bg-white shadow-xl rounded-2xl p-10 mt-10 border border-gray-100">
        <div className="flex items-center mb-8 gap-3">
          <button
            type="button"
            className="text-gray-500 hover:text-yellow-600 transition"
            onClick={() => navigate('/admin/customers')}
            aria-label="Back"
          >
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
              <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Edit Customer</h1>
        </div>
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 border border-red-200 flex items-center gap-2">
            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 9v2m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4 border border-green-200 flex items-center gap-2">
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M5 13l4 4L19 7" />
            </svg>
            <span>{success}</span>
          </div>
        )}
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="mb-4">
            <label className="block font-semibold mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={form.name || ''}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              required
              maxLength={100}
              placeholder="Customer name"
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email || ''}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              required
              placeholder="Email address"
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              value={form.phone || ''}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              placeholder="Phone number"
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Status</label>
            <select
              name="isActive"
              value={form.isActive ? 'active' : 'inactive'}
              onChange={e => setForm(f => ({ ...f, isActive: e.target.value === 'active' }))}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-yellow-400 focus:outline-none"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          {/* Avatar preview (read-only) */}
          <div className="mb-8">
            <label className="block font-semibold mb-1">Avatar</label>
            <img
              src={form.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name || 'User')}&background=F3F4F6&color=374151&size=96&bold=true`}
              alt={form.name}
              onError={e => { e.target.onerror = null; e.target.src = '/download.png'; }}
              className="w-20 h-20 object-cover rounded-full bg-gray-100 border"
            />
          </div>
          <div className="flex gap-4 mt-8">
            <button
              type="submit"
              className="bg-yellow-500 text-white px-8 py-3 rounded-lg font-bold shadow hover:bg-yellow-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={submitting}
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                  Saving...
                </span>
              ) : 'Save Changes'}
            </button>
            <button
              type="button"
              className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg font-bold shadow hover:bg-gray-200 transition"
              onClick={() => navigate('/admin/customers')}
              disabled={submitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default EditCustomer; 