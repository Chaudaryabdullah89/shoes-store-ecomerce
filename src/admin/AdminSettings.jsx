import React, { useState, useRef } from 'react';
import AdminLayout from './components/AdminLayout';
import api from '../services/api';

const getAdminUser = () => JSON.parse(localStorage.getItem('adminUser') || '{}');

const AdminSettings = () => {
  const [profile, setProfile] = useState({ name: getAdminUser().name || '', email: getAdminUser().email || '', avatar: getAdminUser().avatar?.url || '' });
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const fileInputRef = useRef();

  // Handle profile field changes
  const handleProfileChange = e => {
    const { name, value } = e.target;
    setProfile(p => ({ ...p, [name]: value }));
  };

  // Handle avatar upload
  const handleAvatarChange = async e => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await api.post('/admin/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setProfile(p => ({ ...p, avatar: res.data.url }));
    } catch {
      setProfileError('Avatar upload failed');
    } finally {
      setAvatarUploading(false);
    }
  };

  // Save profile changes
  const handleProfileSave = async e => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileSuccess('');
    setProfileError('');
    try {
      const adminUser = getAdminUser();
      const res = await api.put(`/admin/users/${adminUser.id}`, {
        name: profile.name,
        email: profile.email,
        avatar: { url: profile.avatar },
      });
      setProfileSuccess('Profile updated successfully!');
      localStorage.setItem('adminUser', JSON.stringify(res.data.user));
    } catch (err) {
      setProfileError(err?.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  // Handle password field changes
  const handlePasswordChange = e => {
    const { name, value } = e.target;
    setPasswords(p => ({ ...p, [name]: value }));
  };

  // Change password (requires backend endpoint)
  const handlePasswordSave = async e => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordSuccess('');
    setPasswordError('');
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordError('New passwords do not match');
      setPasswordLoading(false);
      return;
    }
    try {
      // You need to implement this endpoint in your backend
      await api.post('/admin/change-password', {
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword,
      });
      setPasswordSuccess('Password changed successfully!');
      setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPasswordError(err?.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-2xl p-10 mt-10 border border-gray-100">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-8">Admin Settings</h1>
        {/* Profile Form */}
        <form onSubmit={handleProfileSave} className="space-y-6 mb-12">
          <div className="flex items-center gap-6 mb-4">
            <div>
              <img
                src={profile.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(profile.name || 'Admin') + '&background=F3F4F6&color=374151&size=96&bold=true'}
                alt={profile.name}
                className="w-20 h-20 object-cover rounded-full bg-gray-100 border"
              />
            </div>
            <div>
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleAvatarChange} className="block" disabled={avatarUploading} />
              {avatarUploading && <div className="text-xs text-gray-500 mt-1">Uploading...</div>}
            </div>
          </div>
          <div>
            <label className="block font-semibold mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleProfileChange}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              required
              maxLength={100}
              placeholder="Admin name"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleProfileChange}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              required
              placeholder="Email address"
            />
          </div>
          {profileError && <div className="bg-red-100 text-red-700 px-4 py-2 rounded">{profileError}</div>}
          {profileSuccess && <div className="bg-green-100 text-green-700 px-4 py-2 rounded">{profileSuccess}</div>}
          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              className="bg-yellow-500 text-white px-8 py-3 rounded-lg font-bold shadow hover:bg-yellow-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={profileLoading}
            >
              {profileLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
        {/* Change Password Form */}
        <form onSubmit={handlePasswordSave} className="space-y-6">
          <h2 className="text-xl font-bold mb-2">Change Password</h2>
          <div>
            <label className="block font-semibold mb-1">Current Password</label>
            <input
              type="password"
              name="oldPassword"
              value={passwords.oldPassword}
              onChange={handlePasswordChange}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              required
              placeholder="Enter current password"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={passwords.newPassword}
              onChange={handlePasswordChange}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              required
              minLength={6}
              placeholder="Enter new password"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={passwords.confirmPassword}
              onChange={handlePasswordChange}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              required
              minLength={6}
              placeholder="Confirm new password"
            />
          </div>
          {passwordError && <div className="bg-red-100 text-red-700 px-4 py-2 rounded">{passwordError}</div>}
          {passwordSuccess && <div className="bg-green-100 text-green-700 px-4 py-2 rounded">{passwordSuccess}</div>}
          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              className="bg-yellow-500 text-white px-8 py-3 rounded-lg font-bold shadow hover:bg-yellow-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={passwordLoading}
            >
              {passwordLoading ? 'Saving...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings; 