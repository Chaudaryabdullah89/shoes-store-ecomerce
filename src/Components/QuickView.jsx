import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
  const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

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

  const handleAddToCart = () => {
    if (!quickViewProduct) return;
    
    // Check if color and size are required but not selected
    if (
      (Array.isArray(quickViewProduct.colors) && quickViewProduct.colors.length > 0 && !selectedColor) ||
      (Array.isArray(quickViewProduct.sizes) && quickViewProduct.sizes.length > 0 && !selectedSize)
    ) {
      alert('Please select color and size.');
      return;
    }

    const productToAdd = {
      ...quickViewProduct,
      _id: quickViewProduct._id || quickViewProduct.id,
      id: quickViewProduct._id || quickViewProduct.id,
      name: quickViewProduct.name,
      price: quickViewProduct.price || quickViewProduct.currentPrice || 0,
      currentPrice: quickViewProduct.price || quickViewProduct.currentPrice || 0,
      image: quickViewProduct.image || (Array.isArray(quickViewProduct.images) && quickViewProduct.images[0]?.url) || "https://via.placeholder.com/300x300?text=No+Image"
    };
    
    addToCart(productToAdd, quickViewQty, selectedColor?.name || null, selectedSize?.name || selectedSize || null);
    setQuickViewProduct(null);
  };

  const handleBuyNow = () => {
    if (!quickViewProduct) return;
    
    // Check if color and size are required but not selected
    if (
      (Array.isArray(quickViewProduct.colors) && quickViewProduct.colors.length > 0 && !selectedColor) ||
      (Array.isArray(quickViewProduct.sizes) && quickViewProduct.sizes.length > 0 && !selectedSize)
    ) {
      alert('Please select color and size.');
      return;
    }

    const productToAdd = {
      ...quickViewProduct,
      _id: quickViewProduct._id || quickViewProduct.id,
      id: quickViewProduct._id || quickViewProduct.id,
      name: quickViewProduct.name,
      price: quickViewProduct.price || quickViewProduct.currentPrice || 0,
      currentPrice: quickViewProduct.price || quickViewProduct.currentPrice || 0,
      image: quickViewProduct.image || (Array.isArray(quickViewProduct.images) && quickViewProduct.images[0]?.url) || "https://via.placeholder.com/300x300?text=No+Image"
    };
    
    addToCart(productToAdd, quickViewQty, selectedColor?.name || null, selectedSize?.name || selectedSize || null);
    setQuickViewProduct(null);
    navigate('/checkout');
  };

  return (
    <div>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-2 sm:p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto relative flex flex-col lg:flex-row animate-fadeIn">
          {/* Close button - Mobile optimized */}
          <button
            onClick={() => setQuickViewProduct(null)}
            className="absolute top-3 right-3 lg:top-4 lg:right-4 text-gray-400 hover:text-gray-700 transition z-10 w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center bg-white rounded-full shadow-md"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 lg:h-6 lg:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* Left: Image - Mobile optimized */}
          <div className="lg:w-1/2 w-full flex items-center justify-center bg-gray-50 rounded-t-xl lg:rounded-l-xl lg:rounded-tr-none p-3 sm:p-4 lg:p-8">
            <img 
              src={productImage} 
              alt={productName} 
              className="w-32 h-32 sm:w-40 sm:h-40 lg:w-64 lg:h-64 object-contain" 
            />
          </div>
          
          {/* Right: Info - Mobile optimized */}
          <div className="lg:w-1/2 w-full flex flex-col p-3 sm:p-4 lg:p-8">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 pr-8">{productName}</h2>
            
            <div className="flex items-center gap-2 lg:gap-3 mb-3 flex-wrap">
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
            
           
            <div 
                className="text-gray-500 mb-4 text-sm sm:text-base"
                dangerouslySetInnerHTML={{ 
                  __html: productDesc.replace(/<[^>]*>/g, '').split('\n').slice(0, 2).join('\n') 
                }}
              />
            {productStock < 20 && (
              <div className="flex items-center gap-2 mb-3">
                <span role="img" aria-label="fire" className="text-lg lg:text-xl">🔥</span>
                <span className="font-semibold text-xs uppercase tracking-wide">
                  Hurry up! Only {productStock} left in stock
                </span>
              </div>
            )}
            
            <div className="w-full h-2 bg-gray-200 rounded mb-4">
              <div
                className="h-2 bg-yellow-400 rounded"
                style={{ width: `${Math.min(productStock * 10, 100)}%` }}
              ></div>
            </div>

            {/* Color Selection - Mobile optimized */}
            <div className="flex flex-col lg:flex-row gap-4 mb-4">
              {/* Color Selection */}
              {Array.isArray(quickViewProduct?.colors) && quickViewProduct.colors.length > 0 && (
                <div className="">
                  <label className="block text-sm font-semibold mb-3">Color:</label>
                  <div className="flex gap-2 flex-wrap">
                    {quickViewProduct.colors.map((color, idx) => (
                      <button
                        key={color.name || idx}
                        type="button"
                        className={`px-4 py-2 rounded-lg border text-sm capitalize transition-all min-w-[60px] ${selectedColor === color ? 'border-yellow-600 bg-yellow-50 text-yellow-800' : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100'}`}
                        onClick={() => setSelectedColor(color)}
                      >
                        <span className="capitalize">{color.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {Array.isArray(quickViewProduct?.sizes) && quickViewProduct.sizes.length > 0 && (
                <div className="lg:w-1/2">
                  <label className="block text-sm font-semibold mb-3">Size:</label>
                  <div className="flex gap-2 flex-wrap">
                    {quickViewProduct.sizes.map((size, idx) => (
                      <button
                        key={size.name || size || idx}
                        type="button"
                        className={`px-4 py-2 rounded-lg border text-sm capitalize transition-all min-w-[50px] ${selectedSize === size ? 'border-yellow-600 bg-yellow-50 text-yellow-800' : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100'}`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size.name || size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Quantity Selector */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Quantity:</label>
              <div className="flex items-center gap-2">
                <button
                  className="w-8 h-8 sm:w-10 sm:h-10 border border-gray-300 rounded-lg flex items-center justify-center text-base sm:text-lg hover:bg-gray-100 transition-colors"
                  onClick={() => setQuickViewQty(q => Math.max(1, q - 1))}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="w-10 sm:w-12 text-center font-semibold text-base">{quickViewQty}</span>
                <button
                  className="w-8 h-8 sm:w-10 sm:h-10 border border-gray-300 rounded-lg flex items-center justify-center text-base sm:text-lg hover:bg-gray-100 transition-colors"
                  onClick={() => setQuickViewQty(q => q + 1)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Action Buttons - Mobile optimized */}
            <div className="   flex gap-2 ">
              <button
                className="w-1/2 py-2 sm:py-3 border border-gray-400 rounded-lg font-semibold text-black hover:bg-gray-100 transition-colors text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleAddToCart}
                disabled={!agreed}
              >
                ADD TO CART
              </button>
              
              <button
                className="w-1/2 py-2 sm:py-3 bg-black text-white hover:bg-gray-800 rounded-lg transition-colors text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleBuyNow}
                disabled={!agreed}
              >
                BUY IT NOW
              </button>
            </div>
            
            {/* Terms Checkbox - Mobile optimized */}
            <label className="flex mt-4 items-center gap-3 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                className="w-4 h-4 accent-yellow-400"
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
