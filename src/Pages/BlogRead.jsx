import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

const BlogRead = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageLoadingStates, setImageLoadingStates] = useState({});

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const [blogRes, recentRes] = await Promise.all([
          api.get(`/blogs/${id}`),
          api.get('/blogs?limit=5')
        ]);
        
        setBlog(blogRes.data.blog || blogRes.data);
        setRecentBlogs(recentRes.data.blogs || recentRes.data);
      } catch (err) {
        console.error('Error fetching blog:', err);
        setError('Failed to load blog post.');
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const handleImageLoad = (imageId) => {
    setImageLoadingStates(prev => ({
      ...prev,
      [imageId]: false
    }));
  };

  const handleImageError = (imageId) => {
    setImageLoadingStates(prev => ({
      ...prev,
      [imageId]: false
    }));
  };

  // Function to format blog content with proper styling
  const formatBlogContent = (content) => {
    if (!content) return '';
    
    // Add custom styling classes to the content
    return content
      .replace(/<h1/g, '<h1 class="text-3xl font-bold text-gray-900 mb-4 mt-8"')
      .replace(/<h2/g, '<h2 class="text-2xl font-bold text-gray-900 mb-3 mt-6"')
      .replace(/<h3/g, '<h3 class="text-xl font-bold text-gray-900 mb-3 mt-5"')
      .replace(/<h4/g, '<h4 class="text-lg font-bold text-gray-900 mb-2 mt-4"')
      .replace(/<h5/g, '<h5 class="text-base font-bold text-gray-900 mb-2 mt-3"')
      .replace(/<h6/g, '<h6 class="text-sm font-bold text-gray-900 mb-2 mt-2"')
      .replace(/<p/g, '<p class="text-gray-700 leading-relaxed mb-4"')
      .replace(/<ul/g, '<ul class="list-disc list-inside mb-4 space-y-1"')
      .replace(/<ol/g, '<ol class="list-decimal list-inside mb-4 space-y-1"')
      .replace(/<li/g, '<li class="text-gray-700"')
      .replace(/<blockquote/g, '<blockquote class="border-l-4 border-gray-300 pl-4 italic text-gray-600 mb-4"')
      .replace(/<code/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono"')
      .replace(/<pre/g, '<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4"')
      .replace(/<a/g, '<a class="text-blue-600 hover:text-blue-800 underline"')
      .replace(/<strong/g, '<strong class="font-bold text-gray-900"')
      .replace(/<em/g, '<em class="italic"')
      .replace(/<img/g, '<img class="max-w-full h-auto rounded-lg shadow-md my-4"');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content Skeleton */}
            <div className="lg:col-span-3">
              {/* Title Skeleton */}
              <div className="mb-8">
                <div className="h-8 bg-gray-300 rounded mb-4 w-3/4 animate-pulse"></div>
                <div className="h-6 bg-gray-300 rounded mb-2 w-1/2 animate-pulse"></div>
                <div className="h-4 bg-gray-300 rounded w-1/3 animate-pulse"></div>
              </div>

              {/* Featured Image Skeleton */}
              <div className="mb-8">
                <div className="h-64 sm:h-80 md:h-96 bg-gray-300 rounded-lg animate-pulse"></div>
              </div>

              {/* Content Skeleton */}
              <div className="prose prose-lg max-w-none">
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i}>
                      <div className="h-4 bg-gray-300 rounded w-full animate-pulse mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-5/6 animate-pulse mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-4/6 animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Skeleton */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <div className="h-6 bg-gray-300 rounded mb-6 w-32 animate-pulse"></div>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-16 h-16 bg-gray-300 rounded-md animate-pulse flex-shrink-0"></div>
                      <div className="flex-1">
                        <div className="h-3 bg-gray-300 rounded mb-2 w-full animate-pulse"></div>
                        <div className="h-3 bg-gray-300 rounded mb-1 w-3/4 animate-pulse"></div>
                        <div className="h-3 bg-gray-300 rounded w-1/2 animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <div className="h-10 bg-gray-300 rounded w-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        <div className="text-center">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-2xl font-bold mb-2">Oops!</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!blog || !blog._id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold mb-2">Blog not found</h2>
          <p className="text-gray-600 mb-4">The blog post you're looking for doesn't exist.</p>
          <Link to="/blog" className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb Navigation */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <Link 
              to="/" 
              className="hover:text-gray-700 transition-colors flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </Link>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link 
              to="/blog" 
              className="hover:text-gray-700 transition-colors"
            >
              Blog
            </Link>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 font-medium truncate max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl">
              {blog?.title || 'Blog Post'}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Title */}
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-center capitalize">
                {blog?.title || 'Untitled Blog Post'}
              </h1>
              <div className="flex items-center justify-center gap-4 text-sm text-gray-500 mb-6">
                <span>📅 {blog?.createdAt ? new Date(blog.createdAt).toLocaleDateString() : 'Unknown date'}</span>
                <span>👁️ {blog?.views || 0} views</span>
                {blog?.author && (
                  <span>✍️ {
                    typeof blog.author === 'object' && blog.author?.name 
                      ? blog.author.name 
                      : blog.author
                  }</span>
                )}
              </div>
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {blog?.tags?.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Featured Image */}
            {(blog?.image?.url || blog?.image) && (
              <div className="mb-8">
                <div className="relative h-64 sm:h-80 md:h-96 bg-gray-200 rounded-lg overflow-hidden">
                  {imageLoadingStates[blog._id] !== false && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse">
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-16 h-16 bg-gray-300 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  )}
                  
                  <img
                    src={blog.image?.url || blog.image}
                    alt={blog.title || 'Blog image'}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${
                      imageLoadingStates[blog._id] !== false ? 'opacity-0' : 'opacity-100'
                    }`}
                    loading="lazy"
                    onLoad={() => handleImageLoad(blog._id)}
                    onError={() => handleImageError(blog._id)}
                  />
                </div>
              </div>
            )}

            {/* Content */}
            <div 
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-a:text-blue-600 prose-blockquote:border-l-blue-500 prose-code:bg-gray-100 prose-code:text-gray-800 prose-pre:bg-gray-900 prose-pre:text-gray-100"
              dangerouslySetInnerHTML={{ __html: formatBlogContent(blog?.content || '') }}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Latest Posts</h3>
              <div className="space-y-4">
                {recentBlogs
                  .filter(recentBlog => recentBlog._id !== blog._id)
                  .slice(0, 5)
                  .map((recentBlog) => (
                    <Link
                      key={recentBlog._id}
                      to={`/blog/${recentBlog._id}`}
                      className="flex gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="relative w-16 h-16 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                        {imageLoadingStates[recentBlog._id] !== false && (
                          <div className="absolute inset-0 bg-gray-200 animate-pulse">
                            <div className="w-full h-full flex items-center justify-center">
                              <div className="w-6 h-6 bg-gray-300 rounded-full animate-pulse"></div>
                            </div>
                          </div>
                        )}
                        
                        <img
                          src={recentBlog.image?.url || recentBlog.image || '/placeholder-image.jpg'}
                          alt={recentBlog.title || 'Recent blog'}
                          className={`w-full h-full object-cover transition-opacity duration-300 ${
                            imageLoadingStates[recentBlog._id] !== false ? 'opacity-0' : 'opacity-100'
                          }`}
                          loading="lazy"
                          onLoad={() => handleImageLoad(recentBlog._id)}
                          onError={() => handleImageError(recentBlog._id)}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
                          {recentBlog.title || 'Untitled'}
                        </h4>
                        <p className="text-xs text-gray-500 mb-1">
                          {recentBlog.createdAt ? new Date(recentBlog.createdAt).toLocaleDateString() : 'Unknown date'}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {recentBlog.tags?.slice(0, 2).map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-0.5 bg-gray-200 text-gray-600 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
              <div className="mt-6">
                <Link
                  to="/blog"
                  className="block w-full bg-black text-white py-3 px-4 rounded-lg text-center font-medium hover:bg-gray-800 transition-colors"
                >
                  View All Posts
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogRead;
