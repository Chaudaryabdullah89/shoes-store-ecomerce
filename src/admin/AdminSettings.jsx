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
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Admin Settings</h1>
          <p className="text-gray-600 text-sm sm:text-base">Manage your admin account and preferences</p>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Profile Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Profile Settings</h2>
              <p className="text-gray-600 text-sm">Update your profile information and avatar</p>
            </div>

            <form onSubmit={handleProfileSave} className="space-y-6">
              {/* Avatar Section */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-shrink-0">
                  <img
                    src={profile.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(profile.name || 'Admin') + '&background=F3F4F6&color=374151&size=96&bold=true'}
                    alt={profile.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-full bg-gray-100 border-2 border-gray-200"
                  />
                </div>
                <div className="flex-1">
                  <label className="block font-semibold text-gray-900 text-sm sm:text-base mb-2">Profile Picture</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="file" 
                      accept="image/*" 
                      ref={fileInputRef} 
                      onChange={handleAvatarChange} 
                      className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100" 
                      disabled={avatarUploading} 
                    />
                    {avatarUploading && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-500"></div>
                        <span>Uploading...</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Name Field */}
              <div className="space-y-2">
                <label className="block font-semibold text-gray-900 text-sm sm:text-base">Name</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleProfileChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                  required
                  maxLength={100}
                  placeholder="Enter your name"
                />
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="block font-semibold text-gray-900 text-sm sm:text-base">Email</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                  required
                  placeholder="Enter your email address"
                />
              </div>

              {/* Status Messages */}
              {profileError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">{profileError}</span>
                  </div>
                </div>
              )}
              
              {profileSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">{profileSuccess}</span>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <button
                type="submit"
                className="w-full bg-yellow-500 text-white px-6 py-3 rounded-lg font-semibold shadow-sm hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                disabled={profileLoading}
              >
                {profileLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Saving...</span>
                  </div>
                ) : (
                  'Save Profile Changes'
                )}
              </button>
            </form>
          </div>

          {/* Password Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Change Password</h2>
              <p className="text-gray-600 text-sm">Update your account password</p>
            </div>

            <form onSubmit={handlePasswordSave} className="space-y-6">
              {/* Current Password */}
              <div className="space-y-2">
                <label className="block font-semibold text-gray-900 text-sm sm:text-base">Current Password</label>
                <input
                  type="password"
                  name="oldPassword"
                  value={passwords.oldPassword}
                  onChange={handlePasswordChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                  required
                  placeholder="Enter your current password"
                />
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <label className="block font-semibold text-gray-900 text-sm sm:text-base">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwords.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                  required
                  minLength={6}
                  placeholder="Enter new password (min 6 characters)"
                />
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="block font-semibold text-gray-900 text-sm sm:text-base">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwords.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                  required
                  minLength={6}
                  placeholder="Confirm your new password"
                />
              </div>

              {/* Status Messages */}
              {passwordError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">{passwordError}</span>
                  </div>
                </div>
              )}
              
              {passwordSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">{passwordSuccess}</span>
                  </div>
                </div>
              )}

              {/* Change Password Button */}
              <button
                type="submit"
                className="w-full bg-yellow-500 text-white px-6 py-3 rounded-lg font-semibold shadow-sm hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                disabled={passwordLoading}
              >
                {passwordLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Changing...</span>
                  </div>
                ) : (
                  'Change Password'
                )}
              </button>
            </form>
          </div>

          {/* Security Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Security Tips
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Use a strong, unique password</li>
              <li>• Enable two-factor authentication if available</li>
              <li>• Keep your admin credentials secure</li>
              <li>• Log out when using shared devices</li>
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings; 