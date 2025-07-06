import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState([]);
  const [blogStats, setBlogStats] = useState({
    totalBlogs: 0,
    totalCategories: 0,
    featuredPosts: 0
  });

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await api.get('/blogs');
        const blogsData = res.data.blogs || res.data;
        setBlogs(blogsData);
        
        // Extract unique categories from blogs
        const uniqueCategories = [...new Set(
          blogsData.flatMap(blog => blog.tags || [])
        )].filter(Boolean);
        
        setCategories(['All', ...uniqueCategories]);
        
        // Calculate stats
        setBlogStats({
          totalBlogs: blogsData.length,
          totalCategories: uniqueCategories.length,
          featuredPosts: blogsData.filter(blog => blog.featured).length
        });
      } catch {
        setError('Failed to load blogs.');
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const filteredBlogs =
    selectedCategory === 'All'
      ? blogs
      : blogs.filter((b) =>
          b.tags?.some((tag) =>
            tag.toLowerCase().includes(selectedCategory.toLowerCase())
          )
        );

  const getCategoryCount = (category) => {
    if (category === 'All') return blogs.length;
    return blogs.filter(blog => 
      blog.tags?.some(tag => 
        tag.toLowerCase().includes(category.toLowerCase())
      )
    ).length;
  };

  if (loading)
    return (
      <div className="font-sans bg-white min-h-screen">
        {/* Hero Banner Skeleton */}
        <div className="relative h-[300px] sm:h-[350px] md:h-[400px] w-full bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 sm:h-12 md:h-16 bg-gray-300 rounded mb-4 w-64 sm:w-96 md:w-[500px] mx-auto"></div>
              <div className="h-4 sm:h-6 md:h-8 bg-gray-300 rounded mb-6 w-80 sm:w-[400px] md:w-[600px] mx-auto"></div>
              <div className="flex justify-center gap-4">
                <div className="h-6 bg-gray-300 rounded-full w-20 animate-pulse"></div>
                <div className="h-6 bg-gray-300 rounded-full w-24 animate-pulse"></div>
                <div className="h-6 bg-gray-300 rounded-full w-20 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Section Skeleton */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="text-center mb-6 sm:mb-8">
            <div className="h-8 bg-gray-300 rounded mb-2 w-48 mx-auto animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded w-64 mx-auto animate-pulse"></div>
          </div>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-10 bg-gray-300 rounded-full w-24 animate-pulse"></div>
            ))}
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Blog Grid Skeleton */}
          <div className="lg:col-span-3">
            <div className="mb-4 sm:mb-6">
              <div className="h-6 bg-gray-300 rounded mb-2 w-32 animate-pulse"></div>
              <div className="h-4 bg-gray-300 rounded w-48 animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm animate-pulse">
                  <div className="h-40 sm:h-48 md:h-52 bg-gray-300"></div>
                  <div className="p-4 sm:p-6">
                    <div className="flex gap-2 mb-3">
                      <div className="h-3 bg-gray-300 rounded w-16"></div>
                      <div className="h-3 bg-gray-300 rounded w-20"></div>
                      <div className="h-3 bg-gray-300 rounded w-16"></div>
                    </div>
                    <div className="h-5 bg-gray-300 rounded mb-3 w-3/4"></div>
                    <div className="space-y-2 mb-4">
                      <div className="h-3 bg-gray-300 rounded w-full"></div>
                      <div className="h-3 bg-gray-300 rounded w-5/6"></div>
                      <div className="h-3 bg-gray-300 rounded w-4/6"></div>
                    </div>
                    <div className="flex gap-2 mb-4">
                      <div className="h-6 bg-gray-300 rounded-full w-16"></div>
                      <div className="h-6 bg-gray-300 rounded-full w-20"></div>
                    </div>
                    <div className="h-8 bg-gray-300 rounded w-24"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="lg:col-span-1">
            <div className="h-6 bg-gray-300 rounded mb-4 w-32 animate-pulse"></div>
            <div className="space-y-3 sm:space-y-5">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="flex items-start gap-2 sm:gap-3 p-2">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-300 rounded-md animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-3 bg-gray-300 rounded mb-2 w-full animate-pulse"></div>
                    <div className="h-3 bg-gray-300 rounded w-20 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        <div className="text-center">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-2xl font-bold mb-2">Oops!</h2>
          <p>{error}</p>
        </div>
      </div>
    );

  return (
    <div className="font-sans bg-white min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-[300px] sm:h-[350px] md:h-[400px] w-full bg-gradient-to-r from-gray-900 to-black flex items-center justify-center text-white text-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2128&q=80")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-3 sm:mb-4">Discover Amazing Stories</h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-4 sm:mb-6 opacity-90">Explore insights, tips, and stories from our community</p>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 text-xs sm:text-sm">
            <div className="bg-white/20 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
              📝 {blogStats.totalBlogs} Articles
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
              🏷️ {blogStats.totalCategories} Categories
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
              ⭐ {blogStats.featuredPosts} Featured
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-black mb-2">Browse by Category</h2>
          <p className="text-sm sm:text-base text-gray-600">Find content that interests you most</p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
          {categories.map((cat, i) => (
            <button
              key={i}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-xs sm:text-sm rounded-full border transition-all duration-300 ${
                selectedCategory === cat
                  ? 'bg-black text-white border-black shadow-lg transform scale-105'
                  : 'text-gray-600 hover:bg-gray-100 border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="font-medium">{cat}</span>
              <span className={`ml-1 sm:ml-2 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs ${
                selectedCategory === cat ? 'bg-white/20' : 'bg-gray-100'
              }`}>
                {getCategoryCount(cat)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
        {/* Blog Grid */}
        <div className="lg:col-span-3">
          <div className="mb-4 sm:mb-6">
            <h3 className="text-xl sm:text-2xl font-bold text-black mb-2">
              {selectedCategory === 'All' ? 'All Posts' : `${selectedCategory} Posts`}
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              Showing {filteredBlogs.length} of {blogs.length} posts
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {filteredBlogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full"
              >
                <div className="relative">
                  <img
                    src={
                      blog.image?.url ||
                      blog.image ||
                      'https://via.placeholder.com/600x300?text=No+Image'
                    }
                    alt={blog.title}
                    className="w-full h-40 sm:h-48 md:h-52 object-cover"
                    loading="lazy"
                    onError={e => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/600x300?text=No+Image';
                    }}
                  />
                  {blog.featured && (
                    <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-black text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-bold">
                      ⭐ Featured
                    </div>
                  )}
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
                      <span className="bg-black text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs">
                        {blog.tags[0]}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4 sm:p-6 flex flex-col h-full">
                  <div className="flex flex-wrap items-center text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3 gap-1 sm:gap-2">
                    <span>📅 {new Date(blog.createdAt).toLocaleDateString()}</span>
                    <span className="hidden sm:inline">•</span>
                    <span>👤 {(typeof blog.author === 'object' && blog.author?.name) || blog.author || 'Admin'}</span>
                    {blog.readTime && (
                      <>
                        <span className="hidden sm:inline">•</span>
                        <span>⏱️ {blog.readTime} min read</span>
                      </>
                    )}
                  </div>
                  
                  <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-black line-clamp-2">
                    {blog.title}
                  </h2>
                  
                  <div 
                    className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-3 flex-grow"
                    dangerouslySetInnerHTML={{ __html: blog.content.slice(0,100)  || (blog.content?.slice(0, 150) + '...') }}
                  />
                  
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
                      {blog.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-600 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <Link
                    to={`/blog/${blog._id}`}
                    className="mt-auto inline-flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 w-1/2 mx-auto text-white font-semibold text-xs sm:text-sm transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl px-4 sm:px-6 py-2 sm:py-3 rounded-lg border-0"
                  >
                    Read More 
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-gray-800">Latest Posts</h3>
          <div className="space-y-3 sm:space-y-5">
            {blogs.slice(0, 6).map((blog) => (
              <Link
                key={blog._id}
                to={`/blog/${blog._id}`}
                className="flex items-start gap-2 sm:gap-3 hover:bg-gray-50 p-2 rounded-md transition"
              >
                <img
                  src={
                    blog.image?.url ||
                    blog.image ||
                    'https://via.placeholder.com/80x80?text=No+Image'
                  }
                  className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-md"
                  alt="thumb"
                  loading="lazy"
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-2">
                    {blog.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog; 