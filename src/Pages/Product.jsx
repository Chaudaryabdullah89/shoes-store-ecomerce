import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useWishlist } from '../Context/WishlistContext';
import { useCart } from '../Context/CartContext';
import ProductCard from '../Components/ProductCard';
import { productService } from '../services/productService';
import { toast } from 'react-hot-toast';

// You may need to import Swiper, Pagination, Thumbs, etc. and getAllImages, setSelectedImage, setThumbsSwiper, selectedImage, selectedColor, setSelectedColor, buyNowToast, setBuyNowToast
// For this rewrite, we focus on the syntax error and the main Product component structure.

const fallbackImg = 'https://via.placeholder.com/500x500.png?text=No+Image';

const RatingStars = ({ value = 0, count = 5 }) => {
  const full = Math.floor(value);
  const half = value % 1 >= 0.5;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
      {[...Array(count)].map((_, i) => (
        <span key={i} style={{ color: '#f59e42', fontSize: 18 }}>
          {i < full ? '★' : i === full && half ? '⯨' : '☆'}
        </span>
      ))}
    </div>
  );
};

const Product = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState('description');
  const { addToWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (id) {
      productService
        .getProduct(id)
        .then((data) => {
          const prod = data.product || data;
          setProduct(prod);

          // Set default size
          if (Array.isArray(prod.sizes) && prod.sizes.length > 0) {
            setSelectedSize(prod.sizes[0]);
          } else {
            setSelectedSize(null);
          }
          // Set default color
          if (Array.isArray(prod.colors) && prod.colors.length > 0) {
            setSelectedColor(prod.colors[0]);
          } else {
            setSelectedColor(null);
          }
          // Set default image

          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
      productService
        .getProducts()
        .then((data) =>
          setRecommendations(
            (data.products || data)
              .filter((p) => String(p._id || p.id) !== String(id))
              .slice(0, 8)
          )
        )
        .catch(() => setRecommendations([]));
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    if (
      (Array.isArray(product.colors) && product.colors.length > 0 && !selectedColor) ||
      (Array.isArray(product.sizes) && product.sizes.length > 0 && !selectedSize)
    ) {
      toast.error('Please select color and size.');
      return;
    }
    const cartItem = {
      id: product._id || product.id,
      name: product.name,
      currentPrice: typeof product.price === 'number' ? product.price : 0,
      image:
        Array.isArray(product.images) && product.images.length > 0
          ? typeof product.images[0] === 'string'
            ? product.images[0]
            : product.images[0]?.url
        : '',
      color: selectedColor?.name || null,
      size: selectedSize?.name || selectedSize || null,
    };
    addToCart(cartItem, quantity, cartItem.color);
    toast.success('Added to cart!');
  };

  const handleBuyNow = () => {
    if (!product) return;
    if (
      (Array.isArray(product.colors) && product.colors.length > 0 && !selectedColor) ||
      (Array.isArray(product.sizes) && product.sizes.length > 0 && !selectedSize)
    ) {
      toast.error('Please select color and size.');
      return;
    }
    const cartItem = {
      id: product._id || product.id,
      name: product.name,
      currentPrice: typeof product.price === 'number' ? product.price : 0,
      image:
        Array.isArray(product.images) && product.images.length > 0
          ? typeof product.images[0] === 'string'
            ? product.images[0]
            : product.images[0]?.url
        : '',
      color: selectedColor?.name || null,
      size: selectedSize?.name || selectedSize || null,
    };
    addToCart(cartItem, quantity, cartItem.color, false); // Do not open cart drawer
    toast.success('Added to cart! Redirecting...');
    setTimeout(() => {
      navigate('/cart');
    }, 1000);
  };

  const handleWishlist = () => {
    addToWishlist(product);
    toast.success('Added to wishlist!');
  };

  const currentPrice = typeof product?.price === 'number' ? product.price : 0;
  const originalPrice =
    typeof product?.compareAtPrice === 'number'
      ? product.compareAtPrice
      : currentPrice;
  const discount =
    originalPrice > currentPrice && originalPrice > 0
      ? Math.round(100 - (currentPrice / originalPrice) * 100)
      : 0;

  // Apple-like clean, simple, modern UI
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 relative">
      {/* Breadcrumb */}
      <nav className="text-xs mb-4 sm:mb-6 lg:mb-8 text-gray-400 flex items-center gap-1 sm:gap-2 font-medium flex-wrap">
        <Link to="/" className="hover:underline text-gray-700">
          Home
        </Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-500">{product?.category || 'Product'}</span>
        <span className="text-gray-300">/</span>
        <span className="text-black truncate">{product?.name}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-12">
        {/* Left: Image Gallery */}
        <div className="lg:w-[40%] w-full flex flex-col items-center">
          <div className="rounded-2xl bg-white border border-gray-100 p-2 sm:p-3 relative shadow-sm w-full">
            {loading ? (
              <div className="animate-pulse h-[280px] sm:h-[320px] w-full rounded-xl bg-gray-100" />
            ) : product?.images && product.images.length > 0 && product.images[0]?.url ? (
              <div className="group relative w-full h-[240px] sm:h-[280px] lg:h-[320px]">
                <img
                  src={product.images[0].url}
                  alt={product?.name || "Product"}
                  className="object-contain w-full h-[240px] sm:h-[280px] lg:h-[320px] rounded-xl bg-white transition-transform duration-300 group-hover:scale-110"
                  style={{ cursor: "zoom-in" }}
                />
              </div>
            ) : (
              <div className="group relative w-full h-[240px] sm:h-[280px] lg:h-[320px]">
              <img
                src={fallbackImg}
                alt="No product"
                  className="object-contain w-full h-[240px] sm:h-[280px] lg:h-[320px] rounded-xl bg-white transition-transform duration-300 group-hover:scale-110"
                  style={{ cursor: "zoom-in" }}
                />
              </div>
            )}
            {/* Badge */}
            {discount > 0 && (
              <span className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-gray-900 text-white px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-semibold shadow-sm">
                -{discount}%
              </span>
            )}
            {product?.isNew && (
              <span className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-gray-200 text-gray-900 px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-semibold shadow-sm">
                New
              </span>
            )}
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="lg:w-[60%] w-full flex flex-col gap-4 sm:gap-6 lg:gap-7">
          <div className="flex items-start justify-between gap-3 sm:gap-4">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 mb-1 tracking-tight leading-tight">
                {product?.name || <span className="animate-pulse bg-gray-200 rounded w-32 h-6 inline-block" />}
              </h1>
              <div className="flex items-center gap-2 mb-2">
                <RatingStars value={product?.rating || 4.2} />
                <span className="ml-1 text-xs text-gray-500">
                  {product?.rating?.toFixed(1) || '4.2'} ({product?.reviewsCount || 128} reviews)
                </span>
              </div>
              {product?.brand && (
                <div className="text-xs text-gray-400 font-medium mb-1">
                  Brand: <span className="text-gray-700">{product.brand}</span>
                </div>
              )}
            </div>
            <button
              onClick={handleWishlist}
              className="bg-white border border-gray-200 px-2 sm:px-3 py-2 rounded-full hover:bg-gray-900 hover:text-white transition-all duration-150 shadow-sm flex-shrink-0"
              title="Add to Wishlist"
            >
              <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' className='w-5 h-5 sm:w-6 sm:h-6'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4.318 6.318a4.5 4.5 0 016.364 0L12 7.293l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.293l-7.682-7.682a4.5 4.5 0 010-6.364z' />
              </svg>
            </button>
          </div>
          {/* Price */}
          <div className="flex items-center gap-2 sm:gap-4 mt-1">
            <span className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 tracking-tight">
              ${(currentPrice ?? 0).toFixed(2)}
            </span>
            {originalPrice > currentPrice && (
              <span className="text-gray-400 line-through text-sm sm:text-base">${(originalPrice ?? 0).toFixed(2)}</span>
            )}
            {discount > 0 && (
              <span className="bg-gray-900 text-white text-xs px-1.5 sm:px-2 py-0.5 rounded-full font-semibold shadow-sm">
                SAVE {discount}%
              </span>
            )}
          </div>
          {/* Color Option */}
          {product?.colors?.length > 0 && (
            <div>
              <div className="font-medium mb-2 text-sm text-gray-700">Color</div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {product.colors.map((color, idx) => (
                  <button
                    key={color.name || idx}
                    className={`flex items-center gap-1.5 sm:gap-2 px-1.5 sm:px-2 py-1 rounded-lg border transition-all duration-150 ${selectedColor === color ? 'border-gray-900 bg-gray-100' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                    onClick={() => setSelectedColor(color)}
                  >
                    <span
                      className="inline-block w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-gray-300"
                      style={{ background: color.value }}
                      title={color.name}
                    ></span>
                    <span className="capitalize text-xs font-medium">{color.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          {/* Size Option */}
          {(Array.isArray(product?.sizes) && product.sizes.length > 0) && (
            <div>
              <div className="font-medium mb-2 text-sm text-gray-700">Size</div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {product.sizes.map((size, idx) => (
                  <button
                    key={size?._id || size?.name || size || idx}
                    className={`px-2 sm:px-3 py-1 rounded-lg border text-xs font-medium capitalize transition-all duration-150 ${selectedSize === size ? 'border-gray-900 bg-gray-100' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size?.name || size}
                  </button>
                ))}
              </div>
            </div>
          )}
          {/* Description */}
          {product?.description && (
            <div className="text-gray-500 text-sm sm:text-base mt-2 line-clamp-3">
              <div 
                className="text-gray-500 text-sm sm:text-base"
                dangerouslySetInnerHTML={{ 
                  __html: product.description.replace(/<[^>]*>/g, '').split('\n').slice(0, 2).join('\n') 
                }}
              />
            </div>
          )}
          {/* Stock indicator */}
          {typeof product?.stock !== 'undefined' && (
            <div className="text-xs text-green-700 font-medium mb-1 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
              In stock: {product.stock}
            </div>
          )}
          {/* Quantity and Add to Cart */}
          <div className="flex items-center gap-3 sm:gap-4 mt-2">
            <span className="font-medium text-sm text-gray-700">Qty</span>
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="border rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-base sm:text-lg font-bold hover:bg-gray-100 transition"
              aria-label="Decrease quantity"
            >
              –
            </button>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={e => setQuantity(Math.max(1, Number(e.target.value)))}
              className="w-10 sm:w-12 text-center border rounded-lg py-1 text-sm sm:text-base font-medium focus:ring-2 focus:ring-gray-900 transition"
              style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
            />
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="border rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-base sm:text-lg font-bold hover:bg-gray-100 transition"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-5">
            <button
              onClick={handleAddToCart}
              className="flex-1 border border-gray-900 rounded-lg px-4 sm:px-6 py-2.5 sm:py-3 font-medium text-gray-900 bg-white hover:bg-gray-900 hover:text-white transition text-sm sm:text-base shadow-sm active:scale-95"
            >
              Add to Bag
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 bg-gray-900 text-white py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-base hover:bg-gray-800 transition shadow-sm active:scale-95"
            >
              Buy Now
            </button>
          </div>
          {/* Delivery & Return Info */}
          <div className="flex flex-col gap-2 mt-4 sm:mt-6">
            <div className="flex items-center gap-2 text-gray-400 text-xs sm:text-sm">
              <span className="w-2 h-2 rounded-full bg-gray-300 inline-block" />
              Delivery: <b className="text-gray-700 font-medium">12-26 days</b> (Intl), <b className="text-gray-700 font-medium">3-6 days</b> (US)
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-xs sm:text-sm">
              <span className="w-2 h-2 rounded-full bg-gray-300 inline-block" />
              Return within <b className="text-gray-700 font-medium">45 days</b> of purchase.
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-xs sm:text-sm">
              <span className="w-2 h-2 rounded-full bg-gray-300 inline-block" />
              24/7 Customer Support
            </div>
          </div>
        </div>
      </div>

      {/* Tabbed Details Section */}
      <div className="max-w-3xl mx-auto mt-12 sm:mt-16 bg-white rounded-xl shadow p-4 sm:p-6 lg:p-8 border border-gray-100">
        <div className="flex border-b mb-4 sm:mb-6 gap-1 sm:gap-2 overflow-x-auto">
          <button
            className={`px-3 sm:px-4 lg:px-5 py-2 font-medium text-sm sm:text-base focus:outline-none transition border-b-2 whitespace-nowrap ${tab === 'description' ? 'border-gray-900 text-gray-900 bg-gray-50' : 'border-transparent text-gray-400 hover:bg-gray-50'}`}
            onClick={() => setTab('description')}
          >
            Description
          </button>
          <button
            className={`px-3 sm:px-4 lg:px-5 py-2 font-medium text-sm sm:text-base focus:outline-none transition border-b-2 whitespace-nowrap ${tab === 'shipping' ? 'border-gray-900 text-gray-900 bg-gray-50' : 'border-transparent text-gray-400 hover:bg-gray-50'}`}
            onClick={() => setTab('shipping')}
          >
            Shipping & Return
          </button>
          <button
            className={`px-3 sm:px-4 lg:px-5 py-2 font-medium text-sm sm:text-base focus:outline-none transition border-b-2 whitespace-nowrap ${tab === 'specs' ? 'border-gray-900 text-gray-900 bg-gray-50' : 'border-transparent text-gray-400 hover:bg-gray-50'}`}
            onClick={() => setTab('specs')}
          >
            Specifications
          </button>
        </div>
        {tab === 'description' && (
          <div className="space-y-5 sm:space-y-7">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-gray-900">Product Details</h3>
              <div 
                className="text-gray-700 text-sm sm:text-base mb-2"
                dangerouslySetInnerHTML={{ __html: product?.description }}
              />
            </div>
            {Array.isArray(product?.features) && product.features.length > 0 && (
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-900">Features</h3>
                <ul className="list-disc pl-4 sm:pl-6 text-gray-700 space-y-1 mb-2 text-sm sm:text-base">
                  {product.features.map((feature, i) => (
                    <li key={i}>
                      {typeof feature === 'string'
                        ? feature
                        : feature?.name || JSON.stringify(feature)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {product?.images?.length > 1 && (
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-900">Gallery</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
                  {product.images.slice(0, 6).map((img, idx) => (
                    <img
                      key={idx}
                      src={typeof img === 'string' ? img : img?.url || fallbackImg}
                      alt={`gallery-${idx}`}
                      className="rounded-lg shadow w-full object-cover h-20 sm:h-28 bg-white"
                      onError={(e) => (e.target.src = fallbackImg)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        {tab === 'shipping' && (
          <div className="space-y-4 sm:space-y-5">
            <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900">Shipping & Return Policy</h3>
            <p className="text-gray-700 text-sm sm:text-base">
              {product?.delivery ||
                'Standard shipping times apply. Please see our FAQ for more details.'}
            </p>
            <p className="text-gray-700 text-sm sm:text-base">
              {product?.return ||
                'Returns accepted within 45 days of purchase. Duties & taxes are non-refundable.'}
            </p>
            <p className="text-gray-700 text-sm sm:text-base">
              For more information, contact our support team or visit our{' '}
              <Link to="/faq" className="underline text-gray-900 font-medium">
                FAQ page
              </Link>
              .
            </p>
          </div>
        )}
        {tab === 'specs' && product?.specifications && (
          <div className="space-y-4 sm:space-y-5">
            <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900">Specifications</h3>
            <ul className="text-gray-700 grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-2 text-sm sm:text-base">
              {Object.entries(product.specifications).map(([key, value]) => (
                <li key={key}>
                  <span className="font-medium capitalize text-gray-900">
                    {key.replace(/([A-Z])/g, ' $1')}:
                  </span>{' '}
                  {value}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Recommendations */}
      <div className="mt-12 sm:mt-16 lg:mt-20">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-center mb-6 sm:mb-8 tracking-tight text-gray-900">You May Also Like</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {recommendations.slice(0, 8).map((rec) => (
            <ProductCard key={rec._id || rec.id} product={rec} required />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Product;