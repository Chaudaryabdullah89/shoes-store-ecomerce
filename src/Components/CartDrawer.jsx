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
      {/* Header */}
      <div className="flex justify-between items-center p-4 sm:p-6 border-b">
        <h2 className="text-xl sm:text-2xl font-bold">Shopping Cart</h2>
        <button className="text-gray-500 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-7 sm:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Free Shipping Progress */}
      <div className="px-4 sm:px-6 pt-4">
        <div className="text-xs sm:text-sm mb-2">
          {amountToFreeShipping > 0
            ? <>Buy <b>${amountToFreeShipping.toFixed(2)} USD</b> more to enjoy <b>FREE shipping</b></>
            : <>You have free shipping!</>
          }
        </div>
        <div className="w-full h-2 sm:h-3 bg-gray-200 rounded-full flex items-center">
          <div
            className="h-2 sm:h-3 bg-black rounded-full transition-all"
            style={{ width: `${shippingProgress}%` }}
          />
          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white border-2 border-black rounded-full flex items-center justify-center -ml-2 sm:-ml-3 z-10">
            <span className="text-lg sm:text-xl mb-1 font-bold">+</span>
          </div>
        </div>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
        {!Array.isArray(cart) || cart.length === 0 ? (
          <p className="text-gray-500 text-center mt-8 text-sm sm:text-base">Your cart is empty.</p>
        ) : (
          cart.map((item) => {
            // Ensure price is a number and has a fallback
            const itemPrice = typeof item.price === 'number' ? item.price : 0;
            const itemName = item.name || 'Product';
            const itemImage = item.image || 'https://via.placeholder.com/80x80?text=No+Image';
            
            return (
              <div key={item._id} className="flex gap-3 sm:gap-4 py-4 sm:py-6 border-b">
                <img src={itemImage} alt={itemName} className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm sm:text-base truncate">{itemName}</div>
                  <div className="text-black font-bold text-sm sm:text-base">${itemPrice.toFixed(2)}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {item.color && <span>Color: <span className="font-semibold text-gray-700">{item.color}</span></span>}
                    {item.size && <span className="ml-2">Size: <span className="font-semibold text-gray-700">{item.size}</span></span>}
                  </div>
                  <div className="flex items-center mt-2">
                    <button
                      className="w-6 h-6 sm:w-8 sm:h-8 border border-gray-300 rounded flex items-center justify-center text-lg sm:text-xl"
                      onClick={() => updateItemQuantity(item._id, Math.max(1, (item.quantity || 1) - 1))}
                    >-</button>
                    <span className="w-6 sm:w-8 text-center text-sm sm:text-base">{item.quantity || 1}</span>
                    <button
                      className="w-6 h-6 sm:w-8 sm:h-8 border border-gray-300 rounded flex items-center justify-center text-lg sm:text-xl"
                      onClick={() => updateItemQuantity(item._id, (item.quantity || 1) + 1)}
                    >+</button>
                  </div>
                  <button
                    className="text-xs text-gray-400 underline mt-2"
                    onClick={() => removeFromCart(item._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Order Note, Coupon, Shipping */}
      <div className="px-4 sm:px-6 py-4 border-b flex flex-col gap-2">
        <input
          className="border rounded px-3 py-2 text-xs sm:text-sm"
          placeholder="Order Note"
          value={orderNote}
          onChange={e => setOrderNote(e.target.value)}
        />
        <input
          className="border rounded px-3 py-2 text-xs sm:text-sm"
          placeholder="Coupon"
          value={coupon}
          onChange={e => setCoupon(e.target.value)}
        />
      
      </div>

      {/* Total and Actions */}
      <div className="px-4 sm:px-6 py-4">
        <div className="flex justify-between font-bold text-base sm:text-lg mb-2">
          <span>Total</span>
          <span>${(totals.total || 0).toFixed(2)}</span>
        </div>
        <div className="text-xs text-gray-500 mb-4">
          Taxes and <span className="underline cursor-pointer">shipping</span> calculated at checkout
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button 
            onClick={() => {
              navigate('/checkout');
            }}
            className="w-full bg-black text-white py-3 rounded font-bold hover:bg-gray-900 transition text-sm sm:text-base"
          >
            Check Out
          </button>
          <button 
            onClick={() => {
              navigate('/cart');
            }}
            className="w-full border-2 border-black text-black py-3 rounded font-bold hover:bg-gray-100 transition text-sm sm:text-base"
          >
            View Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;