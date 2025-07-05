import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const BlogRead = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [commentError, setCommentError] = useState('');
  const [showFullContent, setShowFullContent] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`/api/blogs/${id}`);
        setBlog(res.data.blog || res.data);
      } catch {
        setError('Failed to load blog post.');
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (scrollTop / docHeight) * 100;
      setScrollProgress(scrolled);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setCommentError('Comment cannot be empty.');
      return;
    }
    setComments([
      ...comments,
      {
        text: comment,
        date: new Date(),
        user: 'Guest',
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=G${Math.floor(Math.random() * 1000)}`
      }
    ]);
    setComment('');
    setCommentError('');
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString(undefined, {
      year: 'numeric', month: 'long', day: 'numeric'
    });

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString(undefined, {
      hour: '2-digit', minute: '2-digit'
    });

  const contentPreviewLength = 1200;
  const isLongContent = blog?.content && blog.content.length > contentPreviewLength;
  const displayedContent = showFullContent || !isLongContent
    ? blog?.content
    : blog?.content.slice(0, contentPreviewLength) + '...';

  const coverImage = blog?.image?.url || blog?.image || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80';

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-white text-black">Loading blog post...</div>;
  if (error) return <div className="flex items-center justify-center min-h-screen text-red-500 bg-white text-black">{error}</div>;
  if (!blog) return <div className="flex items-center justify-center min-h-screen text-gray-500 bg-white text-black">Blog post not found.</div>;

  return (
    <div className="min-h-screen w-full bg-white text-black font-sans">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-yellow-100 z-50">
        <div
          className="h-full bg-yellow-400 transition-all duration-200 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Breadcrumb Header */}
      <header className="w-full border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-6">
          <nav className="flex items-center text-sm text-gray-600 gap-2">
            <Link to="/" className="hover:text-yellow-500 font-medium">Home</Link>
            <span>/</span>
            <Link to="/blog" className="hover:text-yellow-500 font-medium">Blog</Link>
            <span>/</span>
            <span className="text-black font-semibold truncate max-w-[400px]" title={blog.title}>{blog.title}</span>
          </nav>
        </div>
      </header>

      {/* Cover Image & Title */}
      <div className="relative w-full h-[400px]">
        <img src={coverImage} alt={blog.title} className="w-full h-full object-cover object-center" style={{ filter: 'brightness(0.6)' }} />
        <div className="absolute bottom-0 left-0 w-full px-4 md:px-16 pb-10">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white bg-black/50 px-6 py-4 rounded-2xl inline-block">
            {blog.title}
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 md:px-0 mt-12">
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
          {blog.category && <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full uppercase">{blog.category}</span>}
          {blog.readTime && <span>{blog.readTime} min read</span>}
          <span>{formatDate(blog.createdAt)}</span>
        </div>

        {/* Blog Body */}
        <article className="prose prose-lg max-w-none text-black prose-headings:text-black prose-a:text-yellow-600 hover:prose-a:text-yellow-800">
          <div dangerouslySetInnerHTML={{ __html: displayedContent }} />
          {isLongContent && !showFullContent && (
            <button
              onClick={() => setShowFullContent(true)}
              className="mt-4 text-yellow-600 underline hover:text-yellow-800 font-medium"
            >
              Read more
            </button>
          )}
        </article>

        {/* Scroll to Comments Button */}
        <div className="mt-12 flex justify-center">
          <button
            onClick={() => document.getElementById('comments')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-6 py-3 bg-yellow-400 text-black rounded-full hover:bg-yellow-500 font-medium shadow-md transition"
          >
            Join the Conversation ↓
          </button>
        </div>

        {/* Author Bio */}
        <div className="mt-24 bg-yellow-50 border border-yellow-100 rounded-lg p-6 flex items-center gap-6">
          <img
            src={blog.author?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${blog.author?.name || 'Admin'}`}
            alt="Author avatar"
            className="w-20 h-20 rounded-full object-cover border-2 border-white shadow"
          />
          <div>
            <h4 className="text-lg font-semibold text-yellow-900">{blog.author?.name || 'Admin'}</h4>
            <p className="text-sm text-yellow-800 mt-1">Writer & storyteller passionate about knowledge sharing.</p>
          </div>
        </div>

        {/* Comments Section */}
        <section id="comments" className="mt-20">
          <h2 className="text-2xl font-bold mb-4">Comments</h2>
          <form onSubmit={handleCommentSubmit} className="mb-10 bg-gray-50 p-6 rounded-lg border">
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300 text-base resize-none"
              placeholder="Write a comment..."
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-400">{comment.length}/500</span>
              {commentError && <span className="text-red-500 text-xs">{commentError}</span>}
            </div>
            <button type="submit" className="mt-4 bg-yellow-400 text-black px-6 py-2 rounded hover:bg-yellow-500 font-medium">
              Post Comment
            </button>
          </form>

          {comments.length === 0 ? (
            <p className="text-gray-500">No comments yet.</p>
          ) : (
            <div className="space-y-4">
              {comments.map((c, i) => (
                <div key={i} className="flex gap-4 bg-gray-50 p-4 rounded border">
                  <img
                    src={c.avatar}
                    alt="User avatar"
                    className="w-10 h-10 rounded-full border"
                  />
                  <div>
                    <div className="text-sm font-semibold text-black">{c.user}</div>
                    <div className="text-xs text-gray-500">{formatDate(c.date)} at {formatTime(c.date)}</div>
                    <p className="text-sm mt-1">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default BlogRead;
