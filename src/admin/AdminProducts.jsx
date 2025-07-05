import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import AdminLayout from './components/AdminLayout';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch products
  const fetchProducts = () => {
    setLoading(true);
    setError('');
    productService.getAdminProducts()
      .then(data => setProducts(data.products || []))
      .catch(() => setError('Failed to load products'))
      .finally(() => setLoading(false));
  };
  useEffect(() => { fetchProducts(); }, []);

  // Search/filter logic
  const filtered = products.filter(p =>
    (p.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.brand && p.brand.toLowerCase().includes(search.toLowerCase())) ||
    (p.category && p.category.toLowerCase().includes(search.toLowerCase()))
  );

  // Delete product
  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      await productService.deleteProduct(deleteId);
      setShowDelete(false);
      setDeleteId(null);
      fetchProducts();
    } catch {
      setError('Failed to delete product');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-600 text-sm sm:text-base mt-1">Manage your product catalog</p>
          </div>
          <button
            className="bg-yellow-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-medium hover:bg-yellow-600 transition-colors text-sm sm:text-base"
            onClick={() => navigate('/admin/products/add')}
          >
            <span className="hidden sm:inline">+ Add Product</span>
            <span className="sm:hidden">+ Add</span>
          </button>
        </div>

        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 text-sm">Try adjusting your search criteria</p>
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4">
              {filtered.map(product => (
                <div key={product._id || product.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                  <div className="flex items-start space-x-4">
                    <img 
                      src={product.images?.[0]?.url || product.images?.[0] || ''} 
                      alt={product.name} 
                      className="w-16 h-16 object-cover rounded-lg bg-gray-100 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{product.name}</h3>
                      <p className="text-gray-600 text-xs sm:text-sm">{product.brand || '-'} • {product.category || '-'}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-medium text-green-600">${product.price?.toFixed(2) || '-'}</span>
                        <span className="text-xs text-gray-500">Stock: {product.stock ?? '-'}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {product.status || 'active'}
                        </span>
                        <div className="flex space-x-2">
                          <button
                            className="text-blue-600 text-xs font-medium hover:text-blue-700"
                            onClick={() => setSelectedProduct(product)}
                          >
                            View
                          </button>
                          <button
                            className="text-yellow-600 text-xs font-medium hover:text-yellow-700"
                            onClick={() => navigate(`/admin/products/edit/${product._id || product.id}`)}
                          >
                            Edit
                          </button>
                          <button
                            className="text-red-600 text-xs font-medium hover:text-red-700"
                            onClick={() => { setShowDelete(true); setDeleteId(product._id || product.id); }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-gray-500 text-xs uppercase bg-gray-50 border-b border-gray-200">
                      <th className="font-semibold py-4 px-6">Image</th>
                      <th className="font-semibold py-4 px-6">Name</th>
                      <th className="font-semibold py-4 px-6">Brand</th>
                      <th className="font-semibold py-4 px-6">Category</th>
                      <th className="font-semibold py-4 px-6">Price</th>
                      <th className="font-semibold py-4 px-6">Stock</th>
                      <th className="font-semibold py-4 px-6">Status</th>
                      <th className="font-semibold py-4 px-6">Created At</th>
                      <th className="font-semibold py-4 px-6">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(product => (
                      <tr key={product._id || product.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6">
                          <img 
                            src={product.images?.[0]?.url || product.images?.[0] || ''} 
                            alt={product.name} 
                            className="w-12 h-12 object-cover rounded-lg bg-gray-100"
                          />
                        </td>
                        <td className="py-4 px-6 font-semibold text-gray-900">{product.name}</td>
                        <td className="py-4 px-6 text-gray-600">{product.brand || '-'}</td>
                        <td className="py-4 px-6 text-gray-600">{product.category || '-'}</td>
                        <td className="py-4 px-6 font-medium text-green-600">${product.price?.toFixed(2) || '-'}</td>
                        <td className="py-4 px-6 text-gray-600">{product.stock ?? '-'}</td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            product.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {product.status || 'active'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-500">
                          {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : '-'}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex space-x-3">
                            <button
                              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                              onClick={() => setSelectedProduct(product)}
                            >
                              View
                            </button>
                            <button
                              className="text-yellow-600 hover:text-yellow-700 font-medium text-sm"
                              onClick={() => navigate(`/admin/products/edit/${product._id || product.id}`)}
                            >
                              Edit
                            </button>
                            <button
                              className="text-red-600 hover:text-red-700 font-medium text-sm"
                              onClick={() => { setShowDelete(true); setDeleteId(product._id || product.id); }}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Product Details Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
              {/* Close Button */}
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors p-2"
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Header */}
              <div className="p-6 sm:p-8 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-shrink-0">
                    <img
                      src={selectedProduct.images?.[0]?.url || selectedProduct.images?.[0] || ''}
                      alt={selectedProduct.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border border-gray-200 bg-gray-100"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">{selectedProduct.name}</h3>
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedProduct.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {selectedProduct.status || 'active'}
                      </span>
                      <span className="text-xs text-gray-500">
                        Created: {selectedProduct.createdAt ? new Date(selectedProduct.createdAt).toLocaleDateString() : '-'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 sm:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                  {/* Left: Images Gallery */}
                  <div>
                    <div className="mb-4">
                      <img
                        src={selectedProduct.images?.[0]?.url || selectedProduct.images?.[0] || ''}
                        alt={selectedProduct.name}
                        className="w-full h-48 sm:h-64 object-contain rounded-xl border border-gray-200 bg-gray-50"
                      />
                    </div>
                    {selectedProduct.images && selectedProduct.images.length > 1 && (
                      <div>
                        <h4 className="font-semibold mb-3 text-gray-800">Gallery</h4>
                        <div className="flex gap-2 flex-wrap">
                          {selectedProduct.images.map((img, idx) => (
                            <img
                              key={idx}
                              src={img.url || img}
                              alt={`img${idx}`}
                              className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded border border-gray-200 bg-gray-100 hover:scale-105 transition-transform"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right: Details */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-3 text-gray-800">Product Details</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Brand:</span>
                          <span className="ml-2 text-gray-900">{selectedProduct.brand || '-'}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Category:</span>
                          <span className="ml-2 text-gray-900">{selectedProduct.category || '-'}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Price:</span>
                          <span className="ml-2 text-green-600 font-bold">${selectedProduct.price?.toFixed(2) || '-'}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Stock:</span>
                          <span className={`ml-2 font-medium ${selectedProduct.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                            {selectedProduct.stock ?? '-'}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Tags:</span>
                          <span className="ml-2 text-gray-900">
                            {Array.isArray(selectedProduct.tags) ? selectedProduct.tags.join(', ') : selectedProduct.tags || '-'}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Weight:</span>
                          <span className="ml-2 text-gray-900">{selectedProduct.weight ? `${selectedProduct.weight} kg` : '-'}</span>
                        </div>
                      </div>
                    </div>

                    {selectedProduct.description && (
                      <div>
                        <h4 className="font-semibold mb-3 text-gray-800">Description</h4>
                        <div 
                          className="text-gray-700 text-sm leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: selectedProduct.description }}
                        />
                      </div>
                    )}

                    {Array.isArray(selectedProduct.features) && selectedProduct.features.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-3 text-gray-800">Features</h4>
                        <ul className="list-disc pl-4 space-y-1 text-sm text-gray-700">
                          {selectedProduct.features.map((feature, i) => (
                            <li key={i}>
                              {typeof feature === 'string' ? feature : feature?.name || JSON.stringify(feature)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Delete Product</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to delete this product? This action cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  onClick={() => setShowDelete(false)}
                  disabled={deleteLoading}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
                  onClick={handleDelete}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;
