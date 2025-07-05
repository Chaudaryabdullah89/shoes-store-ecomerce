import React, { useState, useEffect } from 'react'
import { useCart } from '../Context/CartContext'
import { useNavigate } from 'react-router-dom'
import { productService } from '../services/productService'

const FREE_SHIPPING_THRESHOLD = 600;

const Cart = () => {
  const { cart, removeFromCart, updateQty, addToCart } = useCart();
  const navigate = useNavigate();
  const [orderNote, setOrderNote] = useState("");
  const [coupon, setCoupon] = useState("");
  const [products, setProducts] = useState([]);

  const total = cart.reduce((sum, item) => sum + item.currentPrice * item.qty, 0);
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - total);
  const shippingProgress = Math.min(100, (total / FREE_SHIPPING_THRESHOLD) * 100);

  useEffect(() => {
    productService.getProducts()
      .then(data => {
        const allProducts = data.products || data;
        setProducts(allProducts);
      })
      .catch(() => setProducts([]));
  }, []);

  const cartIds = cart.map(item => String(item.id));
  const recommendations = products
    .filter(p => !cartIds.includes(String(p._id || p.id)))
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <h1 className='text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8'>Your Shopping Cart</h1>
        
        {!Array.isArray(cart) || cart.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <p className="text-gray-500 text-lg sm:text-xl mb-4">Your cart is empty.</p>
            <button 
              onClick={() => navigate('/')}
              className="bg-black text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded font-bold hover:bg-gray-900 transition text-sm sm:text-base"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 order-2 lg:order-1">
              <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Cart Items ({cart.length})</h2>
                
                {/* Free Shipping Progress */}
                <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <div className="text-xs sm:text-sm mb-2">
                    {amountToFreeShipping > 0
                      ? <>Buy <b>${amountToFreeShipping} USD</b> more to enjoy <b>FREE shipping</b></>
                      : <>You have free shipping!</>
                    }
                  </div>
                  <div className="w-full h-2 sm:h-3 bg-gray-200 rounded-full flex items-center">
                    <div
                      className="h-2 sm:h-3 bg-black rounded-full transition-all"
                      style={{ width: `${shippingProgress}%` }}
                    />
                    <div className="w-4 h-4 sm:w-6 sm:h-6 bg-white border-2 border-black rounded-full flex items-center justify-center -ml-2 sm:-ml-3 z-10">
                      <span className="text-sm sm:text-xl mb-0.5 sm:mb-1 font-bold">+</span>
                    </div>
                  </div>
                </div>

                {/* Cart Items List */}
                <div className="space-y-3 sm:space-y-4">
                  {cart.map((item) => (
                    <div key={item.id + (item.color || '')} className="flex flex-col sm:flex-row gap-3 sm:gap-4 py-3 sm:py-4 border-b">
                      <div className="flex gap-3 sm:gap-4">
                        <img src={item.image} alt={item.name} className="w-16 h-16 sm:w-24 sm:h-24 object-contain rounded flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-base sm:text-lg truncate">{item.name}</div>
                          <div className="text-black font-bold text-base sm:text-lg">${item.currentPrice.toFixed(2)}</div>
                          <div className="text-xs sm:text-sm text-gray-500 mt-1">
                            {item.color && <span>Color: <span className="font-semibold text-gray-700">{item.color}</span></span>}
                            {item.size && <span className="ml-2 sm:ml-4">Size: <span className="font-semibold text-gray-700">{item.size}</span></span>}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between sm:justify-start gap-3 sm:gap-4">
                        <div className="flex items-center">
                          <button
                            className="w-8 h-8 sm:w-10 sm:h-10 border border-gray-300 rounded flex items-center justify-center text-lg sm:text-xl hover:bg-gray-100 transition"
                            onClick={() => updateQty(item.id, Math.max(1, item.qty - 1), item.color)}
                          >-</button>
                          <span className="w-8 sm:w-12 text-center text-base sm:text-lg mx-2">{item.qty}</span>
                          <button
                            className="w-8 h-8 sm:w-10 sm:h-10 border border-gray-300 rounded flex items-center justify-center text-lg sm:text-xl hover:bg-gray-100 transition"
                            onClick={() => updateQty(item.id, item.qty + 1, item.color)}
                          >+</button>
                        </div>
                        <div className="text-right sm:text-left">
                          <div className="font-bold text-base sm:text-lg">${(item.currentPrice * item.qty).toFixed(2)}</div>
                        </div>
                      </div>
                      
                      <button
                        className="text-xs sm:text-sm text-gray-400 underline hover:text-gray-600 transition"
                        onClick={() => removeFromCart(item.id, item.color)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-white rounded-lg shadow p-4 sm:p-6 mt-4 sm:mt-6">
                <div className="font-bold text-base sm:text-lg mb-3 sm:mb-4">You may also like</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  {recommendations && recommendations.length > 0 && recommendations.map((product) => (
                    <div key={product.id || product._id} className="flex flex-col items-center">
                      <img
                        src={
                          product.image ||
                          (Array.isArray(product.images) && product.images[0]?.url) ||
                          "https://via.placeholder.com/300x300?text=No+Image"
                        }
                        alt={product.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-contain mb-2"
                      />
                      <div className="font-semibold text-xs sm:text-sm text-center line-clamp-2">{product.name}</div>
                      <div className="flex items-center gap-1">
                        <span className="text-black font-bold text-xs sm:text-sm">
                          ${product.currentPrice ? product.currentPrice : product.price}
                        </span>
                        {(product.originalPrice > (product.currentPrice || product.price)) && (
                          <span className="text-gray-400 line-through text-xs">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>
                      <button
                        className="text-xs sm:text-sm text-yellow-600 font-bold mt-1 sm:mt-2 hover:text-yellow-700 transition"
                        onClick={() => addToCart(product)}
                      >
                        + Add to Cart
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1 order-1 lg:order-2">
              <div className="bg-white rounded-lg shadow p-4 sm:p-6 lg:sticky lg:top-8">
                <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Order Summary</h2>
                
                {/* Order Note and Coupon */}
                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                  <input
                    className="w-full border rounded px-3 py-2 text-sm"
                    placeholder="Order Note"
                    value={orderNote}
                    onChange={e => setOrderNote(e.target.value)}
                  />
                  <input
                    className="w-full border rounded px-3 py-2 text-sm"
                    placeholder="Coupon"
                    value={coupon}
                    onChange={e => setCoupon(e.target.value)}
                  />
                </div>

                {/* Total */}
                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold text-xl mb-4">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="text-xs text-gray-500 mb-6">
                    Taxes and <span className="underline cursor-pointer">shipping</span> calculated at checkout
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button 
                      onClick={() => navigate('/checkout')}
                      className="w-full bg-black text-white py-3 rounded font-bold hover:bg-gray-900 transition"
                    >
                      Check Out
                    </button>
                    <button 
                      onClick={() => navigate('/')}
                      className="w-full border-2 border-black text-black py-3 rounded font-bold hover:bg-gray-100 transition"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart
