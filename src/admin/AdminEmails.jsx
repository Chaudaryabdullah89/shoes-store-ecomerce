import React, { useState } from 'react';
import AdminLayout from './components/AdminLayout';
import api from '../services/api';

const AdminEmails = () => {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [sendToAll, setSendToAll] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setSending(true);
    setSuccess('');
    setError('');
    try {
      await api.post('/admin/email', {
        to: sendToAll ? 'all' : to,
        subject,
        message,
      });
      setSuccess('Email sent successfully!');
      setTo('');
      setSubject('');
      setMessage('');
      setSendToAll(false);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        (err?.response?.data?.errors && err.response.data.errors[0]?.msg) ||
        'Failed to send email'
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Email Management</h1>
          <p className="text-gray-600 text-sm sm:text-base">Send emails to customers or all users</p>
        </div>

        {/* Email Form */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Send Email</h2>
              <p className="text-gray-600 text-sm">Compose and send emails to your customers</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Recipient Section */}
              <div className="space-y-3">
                <label className="block font-semibold text-gray-900 text-sm sm:text-base">Recipient</label>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="email"
                      name="to"
                      value={to}
                      onChange={e => setTo(e.target.value)}
                      className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                      placeholder="Enter recipient email address"
                      disabled={sendToAll}
                      required={!sendToAll}
                    />
                  </div>
                  <label className="flex items-center gap-3 text-sm sm:text-base cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sendToAll}
                      onChange={e => setSendToAll(e.target.checked)}
                      className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                    />
                    <span className="text-gray-700">Send to all registered users</span>
                  </label>
                </div>
              </div>

              {/* Subject Section */}
              <div className="space-y-2">
                <label className="block font-semibold text-gray-900 text-sm sm:text-base">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                  required
                  maxLength={200}
                  placeholder="Enter email subject"
                />
                <div className="text-xs text-gray-500 text-right">
                  {subject.length}/200 characters
                </div>
              </div>

              {/* Message Section */}
              <div className="space-y-2">
                <label className="block font-semibold text-gray-900 text-sm sm:text-base">Message</label>
                <textarea
                  name="message"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 min-h-[150px] sm:min-h-[200px] focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors resize-y"
                  required
                  maxLength={5000}
                  placeholder="Type your message here..."
                />
                <div className="text-xs text-gray-500 text-right">
                  {message.length}/5000 characters
                </div>
              </div>

              {/* Status Messages */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Error: {error}</span>
                  </div>
                </div>
              )}
              
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">{success}</span>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-yellow-500 text-white px-6 py-3 rounded-lg font-semibold shadow-sm hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                  disabled={sending}
                >
                  {sending ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Sending...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      <span>Send Email</span>
                    </div>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTo('');
                    setSubject('');
                    setMessage('');
                    setSendToAll(false);
                    setError('');
                    setSuccess('');
                  }}
                  className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors text-sm sm:text-base"
                >
                  Clear Form
                </button>
              </div>
            </form>
          </div>

          {/* Email Tips */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Email Tips
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Keep subject lines clear and concise</li>
              <li>• Personalize messages for better engagement</li>
              <li>• Use "Send to all users" for announcements</li>
              <li>• Test with a single recipient first</li>
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminEmails; 