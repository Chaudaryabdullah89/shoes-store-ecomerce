import React from 'react'
// import { useProductContext } from '../Context/ProductContextProvider'

const QuickView = ({
  quickViewProduct,
  setQuickViewProduct,
  quickViewQty,
  setQuickViewQty,
  addToCart,
  agreed,
  setAgreed
}) => {
  // Defensive helpers for price display
  const getNumber = (val, fallback = 0) => {
    if (typeof val === 'number' && !isNaN(val)) return val;
    if (typeof val === 'string' && !isNaN(Number(val))) return Number(val);
    return fallback;
  };

  // Try to get the best image
  const productImage =
    quickViewProduct?.image ||
    (Array.isArray(quickViewProduct?.images) && quickViewProduct.images[0]?.url) ||
    "https://via.placeholder.com/300x300?text=No+Image";

  // Defensive price logic
  const currentPrice = getNumber(
    quickViewProduct?.currentPrice ??
      quickViewProduct?.price ??
      (Array.isArray(quickViewProduct?.variants) && quickViewProduct.variants[0]?.price),
    0
  );
  const originalPrice = getNumber(
    quickViewProduct?.originalPrice ??
      quickViewProduct?.compareAtPrice ??
      (Array.isArray(quickViewProduct?.variants) && quickViewProduct.variants[0]?.compareAtPrice),
    currentPrice
  );

  // Defensive name/desc
  const productName = quickViewProduct?.name || "Product";
  const productDesc = quickViewProduct?.description || 'No description available.';
  const productStock = typeof quickViewProduct?.stock === 'number' ? quickViewProduct.stock : 1;

  // Defensive: avoid division by zero
  const hasDiscount = originalPrice > currentPrice && originalPrice > 0;
  const savePercent = hasDiscount
    ? Math.round(100 - (currentPrice / originalPrice) * 100)
    : 0;

  return (
    <div>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto relative flex flex-col lg:flex-row animate-fadeIn">
          {/* Close button */}
          <button
            onClick={() => setQuickViewProduct(null)}
            className="absolute top-2 right-2 lg:top-4 lg:right-4 text-gray-400 hover:text-gray-700 transition z-10"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 lg:h-7 lg:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* Left: Image */}
          <div className="lg:w-1/2 w-full flex items-center justify-center bg-gray-50 rounded-t-xl lg:rounded-l-xl lg:rounded-tr-none p-4 lg:p-8">
            <img src={productImage} alt={productName} className="w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 object-contain" />
          </div>
          
          {/* Right: Info */}
          <div className="lg:w-1/2 w-full flex flex-col p-4 lg:p-8">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2">{productName}</h2>
            
            <div className="flex items-center gap-2 lg:gap-3 mb-2 flex-wrap">
              <span className="text-yellow-600 font-bold text-lg sm:text-xl lg:text-2xl">
                ${(currentPrice ?? 0).toFixed(2)}
              </span>
              {originalPrice > currentPrice && (
                <span className="text-gray-400 line-through text-sm sm:text-base lg:text-lg">
                  ${(originalPrice ?? 0).toFixed(2)}
                </span>
              )}
              {hasDiscount && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded font-semibold">
                  SAVE {savePercent}%
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-1 mb-3 lg:mb-4">
              <span className="text-yellow-500 text-base lg:text-lg">★</span>
              <span className="text-gray-400 text-xs sm:text-sm">No reviews</span>
            </div>
            
            <p className="text-gray-600 mb-3 lg:mb-4 text-sm sm:text-base line-clamp-3">{productDesc}</p>
            
            <div className="flex items-center gap-2 mb-2">
              <span role="img" aria-label="fire" className="text-lg lg:text-xl">🔥</span>
              <span className="font-semibold text-xs uppercase tracking-wide">
                Hurry up! Only {productStock} left in stock
              </span>
            </div>
            
            <div className="w-full h-2 bg-gray-200 rounded mb-3 lg:mb-4">
              <div
                className="h-2 bg-yellow-400 rounded"
                style={{ width: `${Math.min(productStock * 10, 100)}%` }}
              ></div>
            </div>
            
            {/* Quantity Selector and Add to Cart */}
            <div className="mb-3 lg:mb-4">
              <div className="flex flex-col sm:flex-row items-center gap-2 mb-3 lg:mb-4">
                <div className="flex items-center gap-2">
                  <button
                    className="w-8 h-8 sm:w-10 sm:h-10 border border-gray-300 rounded flex items-center justify-center text-lg sm:text-xl lg:text-2xl"
                    onClick={() => setQuickViewQty(q => Math.max(1, q - 1))}
                  >-</button>
                  <span className="w-6 sm:w-8 text-center font-semibold text-sm sm:text-base">{quickViewQty}</span>
                  <button
                    className="w-8 h-8 sm:w-10 sm:h-10 border border-gray-300 rounded flex items-center justify-center text-lg sm:text-xl lg:text-2xl"
                    onClick={() => setQuickViewQty(q => q + 1)}
                  >+</button>
                </div>
                <button
                  className="w-full sm:flex-1 border border-gray-400 rounded px-4 sm:px-6 py-2 font-semibold text-black hover:bg-gray-100 transition text-sm sm:text-base"
                  onClick={() => {
                    const productToAdd = {
                      ...quickViewProduct,
                      _id: quickViewProduct._id || quickViewProduct.id,
                      id: quickViewProduct._id || quickViewProduct.id,
                      name: quickViewProduct.name,
                      price: quickViewProduct.price || quickViewProduct.currentPrice || 0,
                      currentPrice: quickViewProduct.price || quickViewProduct.currentPrice || 0,
                      image: quickViewProduct.image || (Array.isArray(quickViewProduct.images) && quickViewProduct.images[0]?.url) || "https://via.placeholder.com/300x300?text=No+Image"
                    };
                    addToCart(productToAdd, quickViewQty, null, null);
                    setQuickViewProduct(null);
                  }}
                  disabled={!agreed}
                >
                  ADD TO CART
                </button>
              </div>
            </div>
            
            <button
              className="w-full py-2 sm:py-3 bg-black text-white hover:bg-white hover:text-black rounded transition-all mb-2 border-2 border-black text-sm sm:text-base"
            >
              BUY IT NOW
            </button>
            
            <label className="flex mt-3 lg:mt-5 items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                className="accent-yellow-400"
              />
              <span className="text-xs">I Agree With <span className="underline">TERMS & CONDITIONS</span></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuickView
