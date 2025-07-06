import React, { useState, useEffect } from 'react';
import ProductCard from '../Components/ProductCard';
import { Link } from 'react-router-dom';
import { useCart } from '../Context/CartContext';
import { useWishlist } from '../Context/WishlistContextProvider';
import QuickView from '../Components/QuickView';
import { productService } from '../services/productService';
import { toast } from 'react-hot-toast';

// Default icons for categories (add more as needed)
const categoryIconsMap = {
  'Watches': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop&crop=center',
  'Jewelry': 'https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=100&h=100&fit=crop&crop=center',
  'Accessories': 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=100&h=100&fit=crop&crop=center',
  'Clothing': 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=100&h=100&fit=crop&crop=center',
  'Shoes': 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=100&h=100&fit=crop&crop=center',
  'Bags': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=100&h=100&fit=crop&crop=center',
  'Electronics': 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=100&h=100&fit=crop&crop=center',
  'Home & Garden': 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=100&h=100&fit=crop&crop=center',
  'Sports': 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=100&h=100&fit=crop&crop=center',
  'Books': 'https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=100&h=100&fit=crop&crop=center',
  'Other': 'https://via.placeholder.com/100x100?text=Other',
};

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  // Initial state for all filters
  const [category, setCategory] = useState('All');
  const [color, setColor] = useState('All');
  const [price, setPrice] = useState([0, 300]);
  const [sort, setSort] = useState('featured');
  const [search, setSearch] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();
  const [quickCartProductId, setQuickCartProductId] = useState(null);
  const [quickCartQty, setQuickCartQty] = useState(1);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [quickViewQty, setQuickViewQty] = useState(1);
  const [agreed, setAgreed] = useState(false);
  // Handle search input change
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  // Add selectedSizes state
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    setLoading(true);
    // Fetch products
    productService.getProducts({ limit: 100 })
      .then(data => {
        const all = (data.products || data).map(product => ({
          ...product,
          currentPrice: product.currentPrice ?? product.price ?? 0,
        }));
        setProducts(all);
        // Auto-set price range to min/max of all products
        if (all.length > 0) {
          const prices = all.map(p => p.currentPrice).filter(v => typeof v === 'number');
          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);
          setPrice([minPrice, maxPrice]);
        }
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
    // Fetch categories
    productService.getCategories()
      .then(data => {
        setCategories(data.categories || []);
      })
      .catch(() => setCategories([]));
  }, []);

  console.log('Product prices:', products.map(p => p.currentPrice)); // DEBUG: log all product prices
  // Filtering logic
  const filtered = products.filter(p => {
    // Category filter
    if (category !== 'All' && category) {
      if (!p.category || p.category !== category) return false;
    }
    // Brand filter
    if (selectedBrands.length > 0 && (!p.brand || !selectedBrands.includes(p.brand))) return false;
    // Color filter
    if (color !== 'All' && color && (!p.colors || !p.colors.some(c => c.name === color))) return false;
    // Size filter
    if (selectedSizes && selectedSizes.length > 0 && (!p.sizes || !p.sizes.some(s => selectedSizes.includes(s.name)))) return false;
    // Price filter (with range)
    if (typeof p.currentPrice !== 'number' || p.currentPrice < price[0] || p.currentPrice > price[1]) return false;
    return true;
  });

  // Sorting logic
  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'price-asc') return a.currentPrice - b.currentPrice;
    if (sort === 'price-desc') return b.currentPrice - a.currentPrice;
    if (sort === 'name-asc') return a.name.localeCompare(b.name);
    if (sort === 'name-desc') return b.name.localeCompare(a.name);
    if (sort === 'featured') return 0; // No sorting, default order
    return 0;
  });

  const bannerTitle = category === 'All' ? 'Shop' : category;

  // Clear all filters
  const handleClearFilters = () => {
    setCategory('All');
    setColor('All');
    setPrice([0, 300]);
    setSort('featured');
    setSearch('');
    setSelectedTags([]);
    setSelectedBrands([]);
    setSelectedSizes([]); // Clear sizes
  };

  // Dynamically generate filter options from all products
  const allBrands = Array.from(new Set(products.map(p => p.brand))).filter(Boolean);
  const allColors = Array.from(new Set(products.flatMap(p => (p.colors || []).map(c => c.name)))).filter(Boolean);
  const allSizes = Array.from(new Set(products.flatMap(p => (p.sizes || []).map(s => s.name)))).filter(Boolean);

  // After products are loaded, calculate minPrice and maxPrice
  const prices = products.map(p => p.currentPrice).filter(v => typeof v === 'number');
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 1000;

  if (loading) {
    return (
      <div className="bg-[#fafbfc] min-h-screen">
        {/* Banner Skeleton */}
        <div className="relative h-48 sm:h-56 md:h-64 lg:h-80 flex items-center justify-center bg-gray-300 animate-pulse">
          <div className="text-center">
            <div className="h-8 sm:h-12 md:h-16 bg-gray-400 rounded mb-4 w-48 sm:w-64 md:w-80 animate-pulse"></div>
            <div className="h-4 bg-gray-400 rounded w-32 sm:w-40 animate-pulse"></div>
          </div>
        </div>

        {/* Search and Filters Skeleton */}
        <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 mb-6">
            <div className="w-full sm:w-1/2 lg:w-1/3">
              <div className="h-10 bg-gray-300 rounded animate-pulse"></div>
            </div>
            <div className="h-10 bg-gray-300 rounded w-32 animate-pulse"></div>
          </div>

          {/* Filters Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Sidebar Filters Skeleton */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="h-6 bg-gray-300 rounded mb-6 w-24 animate-pulse"></div>
                
                {/* Category Filter Skeleton */}
                <div className="mb-6">
                  <div className="h-5 bg-gray-300 rounded mb-4 w-20 animate-pulse"></div>
                  <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-300 rounded w-20 animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Filter Skeleton */}
                <div className="mb-6">
                  <div className="h-5 bg-gray-300 rounded mb-4 w-16 animate-pulse"></div>
                  <div className="h-2 bg-gray-300 rounded mb-4 animate-pulse"></div>
                  <div className="flex justify-between">
                    <div className="h-4 bg-gray-300 rounded w-12 animate-pulse"></div>
                    <div className="h-4 bg-gray-300 rounded w-12 animate-pulse"></div>
                  </div>
                </div>

                {/* Brand Filter Skeleton */}
                <div className="mb-6">
                  <div className="h-5 bg-gray-300 rounded mb-4 w-16 animate-pulse"></div>
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-300 rounded w-24 animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Color Filter Skeleton */}
                <div className="mb-6">
                  <div className="h-5 bg-gray-300 rounded mb-4 w-16 animate-pulse"></div>
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                      <div key={i} className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
                    ))}
                  </div>
                </div>

                {/* Size Filter Skeleton */}
                <div className="mb-6">
                  <div className="h-5 bg-gray-300 rounded mb-4 w-12 animate-pulse"></div>
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                      <div key={i} className="w-10 h-8 bg-gray-300 rounded animate-pulse"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid Skeleton */}
            <div className="lg:col-span-3">
              {/* Sort and View Options Skeleton */}
              <div className="flex items-center justify-between mb-6">
                <div className="h-6 bg-gray-300 rounded w-32 animate-pulse"></div>
                <div className="flex gap-2">
                  <div className="w-8 h-8 bg-gray-300 rounded animate-pulse"></div>
                  <div className="w-8 h-8 bg-gray-300 rounded animate-pulse"></div>
                </div>
              </div>

              {/* Products Grid Skeleton */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(i => (
                  <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                    <div className="aspect-square bg-gray-300"></div>
                    <div className="p-4">
                      <div className="h-3 bg-gray-300 rounded mb-2 w-16 animate-pulse"></div>
                      <div className="h-5 bg-gray-300 rounded mb-3 w-3/4 animate-pulse"></div>
                      <div className="flex items-center gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map(star => (
                          <div key={star} className="w-3 h-3 bg-gray-300 rounded animate-pulse"></div>
                        ))}
                        <div className="h-3 bg-gray-300 rounded w-8 animate-pulse ml-1"></div>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="h-5 bg-gray-300 rounded w-16 animate-pulse"></div>
                        <div className="h-4 bg-gray-300 rounded w-12 animate-pulse"></div>
                      </div>
                      <div className="h-10 bg-gray-300 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Skeleton */}
              <div className="flex justify-center mt-8">
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="w-10 h-10 bg-gray-300 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fafbfc] min-h-screen">
      {/* QuickView Modal */}
      {quickViewProduct && (
        <QuickView
          quickViewProduct={quickViewProduct}
          setQuickViewProduct={setQuickViewProduct}
          quickViewQty={quickViewQty}
          setQuickViewQty={setQuickViewQty}
          addToCart={addToCart}
          agreed={agreed}
          setAgreed={setAgreed}
        />
      )}
      {/* Banner/Hero */}
      <div className="relative h-48 sm:h-56 md:h-64 lg:h-80 flex items-center justify-center bg-cover bg-center" style={{backgroundImage: `url('https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=1200&q=80')`}}>
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 tracking-wide">{bannerTitle}</h1>
          <div className="text-xs sm:text-sm flex justify-center gap-1 sm:gap-2 items-center">
            <span className="opacity-80"><Link to="/">Home</Link></span>
            <span className="mx-1">&gt;</span>
            <span className="font-semibold">{bannerTitle}</span> 
          </div>
        </div>
      </div>
      {/* Horizontal Category Icon Bar */}
      {/* <div className="max-w-7xl mx-auto px-4 -mt-10 mb-10 relative z-20">
        <div className="flex flex-wrap justify-center gap-8 bg-white rounded-lg shadow p-6">
          <button key="All" className="flex flex-col items-center group" onClick={() => setCategory('All')}>
            <img src="https://via.placeholder.com/100x100?text=All" alt="All" className={`w-14 h-14 mb-2 rounded-full border-2 ${category === 'All' ? 'border-yellow-600' : 'border-gray-200'} group-hover:border-yellow-600 transition`} />
            <span className={`text-xs font-semibold ${category === 'All' ? 'text-yellow-700' : 'text-gray-700'} group-hover:text-yellow-700`}>All</span>
          </button>
          {categories.map(cat => (
            <button key={cat} className="flex flex-col items-center group" onClick={() => setCategory(cat)}>
              <img src={categoryIconsMap[cat] || categoryIconsMap['Other']} alt={cat} className={`w-14 h-14 mb-2 rounded-full border-2 ${category === cat ? 'border-yellow-600' : 'border-gray-200'} group-hover:border-yellow-600 transition`} />
              <span className={`text-xs font-semibold ${category === cat ? 'text-yellow-700' : 'text-gray-700'} group-hover:text-yellow-700`}>{cat}</span>
            </button>
          ))}
        </div>
      </div> */}
      {/* Search and Clear Filters */}
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSearch && handleSearch(search);
            }}
            className="w-full sm:w-1/2 lg:w-1/3"
          >
            <div className="flex">
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 border border-gray-300 rounded-l px-3 sm:px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <button
                type="submit"
                className="bg-yellow-400 text-white px-3 sm:px-4 py-2 rounded-r font-semibold hover:bg-yellow-500 transition text-sm sm:text-base"
                aria-label="Search"
              >
                Search
              </button>
            </div>
          </form>
          <button
            onClick={handleClearFilters}
            className="w-full sm:w-auto bg-yellow-400 text-white px-4 sm:px-6 py-2 rounded font-semibold hover:bg-yellow-500 transition text-sm sm:text-base"
          >
            Clear Filters
          </button>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 px-4">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => {
              const sidebar = document.getElementById('mobile-filters');
              sidebar.classList.toggle('hidden');
            }}
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-left font-semibold text-sm flex items-center justify-between"
          >
            <span>Filters & Categories</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Sidebar Filters */}
        <aside id="mobile-filters" className="w-full lg:w-64 hidden lg:block pt-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-0 lg:bg-transparent lg:shadow-none lg:border-0">
          <div className="mb-6 lg:mb-8">
            <h3 className="font-bold text-xs uppercase tracking-widest mb-3 lg:mb-4 border-b pb-2">Categories</h3>
            <ul className="space-y-0 text-sm">
              <li key="All">
                <button
                  className={`w-full flex items-center gap-2 text-left hover:translate-x-2 font-semibold text-sm lg:text-base font-[montserrat] px-2 py-2 rounded transition-all duration-200 ${category === 'All' ? 'text-black bg-gray-100' : 'text-gray-600 hover:text-black hover:bg-gray-50'}`}
                  onClick={() => setCategory('All')}
                >
                  <span className={`w-2 h-2 rounded-full mr-2 ${category === 'All' ? 'bg-black' : 'bg-gray-400'}`}></span>
                  <span>All</span>
                </button>
              </li>
              {categories.map(cat => (
                <li key={cat}>
                  <button
                    className={`w-full flex items-center gap-2 text-left hover:translate-x-2 font-semibold text-sm lg:text-base font-[montserrat] px-2 py-2 rounded transition-all duration-200 ${category === cat ? 'text-black bg-gray-100' : 'text-gray-600 hover:text-black hover:bg-gray-50'}`}
                    onClick={() => setCategory(cat)}
                  >
                    <span className={`w-2 h-2 rounded-full mr-2 ${category === cat ? 'bg-black' : 'bg-gray-400'}`}></span>
                    <span>{cat}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="mb-6 lg:mb-8">
            <h3 className="font-bold text-xs uppercase tracking-widest mb-3 lg:mb-4 border-b pb-2">Price</h3>
            <div className="flex flex-col gap-3 lg:gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Min: ${price[0]}</span>
                <span className="mx-1">-</span>
                <span className="text-xs text-gray-500">Max: ${price[1]}</span>
              </div>
              
              {/* Custom Range Slider */}
              <div className="relative w-full h-6">
                {/* Track */}
                <div className="absolute top-1/2 transform -translate-y-1/2 w-full h-2 bg-gray-200 rounded-full"></div>
                
                {/* Selected Range */}
                <div 
                  className="absolute top-1/2 transform -translate-y-1/2 h-2 bg-yellow-400 rounded-full"
                  style={{
                    left: `${(price[0] / maxPrice) * 100}%`,
                    width: `${((price[1] - price[0]) / maxPrice) * 100}%`
                  }}
                ></div>
                
                {/* Min Handle */}
                <div 
                  className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white border-2 border-yellow-400 rounded-full cursor-pointer shadow-md hover:shadow-lg transition-shadow"
                  style={{ left: `${(price[0] / maxPrice) * 100}%`, marginLeft: '-8px' }}
                  onMouseDown={(e) => {
                    const slider = e.target.parentElement;
                    const rect = slider.getBoundingClientRect();
                    
                    const handleMouseMove = (moveEvent) => {
                      const x = moveEvent.clientX - rect.left;
                      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
                      const newValue = Math.round((percentage / 100) * maxPrice);
                      const clampedValue = Math.min(newValue, price[1] - 10);
                      setPrice([clampedValue, price[1]]);
                    };
                    
                    const handleMouseUp = () => {
                      document.removeEventListener('mousemove', handleMouseMove);
                      document.removeEventListener('mouseup', handleMouseUp);
                    };
                    
                    document.addEventListener('mousemove', handleMouseMove);
                    document.addEventListener('mouseup', handleMouseUp);
                  }}
                ></div>
                
                {/* Max Handle */}
                <div 
                  className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white border-2 border-yellow-400 rounded-full cursor-pointer shadow-md hover:shadow-lg transition-shadow"
                  style={{ left: `${(price[1] / maxPrice) * 100}%`, marginLeft: '-8px' }}
                  onMouseDown={(e) => {
                    const slider = e.target.parentElement;
                    const rect = slider.getBoundingClientRect();
                    
                    const handleMouseMove = (moveEvent) => {
                      const x = moveEvent.clientX - rect.left;
                      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
                      const newValue = Math.round((percentage / 100) * maxPrice);
                      const clampedValue = Math.max(newValue, price[0] + 10);
                      setPrice([price[0], clampedValue]);
                    };
                    
                    const handleMouseUp = () => {
                      document.removeEventListener('mousemove', handleMouseMove);
                      document.removeEventListener('mouseup', handleMouseUp);
                    };
                    
                    document.addEventListener('mousemove', handleMouseMove);
                    document.addEventListener('mouseup', handleMouseUp);
                  }}
                ></div>
              </div>
              
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={minPrice}
                  max={price[1] - 10}
                value={price[0]}
                  onChange={e => {
                    let val = Math.max(minPrice, Math.min(+e.target.value, price[1] - 10));
                    setPrice([val, price[1]]);
                  }}
                  className="w-16 border border-gray-300 rounded px-2 py-1 text-sm"
                />
                <span className="text-gray-500">-</span>
              <input
                type="number"
                  min={price[0] + 10}
                max={maxPrice}
                value={price[1]}
                  onChange={e => {
                    let val = Math.min(maxPrice, Math.max(+e.target.value, price[0] + 10));
                    setPrice([price[0], val]);
                  }}
                  className="w-16 border border-gray-300 rounded px-2 py-1 text-sm"
                />
              </div>
            </div>
          </div>
          <div className="mb-6 lg:mb-8">
            <h3 className="font-bold text-xs uppercase tracking-widest mb-3 lg:mb-4 border-b pb-2">Color</h3>
            <div className="flex gap-1 sm:gap-2 flex-wrap">
              <button
                key="All"
                className={`px-2 sm:px-3 py-1 rounded border text-xs ${color === 'All' ? 'border-yellow-600 bg-yellow-50' : 'border-gray-200 bg-gray-50'}`}
                onClick={() => setColor('All')}
              >All</button>
              {allColors.map(col => (
                <button
                  key={col}
                  className={`px-2 sm:px-3 py-1 rounded border text-xs capitalize ${color === col ? 'border-yellow-600 bg-yellow-50' : 'border-gray-200 bg-gray-50'}`}
                  onClick={() => setColor(col)}
                >{col}</button>
              ))}
            </div>
          </div>
          <div className="mb-6 lg:mb-8">
            <h3 className="font-bold text-xs uppercase tracking-widest mb-3 lg:mb-4 border-b pb-2">Size</h3>
            <div className="flex gap-1 sm:gap-2 flex-wrap">
              {allSizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size])}
                  className={`px-2 sm:px-3 py-1 rounded border text-xs capitalize ${selectedSizes.includes(size) ? 'border-yellow-600 bg-yellow-50' : 'border-gray-200 bg-gray-50'}`}
                >{size}</button>
              ))}
            </div>
          </div>
          <div className="mb-6 lg:mb-8">
            <h3 className="font-bold text-xs uppercase tracking-widest mb-3 lg:mb-4 border-b pb-2">Brand</h3>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {allBrands.map(brand => (
                <button
                  key={brand}
                  onClick={() => setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand])}
                  className={`px-2 py-1 text-xs rounded border transition-all duration-150
                    ${selectedBrands.includes(brand)
                      ? 'border-yellow-500 bg-yellow-100 text-yellow-800 font-bold'
                      : 'border-gray-300 bg-gray-50 text-gray-700 hover:border-yellow-400 hover:bg-yellow-50'}`}
                >{brand}</button>
              ))}
            </div>
          </div>
        </aside>
        {/* Product Grid & Sort */}
        <main className="flex-1 pt-2">
          <div className="flex items-center justify-between sm:justify-end mb-4 sm:mb-6">
            <div className="lg:hidden text-sm text-gray-600">
              {sorted.length} products found
            </div>
            <label className="flex items-center gap-2 font-[montserrat]">
              <span className="text-xs text-gray-500">Sort by:</span>
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="border rounded px-2 py-1 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
                aria-label="Sort products"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A-Z</option>
                <option value="name-desc">Name: Z-A</option>
              </select>
            </label>
          </div>
          {/* Loading State */}
          {loading ? (
            <div className="col-span-full text-center py-12 sm:py-20">
              <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-yellow-500 mx-auto mb-4"></div>
              <div className="text-gray-500 text-sm sm:text-base">Loading products...</div>
            </div>
          ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 xl:gap-12">
            {sorted.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 py-12 sm:py-20">
                <div className="text-lg sm:text-xl font-semibold mb-2">No products found</div>
                <div className="text-sm text-gray-400">Try adjusting your filters</div>
              </div>
            ) : (
              sorted.map(product => (
                <ProductCard
                    key={product.id || product._id}
                    product={{
                      ...product,
                      id: product.id || product._id,
                      name: product.name,
                      image: product.image || (Array.isArray(product.images) && product.images[0]?.url) || "https://via.placeholder.com/300x300?text=No+Image",
                      currentPrice: product.currentPrice ?? product.price ?? 0
                    }}
                  quickCartProductId={quickCartProductId}
                  setQuickCartProductId={setQuickCartProductId}
                    quickCartQty={quickCartProductId === (product.id || product._id) ? quickCartQty : 1}
                  setQuickCartQty={setQuickCartQty}
                  addToCart={addToCart}
                  addToWishlist={() => {
                      addToWishlist({
                        ...product,
                        id: product.id || product._id,
                        name: product.name,
                        image: product.image || (Array.isArray(product.images) && product.images[0]?.url) || "https://via.placeholder.com/300x300?text=No+Image",
                        currentPrice: product.currentPrice ?? product.price ?? 0
                      });
                    toast.success('Added to wishlist!');
                  }}
                  setQuickViewProduct={setQuickViewProduct}
                  setQuickViewQty={setQuickViewQty}
                  setAgreed={setAgreed}
                />
            ))
            )}
          </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Shop; 