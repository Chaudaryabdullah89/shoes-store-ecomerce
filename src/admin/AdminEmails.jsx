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
      <div className="max-w-xl mx-auto bg-white shadow-xl rounded-2xl p-10 mt-10 border border-gray-100">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-8">Send Email</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-semibold mb-1">To</label>
            <div className="flex items-center gap-3">
              <input
                type="email"
                name="to"
                value={to}
                onChange={e => setTo(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                placeholder="Recipient email (or leave blank to send to all)"
                disabled={sendToAll}
                required={!sendToAll}
              />
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={sendToAll}
                  onChange={e => setSendToAll(e.target.checked)}
                />
                Send to all users
              </label>
            </div>
          </div>
          <div>
            <label className="block font-semibold mb-1">Subject</label>
            <input
              type="text"
              name="subject"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              required
              maxLength={200}
              placeholder="Email subject"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Message</label>
            <textarea
              name="message"
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full min-h-[120px] focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              required
              maxLength={5000}
              placeholder="Type your message here..."
            />
          </div>
          {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded">{error}</div>}
          {success && <div className="bg-green-100 text-green-700 px-4 py-2 rounded">{success}</div>}
          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              className="bg-yellow-500 text-white px-8 py-3 rounded-lg font-bold shadow hover:bg-yellow-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={sending}
            >
              {sending ? 'Sending...' : 'Send Email'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminEmails; 