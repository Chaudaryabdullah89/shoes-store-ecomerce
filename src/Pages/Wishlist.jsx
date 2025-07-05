import React, { useEffect, useState } from "react";
import { useWishlist } from "../Context/WishlistContextProvider";
import { useCart } from "../Context/CartContextProvider";
import { Link } from "react-router-dom";
import { productService } from '../services/productService';

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    productService.getProducts()
      .then(data => setProducts(data.products || data))
      .catch(() => setProducts([]));
  }, []);

  // Get recommended products (excluding items already in wishlist)
  const wishlistIds = wishlist.map(item => String(item.id || item._id));
  const recommendations = products.filter(product => 
    !wishlistIds.includes(String(product.id || product._id))
  ).slice(0, 4);

  return (
    <div className="max-w-5xl mx-auto py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-6 sm:mb-10">Wishlist</h1>
      
      {/* Mobile/Tablet Layout */}
      <div className="block lg:hidden">
        {wishlist.length === 0 ? (
          <div className="text-center text-gray-400 py-10">
            <p className="text-sm sm:text-base">Your wishlist is empty.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {wishlist.map((item) => (
              <div key={item.id || item._id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-start gap-3 sm:gap-4">
                  <img 
                    src={
                      (Array.isArray(item.image) && item.image) ||
                      item.image ||
                      "https://via.placeholder.com/300x300?text=No+Image"
                    }
                    alt={item.name || "Product"} 
                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded"
                    onError={e => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/300x300?text=No+Image";
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm sm:text-base truncate mb-2">{item.name || "Unnamed Product"}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-yellow-600 font-bold text-sm sm:text-base">
                        ${typeof item.currentPrice === 'number' ? item.currentPrice.toFixed(2) : '0.00'}
                      </span>
                      {typeof item.originalPrice === 'number' && typeof item.currentPrice === 'number' && item.originalPrice > item.currentPrice && (
                        <span className="text-gray-400 line-through text-xs sm:text-sm">${item.originalPrice.toFixed(2)}</span>
                      )}
                    </div>
                    <div className="text-green-600 font-semibold text-xs sm:text-sm mb-3">In stock</div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => {
                          addToCart({
                            ...item,
                            id: item.id || item._id,
                            name: item.name,
                            image: item.image || (Array.isArray(item.images) && item.images[0]?.url) || "https://via.placeholder.com/300x300?text=No+Image",
                            currentPrice: item.currentPrice ?? item.price ?? 0
                          }, 1);
                          console.log('Adding to cart:', item);
                        }}
                        className="border border-black rounded-full px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-semibold hover:bg-black hover:text-white transition"
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={() => removeFromWishlist(item.id || item._id)}
                        className="border border-black rounded-full px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-semibold hover:bg-black hover:text-white transition"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-4">
          <thead>
            <tr className="text-gray-500 text-xs uppercase">
              <th className="font-semibold pb-2">Product</th>
              <th className="font-semibold pb-2">Price</th>
              <th className="font-semibold pb-2">Stock Status</th>
              <th className="font-semibold pb-2"></th>
            </tr>
          </thead>
          <tbody>
            {wishlist.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center text-gray-400 py-10">Your wishlist is empty.</td>
              </tr>
            ) : (
              wishlist.map((item) => (
                <tr key={item.id || item._id} className="bg-white border-b border-gray-100">
                  <td className="flex items-center gap-4 py-4">
                    <img 
                      src={item.image && item.image && item.image ? item.image : "https://via.placeholder.com/300x300?text=No+Image"} 
                      alt={item.name || "Product"} 
                      className="w-16 h-16 object-contain" 
                    />
                    <span className="font-semibold">{item.name || "Unnamed Product"}</span>
                  </td>
                  <td>
                    <span className="text-yellow-600 font-bold">
                      ${typeof item.currentPrice === 'number' ? item.currentPrice.toFixed(2) : '0.00'}
                    </span>
                    {typeof item.originalPrice === 'number' && typeof item.currentPrice === 'number' && item.originalPrice > item.currentPrice && (
                      <span className="text-gray-400 line-through ml-2">${item.originalPrice.toFixed(2)}</span>
                    )}
                  </td>
                  <td className="text-green-600 font-semibold">In stock</td>
                  <td className="flex gap-2">
                    <button
                      onClick={() => {
                        addToCart({
                          ...item,
                          id: item.id || item._id,
                          name: item.name,
                          image: item.image || (Array.isArray(item.images) && item.images[0]?.url) || "https://via.placeholder.com/300x300?text=No+Image",
                          currentPrice: item.currentPrice ?? item.price ?? 0
                        }, 1);
                        console.log('Adding to cart:', item);
                      }}
                      className="border border-black rounded-full px-4 py-1 text-xs font-semibold hover:bg-black hover:text-white transition"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => removeFromWishlist(item.id || item._id)}
                      className="border border-black rounded-full px-4 py-1 text-xs font-semibold hover:bg-black hover:text-white transition"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Recommendations Carousel */}
      <div className="mt-12 sm:mt-16">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center mb-6 sm:mb-8">You May Also Like</h2>
        <div className="flex gap-4 sm:gap-6 lg:gap-8 overflow-x-auto pb-4 justify-start sm:justify-center">
          {recommendations.map((rec) => (
            <div key={rec.id || rec._id} className="min-w-[150px] sm:min-w-[180px] lg:min-w-[200px] flex flex-col items-center relative flex-shrink-0">
              {rec.isOnSale && (
                <span className="absolute left-0 top-2 bg-red-500 text-white text-xs px-2 py-1 rounded-tr rounded-br font-bold rotate-[-45deg] -translate-x-6">Sale</span>
              )}
              <Link to={`/product/${rec.id || rec._id}`} state={{ product: rec }}>
                <img 
                  src={rec.images && rec.images[0] && rec.images[0].url ? rec.images[0].url : "https://via.placeholder.com/300x300?text=No+Image"} 
                  alt={rec.name || "Product"} 
                  className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 object-contain mb-2 hover:scale-105 transition-transform" 
                />
              </Link>
              <div className="font-semibold mb-1">{rec.name || "Unnamed Product"}</div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-yellow-600 font-bold">
                  ${typeof rec.compareAtPrice === 'number' ? rec.compareAtPrice.toFixed(2) : '0.00'}
                </span>
                {typeof rec.price === 'number' && typeof rec.compareAtPrice === 'number' && rec.price > rec.compareAtPrice && (
                  <span className="text-gray-400 line-through">${rec.price.toFixed(2)}</span>
                )}
              </div>
              <button 
                onClick={() => {
                  addToCart({
                    ...rec,
                    id: rec.id || rec._id,
                    name: rec.name,
                    image: rec.image || (Array.isArray(rec.images) && rec.images[0]?.url) || "https://via.placeholder.com/300x300?text=No+Image",
                    currentPrice: rec.currentPrice ?? rec.price ?? 0
                  }, 1);
                  console.log('Adding recommendation to cart:', rec);
                }}
                className="text-xs text-yellow-600 font-bold border border-yellow-600 rounded-full px-3 py-1 hover:bg-yellow-50 transition"
              >
                + Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;