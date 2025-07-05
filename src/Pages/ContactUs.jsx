import React, { useRef, useState } from 'react';
import {Link} from 'react-router-dom'

const SUBJECT_OPTIONS = [
  'General Inquiry',
  'Product Support',
  'Order Issue',
  'Partnership',
  'Feedback',
  'Other',
];
const HEAR_ABOUT_OPTIONS = [
  'Google Search',
  'Social Media',
  'Friend/Family',
  'Advertisement',
  'Other',
];

const ContactUs = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    customSubject: '',
    message: '',
    hearAbout: '',
    file: null,
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const emailRef = useRef();
  const [copied, setCopied] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleFileChange = e => {
    setForm({ ...form, file: e.target.files[0] });
    setFileName(e.target.files[0]?.name || '');
  };
  const validateEmail = email => /\S+@\S+\.\S+/.test(email);
  const validatePhone = phone => !phone || /^\+?[0-9\-\s]{7,15}$/.test(phone);
  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.message) {
      setError('Name, email, and message are required.');
      return;
    }
    if (!validateEmail(form.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!validatePhone(form.phone)) {
      setError('Please enter a valid phone number.');
      return;
    }
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === 'file' && value) data.append('file', value);
        else if (value) data.append(key, value);
      });
      if (form.subject === 'Other' && form.customSubject) {
        data.set('subject', form.customSubject);
      }
      const res = await fetch('/api/contact', {
        method: 'POST',
        body: data,
      });
      const result = await res.json();
      if (result.success) {
    setSubmitted(true);
      } else {
        setError(result.message || 'Failed to send message.');
      }
    } catch {
      setError('Failed to send message.');
    } finally {
      setLoading(false);
    }
  };
  const handleCopy = () => {
    if (emailRef.current) {
      navigator.clipboard.writeText(emailRef.current.textContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#e0e7ef] to-[#f8fafc] flex flex-col items-center justify-start py-0">
      {/* Hero Section */}
      <div className="relative w-full max-w-full h-56 md:h-72 flex items-center justify-center mb-10  overflow-hidden shadow-lg">
        <img
          src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=1200&q=80"
          alt="Contact Us"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-2 tracking-tight drop-shadow-lg">Contact Us</h1>
          <div className="text-base flex justify-center gap-2 items-center font-medium">
            <span className="opacity-80"><Link to="/" className="hover:underline">Home</Link></span>
            <span className="mx-1">&gt;</span>
            <span className="font-semibold">Contact</span>
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-6xl bg-white/90 rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden border border-gray-100">
        {/* Left: Contact Info */}
        <div className="md:w-2/5 bg-gradient-to-b from-[#f8fafc] to-white p-10 flex flex-col gap-8 border-r border-gray-100">
          <div>
            <h2 className="text-2xl font-extrabold text-black mb-3">Get in Touch</h2>
            <p className="text-gray-600 mb-8 text-base leading-relaxed">
              Have questions or want to partner with us? Our team is here for you 24/7. Expect a personal reply in under 5 minutes.
            </p>
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                {/* Email SVG */}
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-black/5">
                  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black"><rect x="2" y="4" width="18" height="14" rx="2"/><polyline points="22,6 11,13 2,6"/></svg>
                </span>
                <span ref={emailRef} className="select-all text-black font-medium">support@example.com</span>
                <button onClick={handleCopy} className="ml-2 px-2 py-1 text-xs bg-black text-white rounded hover:bg-gray-800 transition" type="button">{copied ? 'Copied!' : 'Copy'}</button>
              </div>
              <div className="flex items-center gap-3">
                {/* Phone SVG */}
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-black/5">
                  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black"><path d="M22 16.92V21a2 2 0 0 1-2.18 2A19.72 19.72 0 0 1 3 5.18 2 2 0 0 1 5 3h4.09a2 2 0 0 1 2 1.72c.13 1.13.37 2.23.72 3.28a2 2 0 0 1-.45 2.11l-1.27 1.27a16 16 0 0 0 6.29 6.29l1.27-1.27a2 2 0 0 1 2.11-.45c1.05.35 2.15.59 3.28.72A2 2 0 0 1 22 16.92z"/></svg>
                </span>
                <a href="tel:+12345678900" className="text-black underline hover:text-gray-700 transition text-sm font-medium">+1 234 567 8900</a>
              </div>
              <div className="flex items-center gap-3">
                {/* Location SVG */}
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-black/5">
                  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                </span>
                <span className="text-gray-700 text-sm block">1234 Heaven Street, USA</span>
              </div>
              <div className="flex items-center gap-3">
                {/* Clock SVG */}
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-black/5">
                  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </span>
                <span className="text-gray-700 text-sm block">Mon-Fri: 9:00am - 6:00pm</span>
              </div>
            </div>
          </div>
          <div>
            <div className="flex gap-4 mt-2">
              {/* Facebook SVG */}
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:scale-110 transition">
                <svg width="28" height="28" fill="currentColor" className="text-black hover:text-blue-600 transition"><path d="M19.5 3h-3A4.5 4.5 0 0 0 12 7.5V9H9.5A1.5 1.5 0 0 0 8 10.5v3A1.5 1.5 0 0 0 9.5 15H12v7.5A1.5 1.5 0 0 0 13.5 24h3A1.5 1.5 0 0 0 18 22.5V15h2.5a1.5 1.5 0 0 0 1.5-1.5v-3A1.5 1.5 0 0 0 20.5 9H18V7.5A1.5 1.5 0 0 1 19.5 6h1A1.5 1.5 0 0 0 22 4.5V4A1 1 0 0 0 21 3h-1.5z"/></svg>
              </a>
              {/* Twitter SVG */}
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:scale-110 transition">
                <svg width="28" height="28" fill="currentColor" className="text-black hover:text-blue-400 transition"><path d="M24 4.557a9.93 9.93 0 0 1-2.828.775A4.932 4.932 0 0 0 23.337 3.1a9.864 9.864 0 0 1-3.127 1.195A4.916 4.916 0 0 0 16.616 3c-2.73 0-4.942 2.21-4.942 4.932 0 .386.045.762.127 1.124C7.728 8.807 4.1 6.884 1.671 3.965a4.822 4.822 0 0 0-.666 2.475c0 1.708.87 3.216 2.188 4.099A4.904 4.904 0 0 1 .964 9.14v.062a4.936 4.936 0 0 0 3.95 4.827 4.996 4.996 0 0 1-2.212.084 4.936 4.936 0 0 0 4.604 3.417A9.867 9.867 0 0 1 0 21.543a13.94 13.94 0 0 0 7.548 2.212c9.057 0 14.009-7.496 14.009-13.986 0-.213-.005-.425-.014-.636A9.936 9.936 0 0 0 24 4.557z"/></svg>
              </a>
              {/* Instagram SVG */}
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:scale-110 transition">
                <svg width="28" height="28" fill="currentColor" className="text-black hover:text-pink-500 transition"><circle cx="14" cy="14" r="10" stroke="currentColor" strokeWidth="2" fill="none"/><rect x="9" y="9" width="10" height="10" rx="5" fill="currentColor"/><circle cx="19.5" cy="8.5" r="1.5" fill="currentColor"/></svg>
              </a>
            </div>
            <div className="mt-8">
              <span className="font-semibold text-black">Our Location:</span>
              <div className="w-full h-36 mt-2 rounded-xl overflow-hidden border border-gray-200 shadow">
                <iframe
                  title="Company Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509374!2d144.9537363153169!3d-37.81627977975171!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d43f1f1f1f1%3A0x5045675218ce6e0!2s1234+Heaven+St%2C+Melbourne+VIC+3000%2C+Australia!5e0!3m2!1sen!2sus!4v1611816611234!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
        {/* Right: Contact Form */}
        <div className="md:w-3/5 p-10 flex flex-col justify-center bg-white/95">
          <h1 className="text-2xl font-extrabold text-black mb-2 text-left">Send Us a Message</h1>
          <p className="text-gray-500 mb-6 text-left">We'd love to hear from you. Fill out the form and our team will respond promptly.</p>
        {submitted ? (
            <div className="text-green-600 font-semibold text-center mt-8 text-lg">
              <svg className="text-green-500 mb-2 block mx-auto" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" stroke="currentColor" fill="none"/>
                <path d="M7 13l3 3 7-7" stroke="currentColor" fill="none"/>
              </svg>
              Thank you for your message!<br />We will get back to you soon.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data" noValidate>
              {error && <div className="text-red-600 font-semibold mb-2">{error}</div>}
              <div className="flex flex-col md:flex-row gap-4">
                <label className="flex-1 font-semibold text-black">
                  Name<span className="text-red-500">*</span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-black bg-white text-black"
              required
            />
                </label>
                <label className="flex-1 font-semibold text-black">
                  Email<span className="text-red-500">*</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-black bg-white text-black"
              required
            />
                </label>
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <label className="flex-1 font-semibold text-black">
                  Phone
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-black bg-white text-black"
                  />
                </label>
                <label className="flex-1 font-semibold text-black">
                  Subject
                  <select
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-black bg-white text-black"
                    required
                  >
                    <option value="">Select a subject</option>
                    {SUBJECT_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </label>
              </div>
              {form.subject === 'Other' && (
                <label className="block font-semibold text-black">
                  Custom Subject
            <input
              type="text"
                    name="customSubject"
                    value={form.customSubject}
              onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-black bg-white text-black"
                    required
                  />
                </label>
              )}
              <label className="block font-semibold text-black">
                How did you hear about us?
                <select
                  name="hearAbout"
                  value={form.hearAbout}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-black bg-white text-black"
                >
                  <option value="">Select an option</option>
                  {HEAR_ABOUT_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </label>
              <label className="block font-semibold text-black">
                Message<span className="text-red-500">*</span>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-black bg-white text-black"
                  rows={5}
              required
            />
              </label>
              <label className="block font-semibold text-black">
                Attachment (optional)
                <input
                  type="file"
                  name="file"
                  accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.txt"
                  onChange={handleFileChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-black bg-white text-black"
                />
                {fileName && <span className="text-xs text-gray-500 ml-2">{fileName}</span>}
              </label>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-black via-gray-900 to-black text-white py-3 rounded-lg font-bold text-lg hover:bg-gray-900 transition disabled:opacity-60 shadow"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin mr-2" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                    Sending...
                  </span>
                ) : (
                  'Send message'
                )}
              </button>
          </form>
        )}
          <div className="mt-8 p-4 bg-gradient-to-r from-gray-50 to-white border-l-4 border-black text-black text-sm rounded-lg text-left shadow-sm">
            <b>Need help?</b> For urgent inquiries, call us at <a href="tel:+12345678900" className="underline">+1 234 567 8900</a> or email <a href="mailto:support@example.com" className="underline">support@example.com</a>.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs; 