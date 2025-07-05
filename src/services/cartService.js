import api from './api';

export const cartService = {
  // Get user's cart
  getCart: async () => {
    const response = await api.get('/cart');
    return response.data;
  },

  // Add item to cart
  addToCart: async (productId, quantity = 1, color = null, size = null) => {
    console.log('cartService.addToCart called with:', { productId, quantity, color, size });
    console.log('Token available:', !!localStorage.getItem('token'));
    console.log('ProductId type:', typeof productId);
    console.log('ProductId value:', productId);
    
    try {
      const requestBody = {
        productId,
        quantity,
        color,
        size
      };
      console.log('Request body being sent:', requestBody);
      
      const response = await api.post('/cart/items', requestBody);
      console.log('cartService.addToCart response:', response.data);
      return response.data;
    } catch (error) {
      console.error('cartService.addToCart error:', error.response?.data || error.message);
      console.error('Full error object:', error);
      console.error('Error response data:', error.response?.data);
      console.error('Error response status:', error.response?.status);
      console.error('Error response headers:', error.response?.headers);
      throw error;
    }
  },

  // Update item quantity
  updateItemQuantity: async (itemId, quantity) => {
    const response = await api.put(`/cart/items/${itemId}`, {
      quantity
    });
    return response.data;
  },

  // Remove item from cart
  removeFromCart: async (itemId) => {
    const response = await api.delete(`/cart/items/${itemId}`);
    return response.data;
  },

  // Clear cart
  clearCart: async () => {
    const response = await api.delete('/cart');
    return response.data;
  },

  // Apply coupon
  applyCoupon: async (couponCode) => {
    const response = await api.post('/cart/coupon', {
      code: couponCode
    });
    return response.data;
  },

  // Remove coupon
  removeCoupon: async () => {
    const response = await api.delete('/cart/coupon');
    return response.data;
  },

  // Update shipping address
  updateShippingAddress: async (address) => {
    const response = await api.put('/cart/shipping', address);
    return response.data;
  }
};

export default cartService; 