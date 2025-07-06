import React, { useState } from 'react';
import { useCart } from '../Context/CartContext';
import { X, Trash2, ShoppingBag, ArrowRight, Minus, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const CartDrawer = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [imageLoadingStates, setImageLoadingStates] = useState({});

  const handleImageLoad = (itemId) => {
    setImageLoadingStates(prev => ({
      ...prev,
      [itemId]: false
    }));
  };

  const handleImageError = (itemId) => {
    setImageLoadingStates(prev => ({
      ...prev,
      [itemId]: false
    }));
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => {
    const price = item.discount > 0 
      ? item.price * (1 - item.discount / 100) 
      : item.price;
    return sum + (price * item.quantity);
  }, 0);

  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <ShoppingBag size={24} />
            <h2 className="text-xl font-semibold">Shopping Cart</h2>
            <span className="bg-black text-white text-xs px-2 py-1 rounded-full">
              {totalItems}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🛒</div>
              <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
              <p className="text-gray-500 mb-6">Add some products to get started!</p>
              <button
                onClick={onClose}
                className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={`${item._id}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                  {/* Product Image */}
                  <div className="relative w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    {imageLoadingStates[item._id] !== false && (
                      <div className="absolute inset-0 bg-gray-200 animate-pulse">
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                    )}
                    
                    <img
                      src={item.images?.[0] || '/placeholder-image.jpg'}
                      alt={item.name}
                      className={`w-full h-full object-cover transition-opacity duration-300 ${
                        imageLoadingStates[item._id] !== false ? 'opacity-0' : 'opacity-100'
                      }`}
                      loading="lazy"
                      onLoad={() => handleImageLoad(item._id)}
                      onError={() => handleImageError(item._id)}
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                    <p className="text-sm text-gray-500">
                      Size: {item.selectedSize} | Color: {item.selectedColor}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateQuantity(item._id, item.selectedSize, item.selectedColor, Math.max(1, item.quantity - 1))}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-2 text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item._id, item.selectedSize, item.selectedColor, item.quantity + 1)}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900">
                          ${item.discount > 0 
                            ? (item.price * (1 - item.discount / 100) * item.quantity).toFixed(2)
                            : (item.price * item.quantity).toFixed(2)
                          }
                        </div>
                        {item.discount > 0 && (
                          <div className="text-xs text-gray-500 line-through">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item._id, item.selectedSize, item.selectedColor)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-gray-200 p-4">
            {/* Summary */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal ({totalItems} items)</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <Link
                to="/cart"
                onClick={onClose}
                className="block w-full bg-gray-100 text-gray-900 py-3 px-4 rounded-lg text-center font-medium hover:bg-gray-200 transition-colors"
              >
                View Cart
              </Link>
              <Link
                to="/checkout"
                onClick={onClose}
                className="block w-full bg-black text-white py-3 px-4 rounded-lg text-center font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              >
                Checkout
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;