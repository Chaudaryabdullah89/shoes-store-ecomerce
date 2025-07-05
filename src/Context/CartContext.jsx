import React, { useState, useEffect } from "react";
import { CartContext } from "./CartContextProvider";

// Helper functions for localStorage
const getCartFromStorage = () => {
  try {
    const cartData = localStorage.getItem('cart');
    console.log('Raw cart data from localStorage:', cartData);
    
    if (!cartData) return [];
    
    const parsed = JSON.parse(cartData);
    console.log('Parsed cart data:', parsed);
    
    // Ensure the parsed data is an array
    if (!Array.isArray(parsed)) {
      console.warn('Cart data in localStorage is not an array, resetting to empty array');
      console.warn('Type of parsed data:', typeof parsed);
      localStorage.removeItem('cart');
      return [];
    }
    
    // Validate each item has required properties
    const validCart = parsed.filter(item => 
      item && 
      typeof item === 'object' && 
      item.id && 
      item.name && 
      typeof item.currentPrice === 'number' && 
      typeof item.qty === 'number'
    );
    
    if (validCart.length !== parsed.length) {
      console.warn('Some cart items were invalid, filtering them out');
      console.warn('Original length:', parsed.length, 'Valid length:', validCart.length);
      localStorage.setItem('cart', JSON.stringify(validCart));
    }
    
    return validCart;
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
    // Clear corrupted data
    localStorage.removeItem('cart');
    return [];
  }
};

const saveCartToStorage = (cart) => {
  try {
    localStorage.setItem('cart', JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

export const CartProvider = ({ children }) => {
  // Initialize with a function that ensures we always get a valid array
  const [cart, setCart] = useState(() => {
    try {
      const initialCart = getCartFromStorage();
      console.log('Initial cart from storage:', initialCart);
      
      // Double-check that we have a valid array
      if (!Array.isArray(initialCart)) {
        console.warn('Initial cart is not an array, using empty array');
        return [];
      }
      
      return initialCart;
    } catch (error) {
      console.error('Error during cart initialization:', error);
      return [];
    }
  });
  
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Ensure cart is always an array
  useEffect(() => {
    console.log('Cart state changed:', cart);
    console.log('Type of cart:', typeof cart);
    console.log('Is cart array?', Array.isArray(cart));
    
    if (!Array.isArray(cart)) {
      console.warn('Cart state is not an array, resetting to empty array');
      console.warn('Cart value:', cart);
      setCart([]);
      return;
    }
    
    // Additional validation of cart items
    const validCart = cart.filter(item => 
      item && 
      typeof item === 'object' && 
      item.id && 
      item.name && 
      typeof item.currentPrice === 'number' && 
      typeof item.qty === 'number'
    );
    
    if (validCart.length !== cart.length) {
      console.warn('Some cart items are invalid, filtering them out');
      setCart(validCart);
      return;
    }
    
    saveCartToStorage(cart);
  }, [cart]);

  // Add product to cart
  const addToCart = (product, qty = 1, color = null, openDrawer = true) => {
    console.log('addToCart called with:', { product, qty, color });
    console.log('Current cart state:', cart);
    
    setCart(prev => {
      console.log('addToCart setCart callback, prev:', prev);
      console.log('Type of prev:', typeof prev);
      console.log('Is prev array?', Array.isArray(prev));
      
      // Ensure prev is an array with multiple safety checks
      let currentCart;
      try {
        if (!prev) {
          console.warn('prev is null/undefined, using empty array');
          currentCart = [];
        } else if (!Array.isArray(prev)) {
          console.warn('prev is not an array, type:', typeof prev, 'value:', prev);
          currentCart = [];
        } else {
          currentCart = [...prev]; // Create a copy to be safe
        }
      } catch (error) {
        console.error('Error processing prev in addToCart:', error);
        currentCart = [];
      }
      
      console.log('Processed currentCart:', currentCart);
      
      // Validate product
      if (!product || !product.id) {
        console.error('Invalid product provided to addToCart:', product);
        return currentCart;
      }
      
      try {
        // Check if product (and color) already in cart
        const idx = currentCart.findIndex(
          item => item && item.id === product.id && item.color === color
        );
        
        if (idx > -1) {
          // Update quantity
          const updated = [...currentCart];
          updated[idx].qty += qty;
          console.log('Updated existing item, new cart:', updated);
          return updated;
        } else {
          // Add new item
          const newCart = [...currentCart, { ...product, qty, color }];
          console.log('Added new item, new cart:', newCart);
          return newCart;
        }
      } catch (error) {
        console.error('Error in addToCart logic:', error);
        return currentCart;
      }
    });
    if (openDrawer) setIsCartOpen(true);
  };

  // Remove product from cart
  const removeFromCart = (id, color = null) => {
    console.log('removeFromCart called with:', { id, color });
    
    setCart(prev => {
      try {
        if (!prev || !Array.isArray(prev)) {
          console.warn('prev is not an array in removeFromCart, returning empty array');
          return [];
        }
        
        const filtered = prev.filter(item => 
          item && !(item.id === id && item.color === color)
        );
        console.log('Removed item, new cart:', filtered);
        return filtered;
      } catch (error) {
        console.error('Error in removeFromCart:', error);
        return [];
      }
    });
  };

  // Update quantity
  const updateQty = (id, qty, color = null) => {
    console.log('updateQty called with:', { id, qty, color });
    
    setCart(prev => {
      try {
        if (!prev || !Array.isArray(prev)) {
          console.warn('prev is not an array in updateQty, returning empty array');
          return [];
        }
        
        const updated = prev.map(item =>
          item && item.id === id && item.color === color ? { ...item, qty } : item
        );
        console.log('Updated quantity, new cart:', updated);
        return updated;
      } catch (error) {
        console.error('Error in updateQty:', error);
        return [];
      }
    });
  };

  // Clear cart
  const clearCart = () => setCart([]);

  // Reset cart (useful for debugging)
  const resetCart = () => {
    console.log('Resetting cart completely');
    localStorage.removeItem('cart');
    setCart([]);
  };

  // Debug function to check localStorage status
  const debugCart = () => {
    console.log('=== Cart Debug Info ===');
    console.log('Current cart state:', cart);
    console.log('Cart type:', typeof cart);
    console.log('Is cart array?', Array.isArray(cart));
    console.log('Cart length:', cart ? cart.length : 'N/A');
    
    const stored = localStorage.getItem('cart');
    console.log('localStorage cart data:', stored);
    
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        console.log('Parsed localStorage data:', parsed);
        console.log('Parsed type:', typeof parsed);
        console.log('Is parsed array?', Array.isArray(parsed));
      } catch (error) {
        console.error('Error parsing localStorage data:', error);
      }
    }
    console.log('========================');
  };

  // Global reset function (can be called from browser console)
  useEffect(() => {
    window.resetCartData = () => {
      console.log('Global cart reset called');
      localStorage.removeItem('cart');
      window.location.reload();
    };
    
    window.debugCartData = debugCart;
    
    return () => {
      delete window.resetCartData;
      delete window.debugCartData;
    };
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        resetCart,
        debugCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}; 