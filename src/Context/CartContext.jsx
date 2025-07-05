import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './useAuth';
import { cartService } from '../services/cartService';

const CartContext = createContext();

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Load cart from backend when user logs in
  useEffect(() => {
    if (user) {
      // When user logs in, sync local cart to server first, then load from server
      syncLocalCartToServer().then(() => {
        loadCartFromServer();
      });
    } else {
      // Clear cart when user logs out
      setCart([]);
    }
  }, [user]);

  // Initialize local cart from localStorage when app starts
  useEffect(() => {
    if (!user) {
      const localCart = JSON.parse(localStorage.getItem('localCart') || '[]');
      setCart(localCart);
    }
  }, []);

  // Load cart from server
  const loadCartFromServer = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await cartService.getCart();
      if (response.success) {
        setCart(response.cart.items || []);
      }
    } catch (err) {
      console.error('Error loading cart:', err);
      setError('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart
  const addToCart = async (product, quantity = 1, color = null, size = null) => {
    if (!user) {
      // If not logged in, add to local storage
      addToLocalCart(product, quantity, color, size);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await cartService.addToCart(
        product._id || product.id,
        quantity,
        color,
        size
      );
      if (response.success) {
        setCart(response.cart.items || []);
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
      setError('Failed to add item to cart');
    } finally {
      setLoading(false);
    }
  };

  // Add to local cart (when user is not logged in)
  const addToLocalCart = (product, quantity = 1, color = null, size = null) => {
    const existingItemIndex = cart.findIndex(item => 
      item.product === (product._id || product.id) &&
      item.color === color &&
      item.size === size
    );

    let updatedCart;
    if (existingItemIndex > -1) {
      updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += quantity;
    } else {
      const newItem = {
        _id: Date.now().toString(), // Temporary ID for local cart
        product: product._id || product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        color: color,
        size: size,
        image: product.images?.[0]?.url || product.image || '',
        sku: product.sku,
        inStock: product.stock > 0,
        maxQuantity: Math.min(product.stock || 10, 10)
      };
      updatedCart = [...cart, newItem];
    }
    
    setCart(updatedCart);
    // Save to localStorage
    localStorage.setItem('localCart', JSON.stringify(updatedCart));
  };

  // Update item quantity
  const updateItemQuantity = async (itemId, quantity) => {
    if (!user) {
      // Update local cart
      const updatedCart = cart.map(item => 
        item._id === itemId 
          ? { ...item, quantity: Math.max(1, Math.min(quantity, item.maxQuantity || 10)) }
          : item
      );
      setCart(updatedCart);
      localStorage.setItem('localCart', JSON.stringify(updatedCart));
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await cartService.updateItemQuantity(itemId, quantity);
      if (response.success) {
        setCart(response.cart.items || []);
      }
    } catch (err) {
      console.error('Error updating cart item:', err);
      setError('Failed to update cart item');
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId) => {
    if (!user) {
      // Remove from local cart
      const updatedCart = cart.filter(item => item._id !== itemId);
      setCart(updatedCart);
      localStorage.setItem('localCart', JSON.stringify(updatedCart));
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await cartService.removeFromCart(itemId);
      if (response.success) {
        setCart(response.cart.items || []);
      }
    } catch (err) {
      console.error('Error removing cart item:', err);
      setError('Failed to remove item from cart');
    } finally {
      setLoading(false);
    }
  };

  // Clear cart
  const clearCart = async () => {
    if (!user) {
      setCart([]);
      localStorage.removeItem('localCart');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await cartService.clearCart();
      if (response.success) {
        setCart([]);
      }
    } catch (err) {
      console.error('Error clearing cart:', err);
      setError('Failed to clear cart');
    } finally {
      setLoading(false);
    }
  };

  // Sync local cart to server when user logs in
  const syncLocalCartToServer = async () => {
    if (!user) return;

    // Get local cart from localStorage
    const localCart = JSON.parse(localStorage.getItem('localCart') || '[]');
    
    if (localCart.length === 0) return;

    setLoading(true);
    try {
      // Add each local cart item to server
      for (const item of localCart) {
        try {
          await cartService.addToCart(
            item.product,
            item.quantity,
            item.color,
            item.size
          );
        } catch (err) {
          console.error('Error syncing cart item:', err);
        }
      }
      // Clear local cart after successful sync
      localStorage.removeItem('localCart');
    } catch (err) {
      console.error('Error syncing cart:', err);
      setError('Failed to sync cart');
    } finally {
      setLoading(false);
    }
  };

  // Calculate cart totals
  const getCartTotals = () => {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const tax = subtotal * 0.085; // 8.5% tax
    const shipping = subtotal >= 50 ? 0 : 5.99;
    const total = subtotal + tax + shipping;
    
    return {
      subtotal,
      tax,
      shipping,
      total
    };
  };

  // Get cart count
  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cart,
    loading,
    error,
    addToCart,
    updateItemQuantity,
    removeFromCart,
    clearCart,
    syncLocalCartToServer,
    getCartTotals,
    getCartCount,
    loadCartFromServer
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext; 