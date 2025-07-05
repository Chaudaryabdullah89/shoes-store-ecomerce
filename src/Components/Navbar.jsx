import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useWishlist } from "../Context/WishlistContextProvider";
import { useCart } from "../Context/CartContextProvider";
import { useAuth } from '../Context/useAuth';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { wishlist } = useWishlist();
  const { cart } = useCart();
  const { user } = useAuth();
  const cartCount = Array.isArray(cart) ? cart.reduce((sum, item) => sum + item.qty, 0) : 0;

  // Debug: Log user data in development
  if (import.meta.env.DEV) {
    console.log('User data:', user);
  }

  // Helper function to check if user is admin
  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <div className={`flex justify-between items-center p-5 transition-all duration-300 ${
      isScrolled 
        ? 'fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm shadow-md z-50' 
        : 'relative'
    }`}>
      {/* Logo */}
      <div className='max-w-[130px]'>
        <img src="https://gwath-store-newdemo.myshopify.com/cdn/shop/files/gwath_black.png?v=1748331890" alt="" />
      </div>

      {/* Desktop Navigation */}
      <div className='hidden md:flex gap-8'>
        <Link to='/'>Home</Link>
        <Link to='/Shop'>Shop</Link>
        <Link to='/About'>About</Link>
        <Link to='/Blog'>Blog</Link>
        <Link to='/Contact'>Contact</Link>
      </div>

      {/* Desktop Icons */}
      <div className='hidden md:flex gap-2 items-center'>
        {!user ? (
          <Link to="/login">
            <i className="fa-solid fa-user"></i>
          </Link>
        ) : (
          <>
            <Link to="/youraccount" className="font-semibold mr-4">Profile</Link>
            <Link to="/orders" className="font-semibold mr-4">My Orders</Link>
            {isAdmin() && (
              <Link to="/admin/dashboard" className="font-semibold mr-4 bg-[#ba7a2d] text-white px-3 py-1 rounded-sm hover:bg-[#a06a25] transition-colors">
                Dashboard
              </Link>
            )}
          </>
        )}
        <div className="relative inline-block ml-4">
          <Link to="/cart">
            <i className="fa-solid fa-cart-shopping"></i>
          </Link>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs rounded-full px-2">{cartCount}</span>
          )}
        </div>
        <Link to="/wishlist" className="relative flex items-center ml-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-black">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.293l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.293l-7.682-7.682a4.5 4.5 0 010-6.364z" />
          </svg>
          {wishlist.length > 0 && (
            <span className="absolute top-1 -right-2 bg-pink-500 text-white text-xs rounded-full px-2">{wishlist.length}</span>
          )}
        </Link>
      </div>

      {/* Mobile Icons */}
      <div className='flex md:hidden gap-4 items-center'>
        <div className="relative">
          <Link to="/cart">
            <i className="fa-solid fa-cart-shopping"></i>
          </Link>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs rounded-full px-2">{cartCount}</span>
          )}
        </div>
        <Link to="/wishlist" className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-black">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.293l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.293l-7.682-7.682a4.5 4.5 0 010-6.364z" />
          </svg>
          {wishlist.length > 0 && (
            <span className="absolute top-1 -right-2 bg-pink-500 text-white text-xs rounded-full px-2">{wishlist.length}</span>
          )}
        </Link>
        <button onClick={toggleMobileMenu} className="text-black">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg md:hidden z-50">
          <div className="flex flex-col p-4 space-y-4">
            <Link to='/' className="py-2 hover:text-gray-600" onClick={() => setIsMobileMenuOpen(false)}>
              Home
            </Link>
            <Link to='/Shop' className="py-2 hover:text-gray-600" onClick={() => setIsMobileMenuOpen(false)}>
              Shop
            </Link>
            <Link to='/About' className="py-2 hover:text-gray-600" onClick={() => setIsMobileMenuOpen(false)}>
              About
            </Link>
            <Link to='/Blog' className="py-2 hover:text-gray-600" onClick={() => setIsMobileMenuOpen(false)}>
              Blog
            </Link>
            <Link to='/Contact' className="py-2 hover:text-gray-600" onClick={() => setIsMobileMenuOpen(false)}>
              Contact
            </Link>
            <hr className="my-2" />
            {!user ? (
              <Link to="/login" className="py-2 hover:text-gray-600" onClick={() => setIsMobileMenuOpen(false)}>
                <i className="fa-solid fa-user mr-2"></i>
                Login
              </Link>
            ) : (
              <>
                <Link to="/youraccount" className="py-2 hover:text-gray-600" onClick={() => setIsMobileMenuOpen(false)}>
                  Profile
                </Link>
                <Link to="/orders" className="py-2 hover:text-gray-600" onClick={() => setIsMobileMenuOpen(false)}>
                  My Orders
                </Link>
                {isAdmin() && (
                  <Link to="/admin/dashboard" className="py-2 hover:text-gray-600 bg-[#ba7a2d] text-white px-3 rounded-sm" onClick={() => setIsMobileMenuOpen(false)}>
                    <i className="fa-solid fa-chart-line mr-2"></i>
                    Dashboard
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Navbar
