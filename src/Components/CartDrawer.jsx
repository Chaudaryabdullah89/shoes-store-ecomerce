import React, { useState } from "react";
import { useCart } from "../Context/CartContext";
import { useNavigate } from "react-router-dom";

const FREE_SHIPPING_THRESHOLD = 600;

const CartDrawer = () => {
  const cartContext = useCart();
  const navigate = useNavigate();
  const [orderNote, setOrderNote] = useState("");
  const [coupon, setCoupon] = useState("");

  // Add null check for cartContext
  if (!cartContext) {
    return (
      <div className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl z-50 flex flex-col">
        <div className="flex justify-between items-center p-4 sm:p-6 border-b">
          <h2 className="text-xl sm:text-2xl font-bold">Shopping Cart</h2>
          <button className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-7 sm:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500 text-center text-sm sm:text-base">Loading cart...</p>
        </div>
      </div>
    );
  }

  const { cart, removeFromCart, updateItemQuantity, getCartTotals } = cartContext;
  const totals = getCartTotals();
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - totals.subtotal);
  const shippingProgress = Math.min(100, (totals.subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <div
      className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 translate-x-full`}
    >
      {/* Header - Mobile optimized */}
      <div className="flex justify-between items-center p-4 sm:p-6 border-b bg-white sticky top-0 z-10">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">Shopping Cart</h2>
        <button className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Free Shipping Progress - Mobile optimized */}
      <div className="px-4 sm:px-6 pt-4 bg-gray-50">
        <div className="text-xs sm:text-sm mb-3 text-center">
          {amountToFreeShipping > 0
            ? <>Buy <b>${amountToFreeShipping.toFixed(2)} USD</b> more to enjoy <b>FREE shipping</b></>
            : <>You have free shipping!</>
          }
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full flex items-center relative">
          <div
            className="h-3 bg-green-500 rounded-full transition-all duration-300"
            style={{ width: `${shippingProgress}%` }}
          />
          <div className="w-6 h-6 bg-white border-2 border-green-500 rounded-full flex items-center justify-center -ml-3 z-10 absolute right-0">
            <span className="text-xs font-bold text-green-600">✓</span>
          </div>
        </div>
      </div>

      {/* Cart Items - Mobile optimized */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
        {!Array.isArray(cart) || cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <p className="text-gray-500 text-lg font-medium mb-2">Your cart is empty</p>
            <p className="text-gray-400 text-sm">Add some items to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => {
              // Ensure price is a number and has a fallback
              const itemPrice = typeof item.price === 'number' ? item.price : 0;
              const itemName = item.name || 'Product';
              const itemImage = item.image || 'https://via.placeholder.com/80x80?text=No+Image';
              const itemId = item.id || item._id; // Use either id or _id
              const itemQuantity = item.quantity || item.qty || 1; // Use either quantity or qty
              
              return (
                <div key={itemId} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex gap-3 sm:gap-4">
                    <img 
                      src={itemImage} 
                      alt={itemName} 
                      className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-lg bg-gray-50" 
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm sm:text-base truncate mb-1">{itemName}</div>
                      <div className="text-black font-bold text-sm sm:text-base mb-2">${itemPrice.toFixed(2)}</div>
                      <div className="text-xs text-gray-500 mb-3">
                        {item.color && <span className="inline-block bg-gray-100 px-2 py-1 rounded mr-2">Color: {item.color}</span>}
                        {item.size && <span className="inline-block bg-gray-100 px-2 py-1 rounded">Size: {item.size}</span>}
                      </div>
                      
                      {/* Quantity Controls - Mobile optimized */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            className="w-8 h-8 sm:w-10 sm:h-10 border border-gray-300 rounded-lg flex items-center justify-center text-lg hover:bg-gray-100 transition-colors"
                            onClick={() => updateItemQuantity(itemId, Math.max(1, itemQuantity - 1))}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="w-8 sm:w-10 text-center text-sm sm:text-base font-semibold">{itemQuantity}</span>
                          <button
                            className="w-8 h-8 sm:w-10 sm:h-10 border border-gray-300 rounded-lg flex items-center justify-center text-lg hover:bg-gray-100 transition-colors"
                            onClick={() => updateItemQuantity(itemId, itemQuantity + 1)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>
                        
                        <div className="text-right">
                          <div className="font-bold text-sm sm:text-base">${(itemPrice * itemQuantity).toFixed(2)}</div>
                          <button
                            className="text-xs text-red-500 hover:text-red-700 underline mt-1"
                            onClick={() => removeFromCart(itemId)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Order Note, Coupon, Shipping - Mobile optimized */}
      <div className="px-4 sm:px-6 py-4 border-t bg-gray-50">
        <div className="space-y-3">
          <input
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Add order note..."
            value={orderNote}
            onChange={e => setOrderNote(e.target.value)}
          />
          <input
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter coupon code..."
            value={coupon}
            onChange={e => setCoupon(e.target.value)}
          />
        </div>
      </div>

      {/* Total and Actions - Mobile optimized */}
      <div className="px-4 sm:px-6 py-4 border-t bg-white">
        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>${(totals.subtotal || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax</span>
            <span>${(totals.tax || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span>{totals.shipping === 0 ? 'FREE' : `$${totals.shipping.toFixed(2)}`}</span>
          </div>
          <div className="border-t pt-2">
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${(totals.total || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <button 
            onClick={() => navigate('/checkout')}
            className="w-full bg-black text-white py-3 sm:py-4 rounded-lg font-bold hover:bg-gray-900 transition-colors text-sm sm:text-base"
          >
            Check Out
          </button>
          <button 
            onClick={() => navigate('/cart')}
            className="w-full border-2 border-black text-black py-3 sm:py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors text-sm sm:text-base"
          >
            View Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;