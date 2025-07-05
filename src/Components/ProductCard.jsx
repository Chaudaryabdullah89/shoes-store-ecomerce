import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from 'react-hot-toast';

// You may want to set this to your actual API URL or use an env variable
const API_URL = import.meta.env.VITE_API_URL || 'https://shoes-backend-2352.vercel.app/api';

const ProductCard = ({ product, addToWishlist, addToCart, setQuickViewProduct, setQuickViewQty, setAgreed }) => {
  // Local state for quick cart and wishlist toast
  // Use unique state per card instance (by productId)
  const productId = (product && (product.id || product._id)) || '';
  const [quickCartOpen, setQuickCartOpen] = useState(false);
  const [quickCartQty, setQuickCartQty] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  // Defensive: If product is missing, show error
  if (!product) {
    return (
      <div className="flex items-center justify-center h-64 w-full">
        <span className="text-red-500">Product not found.</span>
      </div>
    );
  }

  // Robust image selection
  const productImage = product.image || (Array.isArray(product.images) && product.images[0]) || "https://via.placeholder.com/300x300?text=No+Image";

  return (
    <div key={productId} className="relative bg-gray-100 rounded-lg shadow-md flex flex-col items-center p-3 sm:p-4 md:p-6 group overflow-hidden">
      {/* Sale Ribbon */}
      {product.isOnSale && (
        <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-bl-lg font-semibold">Sale</div>
      )}
      {/* Product Image */}
      <Link
        to={`/product/${productId}`}
        state={{
          product: {
            ...product,
            colors: Array.isArray(product.colors)
              ? product.colors.map((c, i) =>
                  typeof c === 'string'
                    ? { name: `Color ${i + 1}`, value: c, img: productImage }
                    : c
                )
              : [],
          },
        }}
        className="block w-full group"
        aria-label={`View details for ${product.name}`}
      >
        <div className="relative w-full aspect-square  flex items-center justify-center bg-white rounded-lg cover overflow-hidden">
          <img
            src={
              (Array.isArray(product.images) && product.images[0]?.url) ||
              product.image ||
              "https://via.placeholder.com/300x300?text=No+Image"
            }
            alt={product.name || "Product image"}
            className="object-cover w-full h-full transition-transform duration-300  cover group-hover:scale-105"
            loading="lazy"
            onError={e => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/300x300?text=No+Image";
            }}
          />
          {product.images && product.images.length > 1 && (
            <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
              +{product.images.length}
            </span>
          )}
        </div>
      </Link>
      {/* Product Name */}
      <div className="text-center">
        <Link to={{
          pathname: `/product/${productId}`,
          state: {
            product: {
              ...product,
              colors: product.colors?.map?.((c, i) =>
                typeof c === 'string'
                  ? { name: `Color ${i + 1}`, value: c, img: productImage }
                  : c
              ) || []
            }
          }
        }} className="hover:underline">
          <h2 className="font-semibold text-sm sm:text-base md:text-lg mt-3 sm:mt-4 md:mt-5 font-['Montserrat'] mb-2">{product.name}</h2>
        </Link>
        {/* Price */}
        <div className="flex items-center justify-center gap-1 sm:gap-2">
          <span className="text-yellow-600 font-bold text-sm sm:text-base md:text-lg">
            ${typeof product.price === 'number' ? product.compareAtPrice.toFixed(2) : (product.price || product.price || "0.00")}
          </span>
          {product.price && product.price > (product.compareAtPrice || product.price || 0) && (
            <span className="text-gray-400 line-through text-xs sm:text-sm md:text-base">
              ${typeof product.price === 'number' ? product.price.toFixed(2) : (product.Price || "0.00")}
            </span>
          )}
        </div>
      </div>
      {/* Action Bar (hidden, appears on hover) */}
      <div className="absolute left-0 right-0 bottom-16 sm:bottom-20 flex justify-center gap-2 sm:gap-3 pb-2 sm:pb-4 opacity-0 translate-y-8 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-in-out">
        <button onClick={() => {
          setQuickCartOpen(true);
          setQuickCartQty(1);
        }} className="bg-white shadow px-2 sm:px-3 py-1.5 sm:py-2 rounded-full hover:bg-yellow-400 hover:text-white transition-colors" title="Quick Cart">
          <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' className='w-4 h-4 sm:w-5 sm:h-5'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' /></svg>
        </button>
        <button
          onClick={() => {
            if (typeof addToWishlist === "function") addToWishlist({
              ...product,
              id: product.id || product._id,
              name: product.name,
              image: product.image || (Array.isArray(product.images) && product.images[0]?.url) || "https://via.placeholder.com/300x300?text=No+Image",
              currentPrice: product.currentPrice ?? product.price ?? 0
            });
            toast.success('Added to wishlist!');
          }}
          className="bg-white shadow px-2 sm:px-3 py-1.5 sm:py-2 rounded-full hover:bg-yellow-400 hover:text-white transition-colors"
          title="Wishlist"
        >
          <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' className='w-4 h-4 sm:w-5 sm:h-5'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4.318 6.318a4.5 4.5 0 016.364 0L12 7.293l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.293l-7.682-7.682a4.5 4.5 0 010-6.364z' /></svg>
        </button>
        <button
          onClick={() => {
            if (typeof setQuickViewProduct === "function") setQuickViewProduct(product);
            if (typeof setQuickViewQty === "function") setQuickViewQty(1);
            if (typeof setAgreed === "function") setAgreed(false);
          }}
          className="bg-white shadow px-2 sm:px-3 py-1.5 sm:py-2 rounded-full hover:bg-yellow-400 hover:text-white transition-colors"
          title="Quick View"
        >
          <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' className='w-4 h-4 sm:w-5 sm:h-5'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0c0 5-9 9-9 9s-9-4-9-9a9 9 0 0118 0z' /></svg>
        </button>
      </div>
      {/* Quick Cart Bottom Sheet inside card */}
      {quickCartOpen && (
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 rounded-b-lg shadow-lg z-10 animate-rollInUp">
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
              <img
                src={product.images[0].url}
                alt={product.name}
                className="w-12 h-12 object-contain"
              />
              <div className="flex-1">
                <h4 className="font-semibold font-['Montserrat'] text-sm">{product.name}</h4>
                <p className="text-yellow-600 font-bold text-sm">
                  ${typeof product.compareAtPrice === 'number' ? product.compareAtPrice.toFixed(2) : (product.compareAtPrice || product.price || "0.00")}
                </p>
              </div>
              <button
                onClick={() => setQuickCartOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {/* Color Selection */}
            {Array.isArray(product.colors) && product.colors.length > 0 && (
              <div>
                <label className="block text-xs font-semibold mb-1">Color:</label>
                <div className="flex gap-2 flex-wrap">
                  {product.colors.map((color, idx) => (
                    <button
                      key={color.name || idx}
                      type="button"
                      className={`px-3 py-1 rounded border text-xs capitalize ${selectedColor === color ? 'border-yellow-600 bg-yellow-50' : 'border-gray-200 bg-gray-50'}`}
                      style={{ background: color.value }}
                      onClick={() => setSelectedColor(color)}
                    >
                      <span className="capitalize">{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {/* Size Selection */}
            {Array.isArray(product.sizes) && product.sizes.length > 0 && (
              <div>
                <label className="block text-xs font-semibold mb-1">Size:</label>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map((size, idx) => (
                    <button
                      key={size.name || size || idx}
                      type="button"
                      className={`px-3 py-1 rounded border text-xs capitalize ${selectedSize === size ? 'border-yellow-600 bg-yellow-50' : 'border-gray-200 bg-gray-50'}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size.name || size}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                  onClick={() => setQuickCartQty(q => Math.max(1, q - 1))}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="w-8 text-center font-semibold text-sm">{quickCartQty}</span>
                <button
                  className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                  onClick={() => setQuickCartQty(q => q + 1)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-600">Total:</p>
                <p className="text-sm font-bold text-yellow-600">
                  ${((product.compareAtPrice || product.price || 0) * quickCartQty).toFixed(2)}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setQuickCartOpen(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-3 rounded text-xs font-semibold font-['Montserrat'] hover:bg-gray-300 transition-colors"
              >
                Continue
              </button>
              <button
                className="flex-1 bg-yellow-400 text-white py-2 px-3 rounded text-xs font-semibold font-['Montserrat'] hover:bg-yellow-500 transition-colors"
                onClick={() => {
                  if ((Array.isArray(product.colors) && product.colors.length > 0 && !selectedColor) || (Array.isArray(product.sizes) && product.sizes.length > 0 && !selectedSize)) {
                    toast.error('Please select a color and size.');
                    return;
                  }
                  if (typeof addToCart === "function") addToCart({
                    ...product,
                    id: product.id || product._id,
                    name: product.name,
                    image: product.image || (Array.isArray(product.images) && product.images[0]?.url) || "https://via.placeholder.com/300x300?text=No+Image",
                    color: selectedColor?.name || null,
                    size: selectedSize?.name || selectedSize || null,
                    currentPrice: product.currentPrice ?? product.price ?? 0
                  }, quickCartQty, selectedColor?.name || null, selectedSize?.name || selectedSize || null);
                  setQuickCartOpen(false);
                }}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;