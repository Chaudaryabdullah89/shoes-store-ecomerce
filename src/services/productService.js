import api from './api';

export const productService = {
  // Get all products with filtering
  getProducts: async (params = {}) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  // Get single product
  getProduct: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Get product categories
  getCategories: async () => {
    const response = await api.get('/products/categories');
    return response.data;
  },

  // Get product brands
  getBrands: async () => {
    const response = await api.get('/products/brands');
    return response.data;
  },

  // Get featured products
  getFeaturedProducts: async () => {
    const response = await api.get('/products/featured');
    return response.data;
  },

  // Get new products
  getNewProducts: async () => {
    const response = await api.get('/products/new');
    return response.data;
  },

  // Get sale products
  getSaleProducts: async () => {
    const response = await api.get('/products/sale');
    return response.data;
  },

  // Search products
  searchProducts: async (query, params = {}) => {
    const response = await api.get('/products', {
      params: { ...params, search: query }
    });
    return response.data;
  },

  // Get products by category
  getProductsByCategory: async (category, params = {}) => {
    const response = await api.get('/products', {
      params: { ...params, category }
    });
    return response.data;
  },

  // Get products by brand
  getProductsByBrand: async (brand, params = {}) => {
    const response = await api.get('/products', {
      params: { ...params, brand }
    });
    return response.data;
  },

  // Get products by price range
  getProductsByPriceRange: async (minPrice, maxPrice, params = {}) => {
    const response = await api.get('/products', {
      params: { ...params, minPrice, maxPrice }
    });
    return response.data;
  },

  // Get products by color
  getProductsByColor: async (color, params = {}) => {
    const response = await api.get('/products', {
      params: { ...params, color }
    });
    return response.data;
  },

  // Get products by size
  getProductsBySize: async (size, params = {}) => {
    const response = await api.get('/products', {
      params: { ...params, size }
    });
    return response.data;
  },

  // Get in-stock products
  getInStockProducts: async (params = {}) => {
    const response = await api.get('/products', {
      params: { ...params, inStock: true }
    });
    return response.data;
  },

  // Get admin products
  getAdminProducts: async () => {
    const response = await api.get('/admin/products');
    return response.data;
  },

  // Create product (admin)
  createProduct: async (data) => {
    const response = await api.post('/admin/products', data);
    return response.data;
  },

  // Update product (admin)
  updateProduct: async (id, data) => {
    const response = await api.put(`/admin/products/${id}`, data);
    return response.data;
  },

  // Add product (admin)
  addProduct: async (data) => {
    const response = await api.post('/admin/products', data);
    return response.data;
  },

  // Delete product (admin)
  deleteProduct: async (id) => {
    const response = await api.delete(`/admin/products/${id}`);
    return response.data;
  }
}; 