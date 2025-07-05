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
      <div className="min-h-screen w-full p-0 bg-white">
        <div className="flex items-center justify-between mb-6 px-8 pt-8">
          <h1 className="text-2xl font-bold">Products</h1>
          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded font-semibold hover:bg-yellow-600 transition"
            onClick={() => navigate('/admin/products/add')}
          >
            + Add Product
          </button>
        </div>
        <div className="flex items-center mb-4 px-8">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-64"
          />
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-6 mx-8">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="text-gray-400 py-8 text-center">No products found.</div>
        ) : (
          <div className="overflow-x-auto rounded-xl shadow mx-8">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-500 text-xs uppercase bg-gray-50">
                  <th className="font-semibold py-3 px-2">Image</th>
                  <th className="font-semibold py-3 px-2">Name</th>
                  <th className="font-semibold py-3 px-2">Brand</th>
                  <th className="font-semibold py-3 px-2">Category</th>
                  <th className="font-semibold py-3 px-2">Price</th>
                  <th className="font-semibold py-3 px-2">Stock</th>
                  <th className="font-semibold py-3 px-2">Status</th>
                  <th className="font-semibold py-3 px-2">Created At</th>
                  <th className="font-semibold py-3 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(product => (
                  <tr key={product._id || product.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-2">
                      <img src={product.images?.[0]?.url || product.images?.[0] || ''} alt={product.name} className="w-12 h-12 object-contain rounded bg-gray-100" />
                    </td>
                    <td className="py-2 px-2 font-semibold">{product.name}</td>
                    <td className="py-2 px-2">{product.brand || '-'}</td>
                    <td className="py-2 px-2">{product.category || '-'}</td>
                    <td className="py-2 px-2">${product.price?.toFixed(2) || '-'}</td>
                    <td className="py-2 px-2">{product.stock ?? '-'}</td>
                    <td className="py-2 px-2">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${product.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{product.status || 'active'}</span>
                    </td>
                    <td className="py-2 px-2">{product.createdAt ? new Date(product.createdAt).toLocaleString() : '-'}</td>
                    <td className="py-2 px-2 flex gap-4">
                      <button
                        className="text-yellow-700 underline font-semibold mr-2"
                        onClick={() => setSelectedProduct(product)}
                      >
                        View
                      </button>
                      <button
                        className="text-blue-700 underline font-semibold mr-2"
                        onClick={() => navigate(`/admin/products/edit/${product._id || product.id}`)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-700 underline font-semibold"
                        onClick={() => { setShowDelete(true); setDeleteId(product._id || product.id); }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {/* Product Details Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-all">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl mx-4 w-full max-h-[95vh] overflow-y-auto relative animate-fadeIn">
              {/* Close Button */}
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
                aria-label="Close"
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
              {/* Header */}
              <div className="flex items-center gap-4 mb-8">
                <div className="flex-shrink-0">
                  <img
                    src={selectedProduct.images?.[0]?.url || selectedProduct.images?.[0] || ''}
                    alt={selectedProduct.name}
                    className="w-20 h-20 object-cover rounded-lg border border-gray-200 bg-gray-100"
                  />
                </div>
                <div>
                  <h3 className="text-3xl font-extrabold text-gray-900">{selectedProduct.name}</h3>
                  <div className="flex items-center gap-3 mt-2">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${selectedProduct.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {selectedProduct.status || 'active'}
                    </span>
                    <span className="text-xs text-gray-500">
                      Created: {selectedProduct.createdAt ? new Date(selectedProduct.createdAt).toLocaleString() : '-'}
                    </span>
                  </div>
                </div>
              </div>
              {/* Main Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left: Images Gallery */}
                <div>
                  <div className="mb-4">
                    <img
                      src={selectedProduct.images?.[0]?.url || selectedProduct.images?.[0] || ''}
                      alt={selectedProduct.name}
                      className="w-full h-64 object-contain rounded-xl border border-gray-200 bg-gray-50"
                    />
                  </div>
                  {selectedProduct.images && selectedProduct.images.length > 1 && (
                    <div>
                      <h4 className="font-semibold mb-2 text-gray-800">Gallery</h4>
                      <div className="flex gap-3 flex-wrap">
                        {selectedProduct.images.map((img, idx) => (
                          <img
                            key={idx}
                            src={img.url || img}
                            alt={`img${idx}`}
                            className="w-16 h-16 object-cover rounded border border-gray-200 bg-gray-100 hover:scale-105 transition"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {/* Right: Details */}
                <div>
                  <h4 className="font-semibold mb-2 text-gray-800">Description</h4>
                  <p className="text-gray-600 mb-4 whitespace-pre-line">{selectedProduct.description || '-'}</p>
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div>
                      <span className="font-semibold text-gray-700">Brand:</span>{' '}
                      <span className="text-gray-800">{selectedProduct.brand || '-'}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Category:</span>{' '}
                      <span className="text-gray-800">{selectedProduct.category || '-'}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Price:</span>{' '}
                      <span className="text-gray-emerald-700 font-bold">${selectedProduct.price?.toFixed(2) || '-'}</span>
                      {selectedProduct.compareAtPrice && (
                        <span className="ml-2 text-gray-400 line-through">${selectedProduct.compareAtPrice?.toFixed(2)}</span>
                      )}
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Stock:</span>{' '}
                      <span className={selectedProduct.stock > 0 ? "text-green-700" : "text-red-600"}>
                        {selectedProduct.stock ?? '-'}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Tags:</span>{' '}
                      <span className="text-gray-800">
                        {Array.isArray(selectedProduct.tags) ? selectedProduct.tags.join(', ') : selectedProduct.tags || '-'}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Sizes:</span>{' '}
                      <span className="text-gray-800">
                        {Array.isArray(selectedProduct.sizes)
                          ? selectedProduct.sizes.map(s => s.name || s).join(', ')
                          : selectedProduct.size || '-'}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Colors:</span>{' '}
                      <span className="flex flex-wrap gap-2 items-center">
                        {Array.isArray(selectedProduct.colors) && selectedProduct.colors.length > 0
                          ? selectedProduct.colors.map((color, idx) => (
                              <span key={idx} className="flex items-center gap-1">
                                <span
                                  className="inline-block w-4 h-4 rounded-full border border-gray-300"
                                  style={{ backgroundColor: color.hex || color.code || color.value || '#000' }}
                                  title={color.name || color.hex || color.code}
                                ></span>
                                <span className="text-xs text-gray-700">{color.name || color.hex || color.code}</span>
                              </span>
                            ))
                          : '-'}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Features:</span>{' '}
                      <span className="text-gray-800">
                        {selectedProduct.features
                          ? Array.isArray(selectedProduct.features)
                            ? selectedProduct.features.join(', ')
                            : selectedProduct.features
                          : '-'}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Specifications:</span>{' '}
                      <span className="text-gray-800">
                        {selectedProduct.specifications
                          ? typeof selectedProduct.specifications === 'object'
                            ? Object.entries(selectedProduct.specifications).map(([k, v]) => `${k}: ${v}`).join(', ')
                            : selectedProduct.specifications
                          : '-'}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Weight:</span>{' '}
                      <span className="text-gray-800">{selectedProduct.weight ? `${selectedProduct.weight} kg` : '-'}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Dimensions:</span>{' '}
                      <span className="text-gray-800">
                        {selectedProduct.dimensions
                          ? typeof selectedProduct.dimensions === 'object'
                            ? `${selectedProduct.dimensions.length || '-'} x ${selectedProduct.dimensions.width || '-'} x ${selectedProduct.dimensions.height || '-'} cm`
                            : selectedProduct.dimensions
                          : '-'}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Is Featured:</span>{' '}
                      <span className={selectedProduct.isFeatured ? "text-green-700" : "text-gray-500"}>
                        {selectedProduct.isFeatured ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Is New:</span>{' '}
                      <span className={selectedProduct.isNew ? "text-green-700" : "text-gray-500"}>
                        {selectedProduct.isNew ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Is On Sale:</span>{' '}
                      <span className={selectedProduct.isOnSale ? "text-green-700" : "text-gray-500"}>
                        {selectedProduct.isOnSale ? `Yes (${selectedProduct.salePercentage || '-'}%)` : 'No'}
                      </span>
                    </div>
                  </div>
                  {/* Variants */}
                  {selectedProduct.variants && Array.isArray(selectedProduct.variants) && selectedProduct.variants.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2 text-gray-800">Variants</h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full border text-xs">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="px-2 py-1 border">Name</th>
                              <th className="px-2 py-1 border">SKU</th>
                              <th className="px-2 py-1 border">Price</th>
                              <th className="px-2 py-1 border">Stock</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedProduct.variants.map((variant, idx) => (
                              <tr key={idx}>
                                <td className="px-2 py-1 border">{variant.name || '-'}</td>
                                <td className="px-2 py-1 border">{variant.sku || '-'}</td>
                                <td className="px-2 py-1 border">${variant.price?.toFixed(2) || '-'}</td>
                                <td className="px-2 py-1 border">{variant.stock ?? '-'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Delete Confirmation Modal */}
        {showDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md mx-4 w-full">
              <h3 className="text-xl font-bold mb-6">Delete Product</h3>
              <p className="mb-6">Are you sure you want to delete this product?</p>
              <div className="flex gap-4 justify-end">
                <button
                  className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300"
                  onClick={() => setShowDelete(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded bg-red-500 text-white font-semibold hover:bg-red-600"
                  onClick={handleDelete}
                  disabled={deleteLoading}
                >
                  Delete
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
