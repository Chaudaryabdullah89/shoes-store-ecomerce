import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { cartService } from '../services/cartService';
import { toast } from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Sync cart with server when user logs in
  useEffect(() => {
    if (user && cart.length > 0) {
      syncCartToServer();
    }
  }, [user]);

  // Add item to cart
  const addToCart = async (product, quantity = 1, color = null, size = null) => {
    console.log('Adding to cart:', { product, quantity, color, size });
    
    try {
      // Ensure we have a valid product ID
      const productId = product._id || product.id;
      if (!productId) {
        console.error('No valid product ID found:', product);
        toast.error('Invalid product data');
        return;
      }

      const cartItem = {
        id: productId,
        _id: productId, // Add _id for consistency
        name: product.name,
        price: product.price || product.currentPrice || 0,
        currentPrice: product.price || product.currentPrice || 0, // Add currentPrice for checkout
        image: product.images?.[0]?.url || product.image || '',
        quantity: quantity,
        qty: quantity, // Add qty for checkout compatibility
        color: color,
        size: size,
        maxQuantity: Math.min(product.stock || 10, 10)
      };

      console.log('Cart item to add:', cartItem);

      setCart(prevCart => {
        console.log('Previous cart:', prevCart);
        
        const existingItemIndex = prevCart.findIndex(item => 
          (item.id === cartItem.id || item._id === cartItem.id) && 
          item.color === cartItem.color && 
          item.size === cartItem.size
        );

        if (existingItemIndex > -1) {
          // Update existing item
          const updatedCart = [...prevCart];
          updatedCart[existingItemIndex].quantity += quantity;
          updatedCart[existingItemIndex].qty += quantity; // Update qty as well
          if (updatedCart[existingItemIndex].quantity > updatedCart[existingItemIndex].maxQuantity) {
            updatedCart[existingItemIndex].quantity = updatedCart[existingItemIndex].maxQuantity;
            updatedCart[existingItemIndex].qty = updatedCart[existingItemIndex].maxQuantity;
          }
          console.log('Updated existing item, new cart:', updatedCart);
          return updatedCart;
        } else {
          // Add new item
          const newCart = [...prevCart, cartItem];
          console.log('Added new item, new cart:', newCart);
          return newCart;
        }
      });

      toast.success('Added to cart!');

      // If user is logged in, sync to server
      if (user) {
        try {
          console.log('User is logged in, syncing to server');
          console.log('User data:', user);
          console.log('Token available:', !!localStorage.getItem('token'));
          
          console.log('Syncing to server with productId:', productId);
          
          // Validate productId before sending
          if (!productId || productId === 'undefined' || productId === 'null') {
            console.error('Invalid productId:', productId);
            toast.error('Invalid product data');
            return;
          }
          
          await cartService.addToCart(productId, quantity, color, size);
        } catch (error) {
          console.error('Failed to sync to server:', error);
          toast.error('Added to local cart. Please check your connection.');
        }
      } else {
        console.log('User not logged in, only adding to local cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  // Update item quantity
  const updateItemQuantity = async (itemId, newQuantity) => {
    setCart(prevCart => 
      prevCart.map(item => 
        (item.id === itemId || item._id === itemId)
          ? { 
              ...item, 
              quantity: Math.max(1, Math.min(newQuantity, item.maxQuantity)),
              qty: Math.max(1, Math.min(newQuantity, item.maxQuantity)) // Update qty as well
            }
          : item
      )
    );

    // If user is logged in, sync to server
    if (user) {
      try {
        await cartService.updateItemQuantity(itemId, newQuantity);
      } catch (error) {
        console.error('Failed to sync quantity to server:', error);
      }
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId) => {
    setCart(prevCart => prevCart.filter(item => 
      item.id !== itemId && item._id !== itemId
    ));

    // If user is logged in, sync to server
    if (user) {
      try {
        await cartService.removeFromCart(itemId);
      } catch (error) {
        console.error('Failed to sync removal to server:', error);
      }
    }
  };

  // Clear cart
  const clearCart = async () => {
    setCart([]);

    // If user is logged in, sync to server
    if (user) {
      try {
        await cartService.clearCart();
      } catch (error) {
        console.error('Failed to sync clear cart to server:', error);
      }
    }
  };

  // Sync local cart to server
  const syncCartToServer = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Clear server cart first
      await cartService.clearCart();
      
      // Add each local item to server
      for (const item of cart) {
        await cartService.addToCart(item.id, item.quantity, item.color, item.size);
      }
    } catch (error) {
      console.error('Failed to sync cart to server:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load cart from server
  const loadCartFromServer = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await cartService.getCart();
      if (response.success && response.cart?.items) {
        const serverCart = response.cart.items.map(item => ({
          id: item.product,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: item.quantity,
          color: item.color,
          size: item.size,
          maxQuantity: item.maxQuantity || 10
        }));
        setCart(serverCart);
      }
    } catch (error) {
      console.error('Failed to load cart from server:', error);
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
    syncCartToServer,
    loadCartFromServer,
    getCartTotals,
    getCartCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 