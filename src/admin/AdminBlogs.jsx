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

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Blogs</h1>
        <button
          className="bg-yellow-500 text-white px-6 py-2 rounded font-bold shadow hover:bg-yellow-600 transition"
          onClick={() => openModal('add')}
        >
          Add Blog
        </button>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-6">{error}</div>
      ) : blogs.length === 0 ? (
        <div className="text-gray-400 py-8 text-center">No blogs found.</div>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500 text-xs uppercase bg-gray-50">
                <th className="font-semibold py-3 px-2">Image</th>
                <th className="font-semibold py-3 px-2">Title</th>
                <th className="font-semibold py-3 px-2">Excerpt</th>
                <th className="font-semibold py-3 px-2">Category</th>
                <th className="font-semibold py-3 px-2">Tags</th>
                <th className="font-semibold py-3 px-2">Status</th>
                <th className="font-semibold py-3 px-2">Author</th>
                <th className="font-semibold py-3 px-2">Likes</th>
                <th className="font-semibold py-3 px-2">Comments</th>
                <th className="font-semibold py-3 px-2">Created</th>
                <th className="font-semibold py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map(blog => (
                <tr key={blog._id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-2">
                    {blog.image?.url ? (
                      <img src={blog.image.url} alt={blog.title} className="w-16 h-12 object-cover rounded" />
                    ) : (
                      <div className="w-16 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-400">No Image</div>
                    )}
                  </td>
                  <td className="py-2 px-2 font-semibold">{blog.title}</td>
                  <td className="py-2 px-2 text-sm text-gray-600 max-w-xs truncate">{blog.excerpt || '-'}</td>
                  <td className="py-2 px-2">{blog.category || '-'}</td>
                  <td className="py-2 px-2">{(blog.tags || []).join(', ')}</td>
                  <td className="py-2 px-2">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${blog.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{blog.status}</span>
                  </td>
                  <td className="py-2 px-2 flex items-center gap-2">
                    {blog.author?.avatar?.url && <img src={blog.author.avatar.url} alt={blog.author.name} className="w-7 h-7 rounded-full object-cover" />}
                    <span>{blog.author?.name || '-'}</span>
                  </td>
                  <td className="py-2 px-2 text-center">{blog.likes?.length || 0}</td>
                  <td className="py-2 px-2 text-center">{blog.comments?.length || 0}</td>
                  <td className="py-2 px-2">{blog.createdAt ? new Date(blog.createdAt).toLocaleString() : '-'}</td>
                  <td className="py-2 px-2">
                    <button className="text-blue-700 underline font-semibold mr-2" onClick={() => openModal('view', blog)}>View</button>
                    <button className="text-yellow-700 underline font-semibold mr-2" onClick={() => openModal('edit', blog)}>Edit</button>
                    <button className="text-red-700 underline font-semibold" onClick={() => handleDelete(blog._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Modal for Add/Edit/View */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-4xl mx-4 w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">
                {modalType === 'add' ? 'Add Blog' : modalType === 'edit' ? 'Edit Blog' : 'Blog Details'}
              </h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            {modalType === 'view' ? (
              <div className="space-y-4">
                {selectedBlog.image?.url && <img src={selectedBlog.image.url} alt={selectedBlog.title} className="w-full h-48 object-cover rounded mb-4" />}
                <div><span className="font-semibold">Title:</span> {selectedBlog.title}</div>
                <div><span className="font-semibold">Excerpt:</span> {selectedBlog.excerpt || '-'}</div>
                <div><span className="font-semibold">Category:</span> {selectedBlog.category || '-'}</div>
                <div><span className="font-semibold">Tags:</span> {(selectedBlog.tags || []).join(', ')}</div>
                <div><span className="font-semibold">Status:</span> {selectedBlog.status}</div>
                <div className="flex items-center gap-2"><span className="font-semibold">Author:</span> {selectedBlog.author?.avatar?.url && <img src={selectedBlog.author.avatar.url} alt={selectedBlog.author.name} className="w-7 h-7 rounded-full object-cover" />} {selectedBlog.author?.name || '-'}</div>
                <div><span className="font-semibold">Likes:</span> {selectedBlog.likes?.length || 0}</div>
                <div><span className="font-semibold">Comments:</span> {selectedBlog.comments?.length || 0}</div>
                <div><span className="font-semibold">Created:</span> {selectedBlog.createdAt ? new Date(selectedBlog.createdAt).toLocaleString() : '-'}</div>
                <div className="mt-4"><span className="font-semibold">Content:</span>
                  <div className="prose max-w-none mt-2" dangerouslySetInnerHTML={{ __html: selectedBlog.content }} />
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
                <div>
                  <label className="block font-semibold mb-1">Title</label>
                  <input type="text" name="title" value={form.title} onChange={handleChange} className="border border-gray-300 rounded px-4 py-2 w-full" required maxLength={200} />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Excerpt</label>
                  <input type="text" name="excerpt" value={form.excerpt} onChange={handleChange} className="border border-gray-300 rounded px-4 py-2 w-full" maxLength={300} placeholder="Short summary for preview..." />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Category</label>
                  <input type="text" name="category" value={form.category} onChange={handleChange} className="border border-gray-300 rounded px-4 py-2 w-full" maxLength={100} />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Tags (comma separated)</label>
                  <input type="text" name="tags" value={form.tags} onChange={handleChange} className="border border-gray-300 rounded px-4 py-2 w-full" maxLength={200} />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Status</label>
                  <select name="status" value={form.status} onChange={handleChange} className="border border-gray-300 rounded px-4 py-2 w-full">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Featured Image</label>
                  {form.image?.url ? (
                    <div className="mb-2 flex items-center gap-4">
                      <img src={form.image.url} alt="Blog" className="w-24 h-16 object-cover rounded" />
                      <button type="button" className="text-red-600 underline" onClick={handleRemoveImage}>Remove</button>
                    </div>
                  ) : null}
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="block" disabled={imageUploading} />
                  {imageUploading && <div className="text-xs text-gray-500 mt-1">Uploading...</div>}
                </div>
                <div>
                  <label className="block font-semibold mb-1">Content</label>
                  
                  {/* TipTap Editor Toolbar */}
                  <div className="border border-gray-300 rounded-t bg-gray-50 p-2 flex flex-wrap gap-1">
                    <button
                      type="button"
                      onClick={() => editor.chain().focus().toggleBold().run()}
                      className={`p-2 rounded ${editor.isActive('bold') ? 'bg-blue-200' : 'hover:bg-gray-200'}`}
                      title="Bold"
                    >
                      <strong>B</strong>
                    </button>
                    <button
                      type="button"
                      onClick={() => editor.chain().focus().toggleItalic().run()}
                      className={`p-2 rounded ${editor.isActive('italic') ? 'bg-blue-200' : 'hover:bg-gray-200'}`}
                      title="Italic"
                    >
                      <em>I</em>
                    </button>
                    <button
                      type="button"
                      onClick={() => editor.chain().focus().toggleUnderline().run()}
                      className={`p-2 rounded ${editor.isActive('underline') ? 'bg-blue-200' : 'hover:bg-gray-200'}`}
                      title="Underline"
                    >
                      <u>U</u>
                    </button>
                    <div className="w-px h-6 bg-gray-300 mx-1"></div>
                    <button
                      type="button"
                      onClick={() => {
                        editor.chain().focus().toggleHeading({ level: 1 }).run();
                      }}
                      className={`p-2 rounded text-sm font-bold ${editor.isActive('heading', { level: 1 }) ? 'bg-blue-200' : 'hover:bg-gray-200'}`}
                      title="Heading 1"
                    >
                      H1
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        editor.chain().focus().toggleHeading({ level: 2 }).run();
                      }}
                      className={`p-2 rounded text-sm font-bold ${editor.isActive('heading', { level: 2 }) ? 'bg-blue-200' : 'hover:bg-gray-200'}`}
                      title="Heading 2"
                    >
                      H2
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        editor.chain().focus().toggleHeading({ level: 3 }).run();
                      }}
                      className={`p-2 rounded text-sm font-bold ${editor.isActive('heading', { level: 3 }) ? 'bg-blue-200' : 'hover:bg-gray-200'}`}
                      title="Heading 3"
                    >
                      H3
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        editor.chain().focus().setParagraph().run();
                      }}
                      className={`p-2 rounded text-sm ${editor.isActive('paragraph') ? 'bg-blue-200' : 'hover:bg-gray-200'}`}
                      title="Paragraph"
                    >
                      P
                    </button>
                    <div className="w-px h-6 bg-gray-300 mx-1"></div>
                    <button
                      type="button"
                      onClick={() => {
                        editor.chain().focus().toggleBulletList().run();
                      }}
                      className={`p-2 rounded ${editor.isActive('bulletList') ? 'bg-blue-200' : 'hover:bg-gray-200'}`}
                      title="Bullet List"
                    >
                      • List
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        editor.chain().focus().toggleOrderedList().run();
                      }}
                      className={`p-2 rounded ${editor.isActive('orderedList') ? 'bg-blue-200' : 'hover:bg-gray-200'}`}
                      title="Numbered List"
                    >
                      1. List
                    </button>
                    <button
                      type="button"
                      onClick={() => editor.chain().focus().toggleBlockquote().run()}
                      className={`p-2 rounded ${editor.isActive('blockquote') ? 'bg-blue-200' : 'hover:bg-gray-200'}`}
                      title="Quote"
                    >
                      "
                    </button>
                    <div className="w-px h-6 bg-gray-300 mx-1"></div>
                    <button
                      type="button"
                      onClick={() => editor.chain().focus().setTextAlign('left').run()}
                      className={`p-2 rounded ${editor.isActive({ textAlign: 'left' }) ? 'bg-blue-200' : 'hover:bg-gray-200'}`}
                      title="Align Left"
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      onClick={() => editor.chain().focus().setTextAlign('center').run()}
                      className={`p-2 rounded ${editor.isActive({ textAlign: 'center' }) ? 'bg-blue-200' : 'hover:bg-gray-200'}`}
                      title="Align Center"
                    >
                      ↔
                    </button>
                    <button
                      type="button"
                      onClick={() => editor.chain().focus().setTextAlign('right').run()}
                      className={`p-2 rounded ${editor.isActive({ textAlign: 'right' }) ? 'bg-blue-200' : 'hover:bg-gray-200'}`}
                      title="Align Right"
                    >
                      →
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
                    <button
                      type="button"
                      onClick={() => editor.chain().focus().unsetLink().run()}
                      className="p-2 rounded hover:bg-gray-200"
                      title="Remove Link"
                    >
                      🚫
                    </button>
                    <div className="w-px h-6 bg-gray-300 mx-1"></div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-600">Color:</span>
                      <input
                        type="color"
                        onChange={(e) => {
                          const color = e.target.value;
                          // Focus the editor first
                          editor.commands.focus();
                          // Use TipTap's setColor command
                          editor.chain().focus().setColor(color).run();
                        }}
                        className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                        title="Text Color"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          // Focus the editor first
                          editor.commands.focus();
                          // Use TipTap's unsetColor command
                          editor.chain().focus().unsetColor().run();
                        }}
                        className="p-1 text-xs text-gray-600 hover:text-gray-800"
                        title="Remove Color"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                  
                  {/* Image Upload Modal */}
                  {showImageUpload && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-bold mb-4">Insert Image</h3>
                        <input
                          type="file"
                          accept="image/*"
                          ref={imageUploadRef}
                          onChange={handleImageUpload}
                          className="block w-full mb-4"
                          disabled={imageUploading}
                        />
                        {imageUploading && <div className="text-sm text-gray-500">Uploading...</div>}
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setShowImageUpload(false)}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* TipTap Editor */}
                  <div className="border border-gray-300 rounded-b p-4 min-h-64">
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
                
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-yellow-500 text-white px-6 py-2 rounded font-bold shadow hover:bg-yellow-600 transition disabled:opacity-50"
                  >
                    {submitting ? 'Saving...' : modalType === 'add' ? 'Add Blog' : 'Update Blog'}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded font-bold shadow hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminBlogs;