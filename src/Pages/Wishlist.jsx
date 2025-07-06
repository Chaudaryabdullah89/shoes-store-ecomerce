import React, { useEffect, useState } from "react";
import { useWishlist } from "../Context/WishlistContextProvider";
import { useCart } from "../Context/CartContext";
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

  // Helper function to get item ID safely
  const getItemId = (item) => {
    return item?.id || item?._id || '';
  };

  // Helper function to get item name safely
  const getItemName = (item) => {
    return item?.name || "Unnamed Product";
  };

  // Helper function to get item price safely
  const getItemPrice = (item) => {
    return item?.currentPrice ?? item?.price ?? 0;
  };

  // Helper function to get item image safely
  const getItemImage = (item) => {
    if (item?.image) {
      return item.image;
    }
    if (Array.isArray(item?.images) && item.images[0]?.url) {
      return item.images[0].url;
    }
    return "https://via.placeholder.com/300x300?text=No+Image";
  };

  // Get recommended products (excluding items already in wishlist)
  const wishlistIds = wishlist.map(item => String(getItemId(item)));
  const recommendations = products.filter(product => 
    !wishlistIds.includes(String(getItemId(product)))
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
            {wishlist.map((item) => {
              const itemId = getItemId(item);
              const itemName = getItemName(item);
              const itemPrice = getItemPrice(item);
              const itemImage = getItemImage(item);
              
              return (
                <div key={itemId} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <img 
                      src={itemImage}
                      alt={itemName} 
                      className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded"
                      onError={e => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/300x300?text=No+Image";
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm sm:text-base truncate mb-2">{itemName}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-yellow-600 font-bold text-sm sm:text-base">
                          ${typeof itemPrice === 'number' ? itemPrice.toFixed(2) : '0.00'}
                        </span>
                        {typeof item.originalPrice === 'number' && typeof itemPrice === 'number' && item.originalPrice > itemPrice && (
                          <span className="text-gray-400 line-through text-xs sm:text-sm">${item.originalPrice.toFixed(2)}</span>
                        )}
                      </div>
                      <div className="text-green-600 font-semibold text-xs sm:text-sm mb-3">In stock</div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={() => {
                            const productToAdd = {
                              ...item,
                              _id: itemId,
                              id: itemId,
                              name: itemName,
                              price: itemPrice,
                              currentPrice: itemPrice,
                              image: itemImage
                            };
                            addToCart(productToAdd, 1, null, null);
                          }}
                          className="border border-black rounded-full px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-semibold hover:bg-black hover:text-white transition"
                        >
                          Add to Cart
                        </button>
                        <button
                          onClick={() => removeFromWishlist(itemId)}
                          className="border border-black rounded-full px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-semibold hover:bg-black hover:text-white transition"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
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
              wishlist.map((item) => {
                const itemId = getItemId(item);
                const itemName = getItemName(item);
                const itemPrice = getItemPrice(item);
                const itemImage = getItemImage(item);
                
                return (
                  <tr key={itemId} className="bg-white border-b border-gray-100">
                    <td className="flex items-center gap-4 py-4">
                      <img 
                        src={itemImage} 
                        alt={itemName} 
                        className="w-16 h-16 object-contain" 
                      />
                      <span className="font-semibold">{itemName}</span>
                    </td>
                    <td>
                      <span className="text-yellow-600 font-bold">
                        ${typeof itemPrice === 'number' ? itemPrice.toFixed(2) : '0.00'}
                      </span>
                      {typeof item.originalPrice === 'number' && typeof itemPrice === 'number' && item.originalPrice > itemPrice && (
                        <span className="text-gray-400 line-through ml-2">${item.originalPrice.toFixed(2)}</span>
                      )}
                    </td>
                    <td className="text-green-600 font-semibold">In stock</td>
                    <td className="flex gap-2">
                      <button
                        onClick={() => {
                          const productToAdd = {
                            ...item,
                            _id: itemId,
                            id: itemId,
                            name: itemName,
                            price: itemPrice,
                            currentPrice: itemPrice,
                            image: itemImage
                          };
                          addToCart(productToAdd, 1, null, null);
                        }}
                        className="border border-black rounded-full px-4 py-1 text-xs font-semibold hover:bg-black hover:text-white transition"
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={() => removeFromWishlist(itemId)}
                        className="border border-black rounded-full px-4 py-1 text-xs font-semibold hover:bg-black hover:text-white transition"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Recommendations Carousel */}
      <div className="mt-12 sm:mt-16">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center mb-6 sm:mb-8">You May Also Like</h2>
        <div className="flex gap-4 sm:gap-6 lg:gap-8 overflow-x-auto pb-4 justify-start sm:justify-center">
          {recommendations.map((rec) => {
            const recId = getItemId(rec);
            const recName = getItemName(rec);
            const recPrice = getItemPrice(rec);
            const recImage = getItemImage(rec);
            
            return (
              <div key={recId} className="min-w-[150px] sm:min-w-[180px] lg:min-w-[200px] flex flex-col items-center relative flex-shrink-0">
                {rec.isOnSale && (
                  <span className="absolute left-0 top-2 bg-red-500 text-white text-xs px-2 py-1 rounded-tr rounded-br font-bold rotate-[-45deg] -translate-x-6">Sale</span>
                )}
                <Link to={`/product/${recId}`} state={{ product: rec }}>
                  <img 
                    src={recImage} 
                    alt={recName} 
                    className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 object-contain mb-2 hover:scale-105 transition-transform" 
                  />
                </Link>
                <div className="font-semibold mb-1">{recName}</div>
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
                    const productToAdd = {
                      ...rec,
                      _id: recId,
                      id: recId,
                      name: recName,
                      price: recPrice,
                      currentPrice: recPrice,
                      image: recImage
                    };
                    addToCart(productToAdd, 1, null, null);
                  }}
                  className="text-xs text-yellow-600 font-bold border border-yellow-600 rounded-full px-3 py-1 hover:bg-yellow-50 transition"
                >
                  + Add to Cart
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;