import React, { useEffect, useState, useRef } from 'react';
import AdminLayout from './components/AdminLayout';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add' | 'edit' | 'view'
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [form, setForm] = useState({ title: '', excerpt: '', content: '', category: '', tags: '', status: 'draft', image: { url: '', public_id: '' } });
  const [submitting, setSubmitting] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const fileInputRef = useRef();
  const imageUploadRef = useRef();

  // TipTap Editor Configuration
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      Placeholder.configure({
        placeholder: 'Start writing your blog content...',
      }),
      TextStyle,
      Color,
    ],
    content: form.content,
    onUpdate: ({ editor }) => {
      setForm(prev => ({ ...prev, content: editor.getHTML() }));
    },
  });

  // Update editor content when form changes
  useEffect(() => {
    if (editor && form.content !== editor.getHTML()) {
      editor.commands.setContent(form.content);
    }
  }, [form.content, editor]);

  const fetchBlogs = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/admin/blogs');
      setBlogs(res.data.blogs || []);
    } catch {
      setError('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBlogs(); }, []);

  const openModal = (type, blog = null) => {
    setModalType(type);
    setSelectedBlog(blog);
    if (type === 'edit' && blog) {
      setForm({
        title: blog.title,
        excerpt: blog.excerpt || '',
        content: blog.content,
        category: blog.category,
        tags: (blog.tags || []).join(', '),
        status: blog.status || 'draft',
        image: blog.image || { url: '', public_id: '' },
      });
    } else if (type === 'add') {
      setForm({ title: '', excerpt: '', content: '', category: '', tags: '', status: 'draft', image: { url: '', public_id: '' } });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBlog(null);
    setForm({ title: '', excerpt: '', content: '', category: '', tags: '', status: 'draft', image: { url: '', public_id: '' } });
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleImageChange = async e => {
    const file = e.target.files[0];
    if (!file) return;
    setImageUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await api.post('/admin/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setForm(f => ({ ...f, image: { url: res.data.url, public_id: res.data.public_id } }));
    } catch {
      setError('Image upload failed');
    } finally {
      setImageUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setForm(f => ({ ...f, image: { url: '', public_id: '' } }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setImageUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const res = await api.post('/admin/upload', formData, { 
        headers: { 'Content-Type': 'multipart/form-data' } 
      });
      
      editor.chain().focus().setImage({ src: res.data.url }).run();
      toast.success('Image uploaded successfully!');
    } catch {
      toast.error('Image upload failed');
    } finally {
      setImageUploading(false);
      setShowImageUpload(false);
      if (imageUploadRef.current) {
        imageUploadRef.current.value = '';
      }
    }
  };

  const setLink = () => {
    const url = prompt('Enter URL');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const payload = {
        ...form,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      };
      if (modalType === 'add') {
        await api.post('/admin/blogs', payload);
        toast.success('Blog added successfully!');
      } else if (modalType === 'edit' && selectedBlog) {
        await api.put(`/admin/blogs/${selectedBlog._id}`, payload);
        toast.success('Blog updated successfully!');
      }
      fetchBlogs();
      closeModal();
    } catch {
      setError('Failed to save blog');
      toast.error('Failed to save blog');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;
    setSubmitting(true);
    try {
      await api.delete(`/admin/blogs/${id}`);
      fetchBlogs();
      toast.success('Blog deleted successfully!');
    } catch {
      setError('Failed to delete blog');
      toast.error('Failed to delete blog');
    } finally {
      setSubmitting(false);
    }
  };

  if (!editor) {
    return null;
  }

  // Loading skeleton
  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-4 space-y-3">
                <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Blog Management</h1>
            <p className="text-gray-600 mt-1">Create and manage your blog posts</p>
          </div>
          <button
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 w-full sm:w-auto justify-center"
            onClick={() => openModal('add')}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Add New Blog
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Empty State */}
        {blogs.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No blogs yet</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first blog post</p>
            <button
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              onClick={() => openModal('add')}
            >
              Create Your First Blog
            </button>
          </div>
        )}

        {/* Blog Cards */}
        {blogs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {blogs.map(blog => (
              <div key={blog._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden border border-gray-100">
                {/* Blog Image */}
                <div className="relative h-48 bg-gray-100">
                  {blog.image?.url ? (
                    <img 
                      src={blog.image.url} 
                      alt={blog.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                  )}
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      blog.status === 'published' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {blog.status}
                    </span>
                  </div>
                </div>

                {/* Blog Content */}
                <div className="p-4 space-y-3">
                  <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm sm:text-base">
                    {blog.title}
                  </h3>
                  
                  {blog.excerpt && (
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {blog.excerpt}
                    </p>
                  )}

                  {/* Meta Information */}
                  <div className="space-y-2 text-xs text-gray-500">
                    {blog.category && (
                      <div className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                        </svg>
                        {blog.category}
                      </div>
                    )}
                    
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                        </svg>
                        {blog.tags.slice(0, 2).join(', ')}
                        {blog.tags.length > 2 && ` +${blog.tags.length - 2}`}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {blog.author?.avatar?.url && (
                          <img 
                            src={blog.author.avatar.url} 
                            alt={blog.author.name} 
                            className="w-5 h-5 rounded-full object-cover"
                          />
                        )}
                        <span>{blog.author?.name || 'Admin'}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                          </svg>
                          {blog.likes?.length || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                          </svg>
                          {blog.comments?.length || 0}
                        </span>
                      </div>
                    </div>

                    {blog.createdAt && (
                      <div className="text-xs text-gray-400">
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-3 border-t border-gray-100">
                    <button 
                      className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                      onClick={() => openModal('view', blog)}
                    >
                      View
                    </button>
                    <button 
                      className="flex-1 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                      onClick={() => openModal('edit', blog)}
                    >
                      Edit
                    </button>
                    <button 
                      className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                      onClick={() => handleDelete(blog._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for Add/Edit/View */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                {modalType === 'add' ? 'Add New Blog' : modalType === 'edit' ? 'Edit Blog' : 'Blog Details'}
              </h3>
              <button 
                onClick={closeModal} 
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {modalType === 'view' ? (
                <div className="space-y-6">
                  {selectedBlog.image?.url && (
                    <img 
                      src={selectedBlog.image.url} 
                      alt={selectedBlog.title} 
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  )}
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><span className="font-semibold text-gray-700">Title:</span> {selectedBlog.title}</div>
                    <div><span className="font-semibold text-gray-700">Status:</span> 
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
                        selectedBlog.status === 'published' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {selectedBlog.status}
                      </span>
                    </div>
                    <div><span className="font-semibold text-gray-700">Category:</span> {selectedBlog.category || '-'}</div>
                    <div><span className="font-semibold text-gray-700">Tags:</span> {(selectedBlog.tags || []).join(', ') || '-'}</div>
                    <div><span className="font-semibold text-gray-700">Likes:</span> {selectedBlog.likes?.length || 0}</div>
                    <div><span className="font-semibold text-gray-700">Comments:</span> {selectedBlog.comments?.length || 0}</div>
                  </div>
                  
                  {selectedBlog.excerpt && (
                    <div>
                      <span className="font-semibold text-gray-700">Excerpt:</span>
                      <p className="mt-1 text-gray-600">{selectedBlog.excerpt}</p>
                    </div>
                  )}
                  
                  <div>
                    <span className="font-semibold text-gray-700">Content:</span>
                    <div className="prose max-w-none mt-2" dangerouslySetInnerHTML={{ __html: selectedBlog.content }} />
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} autoComplete="off" className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-2">Title *</label>
                      <input 
                        type="text" 
                        name="title" 
                        value={form.title} 
                        onChange={handleChange} 
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200" 
                        required 
                        maxLength={200}
                        placeholder="Enter blog title..."
                      />
                    </div>
                    
                    <div>
                      <label className="block font-semibold text-gray-700 mb-2">Status</label>
                      <select 
                        name="status" 
                        value={form.status} 
                        onChange={handleChange} 
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-2">Excerpt</label>
                    <input 
                      type="text" 
                      name="excerpt" 
                      value={form.excerpt} 
                      onChange={handleChange} 
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200" 
                      maxLength={300} 
                      placeholder="Short summary for preview..."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-2">Category</label>
                      <input 
                        type="text" 
                        name="category" 
                        value={form.category} 
                        onChange={handleChange} 
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200" 
                        maxLength={100}
                        placeholder="e.g., Technology, Fashion..."
                      />
                    </div>
                    
                    <div>
                      <label className="block font-semibold text-gray-700 mb-2">Tags (comma separated)</label>
                      <input 
                        type="text" 
                        name="tags" 
                        value={form.tags} 
                        onChange={handleChange} 
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200" 
                        maxLength={200}
                        placeholder="e.g., tech, fashion, lifestyle..."
                      />
                    </div>
                  </div>

                  {/* Featured Image */}
                  <div>
                    <label className="block font-semibold text-gray-700 mb-2">Featured Image</label>
                    {form.image?.url ? (
                      <div className="mb-4">
                        <img src={form.image.url} alt="Blog" className="w-32 h-24 object-cover rounded-lg border" />
                        <button 
                          type="button" 
                          className="text-red-600 hover:text-red-700 underline text-sm mt-2" 
                          onClick={handleRemoveImage}
                        >
                          Remove Image
                        </button>
                      </div>
                    ) : null}
                    <input 
                      type="file" 
                      accept="image/*" 
                      ref={fileInputRef} 
                      onChange={handleImageChange} 
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100" 
                      disabled={imageUploading} 
                    />
                    {imageUploading && (
                      <div className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-500"></div>
                        Uploading...
                      </div>
                    )}
                  </div>

                  {/* Content Editor */}
                  <div>
                    <label className="block font-semibold text-gray-700 mb-2">Content</label>
                    
                    {/* Mobile-Friendly Toolbar */}
                    <div className="border border-gray-300 rounded-t-lg bg-gray-50 p-2 overflow-x-auto">
                      <div className="flex flex-wrap gap-1 min-w-max">
                        <button
                          type="button"
                          onClick={() => editor.chain().focus().toggleBold().run()}
                          className={`p-2 rounded text-sm font-bold ${editor.isActive('bold') ? 'bg-blue-200' : 'hover:bg-gray-200'}`}
                          title="Bold"
                        >
                          B
                        </button>
                        <button
                          type="button"
                          onClick={() => editor.chain().focus().toggleItalic().run()}
                          className={`p-2 rounded text-sm italic ${editor.isActive('italic') ? 'bg-blue-200' : 'hover:bg-gray-200'}`}
                          title="Italic"
                        >
                          I
                        </button>
                        <button
                          type="button"
                          onClick={() => editor.chain().focus().toggleUnderline().run()}
                          className={`p-2 rounded text-sm underline ${editor.isActive('underline') ? 'bg-blue-200' : 'hover:bg-gray-200'}`}
                          title="Underline"
                        >
                          U
                        </button>
                        
                        <div className="w-px h-6 bg-gray-300 mx-1"></div>
                        
                        <button
                          type="button"
                          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                          className={`p-2 rounded text-xs font-bold ${editor.isActive('heading', { level: 1 }) ? 'bg-blue-200' : 'hover:bg-gray-200'}`}
                          title="Heading 1"
                        >
                          H1
                        </button>
                        <button
                          type="button"
                          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                          className={`p-2 rounded text-xs font-bold ${editor.isActive('heading', { level: 2 }) ? 'bg-blue-200' : 'hover:bg-gray-200'}`}
                          title="Heading 2"
                        >
                          H2
                        </button>
                        <button
                          type="button"
                          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                          className={`p-2 rounded text-xs font-bold ${editor.isActive('heading', { level: 3 }) ? 'bg-blue-200' : 'hover:bg-gray-200'}`}
                          title="Heading 3"
                        >
                          H3
                        </button>
                        
                        <div className="w-px h-6 bg-gray-300 mx-1"></div>
                        
                        <button
                          type="button"
                          onClick={() => editor.chain().focus().toggleBulletList().run()}
                          className={`p-2 rounded text-sm ${editor.isActive('bulletList') ? 'bg-blue-200' : 'hover:bg-gray-200'}`}
                          title="Bullet List"
                        >
                          •
                        </button>
                        <button
                          type="button"
                          onClick={() => editor.chain().focus().toggleOrderedList().run()}
                          className={`p-2 rounded text-sm ${editor.isActive('orderedList') ? 'bg-blue-200' : 'hover:bg-gray-200'}`}
                          title="Numbered List"
                        >
                          1.
                        </button>
                        <button
                          type="button"
                          onClick={() => editor.chain().focus().toggleBlockquote().run()}
                          className={`p-2 rounded text-sm ${editor.isActive('blockquote') ? 'bg-blue-200' : 'hover:bg-gray-200'}`}
                          title="Quote"
                        >
                          "
                        </button>
                        
                        <div className="w-px h-6 bg-gray-300 mx-1"></div>
                        
                        <button
                          type="button"
                          onClick={() => setShowImageUpload(true)}
                          className="p-2 rounded hover:bg-gray-200"
                          title="Insert Image"
                        >
                          🖼️
                        </button>
                        <button
                          type="button"
                          onClick={setLink}
                          className={`p-2 rounded ${editor.isActive('link') ? 'bg-blue-200' : 'hover:bg-gray-200'}`}
                          title="Add Link"
                        >
                          🔗
                        </button>
                      </div>
                    </div>
                    
                    {/* Editor */}
                    <div className="border border-gray-300 rounded-b-lg p-4 min-h-64">
                      <EditorContent editor={editor} className="prose-editor" />
                      <style dangerouslySetInnerHTML={{
                        __html: `
                          .ProseMirror h1 {
                            font-size: 2em !important;
                            font-weight: bold !important;
                            margin: 0.67em 0 !important;
                            line-height: 1.2 !important;
                            color: #1a202c !important;
                          }
                          .ProseMirror h2 {
                            font-size: 1.5em !important;
                            font-weight: bold !important;
                            margin: 0.83em 0 !important;
                            line-height: 1.3 !important;
                            color: #2d3748 !important;
                          }
                          .ProseMirror h3 {
                            font-size: 1.17em !important;
                            font-weight: bold !important;
                            margin: 1em 0 !important;
                            line-height: 1.4 !important;
                            color: #4a5568 !important;
                          }
                          .ProseMirror p {
                            margin: 1em 0 !important;
                            line-height: 1.6 !important;
                          }
                          .ProseMirror ul {
                            list-style-type: disc !important;
                            margin: 1em 0 !important;
                            padding-left: 2em !important;
                          }
                          .ProseMirror ol {
                            list-style-type: decimal !important;
                            margin: 1em 0 !important;
                            padding-left: 2em !important;
                          }
                          .ProseMirror li {
                            margin: 0.5em 0 !important;
                            line-height: 1.6 !important;
                          }
                          .ProseMirror blockquote {
                            border-left: 4px solid #e2e8f0 !important;
                            margin: 1em 0 !important;
                            padding-left: 1em !important;
                            color: #4a5568 !important;
                            font-style: italic !important;
                          }
                          .ProseMirror {
                            outline: none !important;
                            min-height: 200px !important;
                          }
                          .ProseMirror:focus {
                            outline: none !important;
                          }
                        `
                      }} />
                    </div>
                  </div>
                  
                  {/* Form Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          {modalType === 'add' ? 'Create Blog' : 'Update Blog'}
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-all duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Image Upload Modal */}
      {showImageUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-bold mb-4">Insert Image</h3>
              <input
                type="file"
                accept="image/*"
                ref={imageUploadRef}
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100 mb-4"
                disabled={imageUploading}
              />
              {imageUploading && (
                <div className="text-sm text-gray-500 mb-4 flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-500"></div>
                  Uploading...
                </div>
              )}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowImageUpload(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminBlogs;