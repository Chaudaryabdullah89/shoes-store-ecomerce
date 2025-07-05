import api from './api';

export const wishlistService = {
  // Get user wishlist
  getWishlist: async () => {
    const response = await api.get('/wishlist');
    return response.data;
  },

  // Add item to wishlist
  addToWishlist: async (productId) => {
    const response = await api.post('/wishlist/items', { productId });
    return response.data;
  },

  // Remove item from wishlist
  removeFromWishlist: async (productId) => {
    const response = await api.delete(`/wishlist/items/${productId}`);
    return response.data;
  },

  // Clear wishlist
  clearWishlist: async () => {
    const response = await api.delete('/wishlist');
    return response.data;
  },

  // Check if item is in wishlist
  checkWishlist: async (productId) => {
    const response = await api.get(`/wishlist/check/${productId}`);
    return response.data;
  },

  // Get wishlist summary
  getWishlistSummary: async () => {
    const response = await api.get('/wishlist/summary');
    return response.data;
  }
}; 