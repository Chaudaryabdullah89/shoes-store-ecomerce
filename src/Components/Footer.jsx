import React from 'react';

const socialIcons = [
  { name: 'X', svg: <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#f5f5f5"/><text x="7" y="17" fontSize="14" fontWeight="bold">X</text></svg> },
  { name: 'Globe', svg: <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#f5f5f5"/><circle cx="12" cy="12" r="7" stroke="#222" strokeWidth="1.5"/><path d="M12 5v14M5 12h14" stroke="#222" strokeWidth="1.2"/></svg> },
  { name: 'Behance', svg: <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#f5f5f5"/><text x="5" y="17" fontSize="14" fontWeight="bold">Bē</text></svg> },
  { name: 'Instagram', svg: <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#f5f5f5"/><rect x="7" y="7" width="10" height="10" rx="3" stroke="#222" strokeWidth="1.2"/><circle cx="17" cy="7" r="1" fill="#222"/></svg> },
];

const paymentIcons = [
  { name: 'MasterCard', svg: <svg width="32" height="20" viewBox="0 0 32 20"><circle cx="12" cy="10" r="8" fill="#f79e1b"/><circle cx="20" cy="10" r="8" fill="#eb001b" fillOpacity=".7"/></svg> },
  { name: 'Visa', svg: <svg width="32" height="20" viewBox="0 0 32 20"><rect width="32" height="20" rx="4" fill="#fff"/><text x="6" y="15" fontSize="14" fontWeight="bold" fill="#1a1f71">VISA</text></svg> },
  { name: 'PayPal', svg: <svg width="32" height="20" viewBox="0 0 32 20"><rect width="32" height="20" rx="4" fill="#fff"/><text x="4" y="15" fontSize="14" fontWeight="bold" fill="#003087">PP</text></svg> },
];

const Footer = () => (
  <footer className="bg-[#fafafa] my-20 border-t border-gray-200 pt-10 pb-2 text-gray-800 text-sm">
    <div className="max-w-7xl mx-auto px-4">
      {/* Social Icons */}
      <div className="flex justify-center gap-4 mb-8">
        {socialIcons.map(icon => (
          <button key={icon.name} className="hover:scale-110 transition-transform">{icon.svg}</button>
        ))}
      </div>
      {/* Main Footer Content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
        {/* About Us */}
        <div>
          <h3 className="font-bold mb-3 tracking-wide">ABOUT US</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:underline">Sitemap</a></li>
            <li><a href="#" className="hover:underline">Privacy Policy</a></li>
            <li><a href="#" className="hover:underline">Your Account</a></li>
            <li><a href="#" className="hover:underline">Advanced Search</a></li>
            <li><a href="#" className="hover:underline">Term & Condition</a></li>
            <li><a href="#" className="hover:underline">Contact Us</a></li>
          </ul>
        </div>
        {/* Categories */}
        <div>
          <h3 className="font-bold mb-3 tracking-wide">CATEGORIES</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:underline">Custom Service</a></li>
            <li><a href="#" className="hover:underline">F.A.Q.'s</a></li>
            <li><a href="#" className="hover:underline">Ordering Tracking</a></li>
            <li><a href="#" className="hover:underline">Contact Us</a></li>
            <li><a href="#" className="hover:underline">Events</a></li>
            <li><a href="#" className="hover:underline">Popular</a></li>
          </ul>
        </div>
        {/* Let Us Help You */}
        <div>
          <h3 className="font-bold mb-3 tracking-wide">LET US HELP YOU</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:underline">About Us</a></li>
            <li><a href="#" className="hover:underline">Delivery Information</a></li>
            <li><a href="#" className="hover:underline">Privacy Policy</a></li>
            <li><a href="#" className="hover:underline">Discount</a></li>
            <li><a href="#" className="hover:underline">Custom Service</a></li>
            <li><a href="#" className="hover:underline">Term & Condition</a></li>
          </ul>
        </div>
        {/* Contact */}
        <div>
          <h3 className="font-bold mb-3 tracking-wide">CONTACT</h3>
          <div className="mb-2">
            <span className="font-semibold">Address</span><br/>
            1234 Heaven Stress, USA.
          </div>
          <div className="mb-2">
            <span className="font-semibold">Open Hours</span><br/>
            Monday – Saturday: 8:00 am – 4:00pm<br/>
            Sunday: Close
          </div>
        </div>
      </div>
      {/* Payment Icons and Copyright */}
      <div className="flex flex-col md:flex-row items-center justify-between border-t border-gray-100 pt-4 mt-4 gap-2">
        <div className="flex gap-4 mb-2 md:mb-0">
          {paymentIcons.map(icon => (
            <span key={icon.name}>{icon.svg}</span>
          ))}
        </div>
        <div className="text-gray-400 text-xs text-center md:text-right">
          © Copyright 2025 | Gwath 
        </div>
      </div>
    </div>
  </footer>
);

export default Footer; 