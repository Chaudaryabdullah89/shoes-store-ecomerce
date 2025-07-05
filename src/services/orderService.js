import api from './api';

export const orderService = {
  // Create new order
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  // Get user orders
  getOrders: async (params = {}) => {
    const response = await api.get('/orders', { params });
    return response.data;
  },

  // Get single order
  getOrder: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // Cancel order
  cancelOrder: async (id) => {
    const response = await api.put(`/orders/${id}/cancel`);
    return response.data;
  },

  // Request refund
  requestRefund: async (id, reason, amount) => {
    const response = await api.post(`/orders/${id}/refund`, {
      reason,
      amount
    });
    return response.data;
  },

  // Get order tracking
  getOrderTracking: async (id) => {
    const response = await api.get(`/orders/${id}/tracking`);
    return response.data;
  },

  // Get all orders for admin
  getAdminOrders: async () => {
    const response = await api.get('/admin/orders');
    return response.data;
  },

  // Track order by order number (for public tracking page)
  trackOrder: async (orderNumber) => {
    const response = await api.get(`/orders/track/${orderNumber}`);
    return response.data.trackingInfo || response.data;
  },

  // Admin: Update order status
  updateOrderStatus: async (id, status, note) => {
    const response = await api.put(`/orders/${id}/status`, { status, note });
    return response.data;
  },

  // Admin: Get single order by ID
  getAdminOrder: async (id) => {
    const response = await api.get(`/admin/orders/${id}`);
    return response.data;
  },

  // Admin: Get single order by order number
  getAdminOrderByNumber: async (orderNumber) => {
    const response = await api.get(`/admin/orders/number/${orderNumber}`);
    return response.data;
  },

  // Delete order
  deleteOrder: async (id) => {
    const response = await api.delete(`/orders/${id}`);
    return response.data;
  }
}; 