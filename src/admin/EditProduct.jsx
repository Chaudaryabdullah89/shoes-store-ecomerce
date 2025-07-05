import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import { productService } from '../services/productService';
import api from '../services/api';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';

const CATEGORY_OPTIONS = [
  'Watches', 'Jewelry', 'Accessories', 'Clothing', 'Shoes', 'Bags', 'Electronics', 'Home & Garden', 'Sports', 'Books', 'Other'
];

const Label = ({ children, required }) => (
  <label className="block font-semibold mb-1 text-gray-700">
    {children}
    {required && <span className="text-red-500 ml-1">*</span>}
  </label>
);

const SectionTitle = ({ children }) => (
  <h2 className="text-lg font-bold text-gray-800 mb-2 mt-8 border-b pb-1">{children}</h2>
);

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
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
        placeholder: 'Start writing your product description...',
      }),
      TextStyle,
      Color,
    ],
    content: form?.description || '',
    onUpdate: ({ editor }) => {
      if (form) {
        setForm(prev => ({ ...prev, description: editor.getHTML() }));
      }
    },
  });

  // Update editor content when form changes
  useEffect(() => {
    if (editor && form?.description && form.description !== editor.getHTML()) {
      editor.commands.setContent(form.description);
    }
  }, [form?.description, editor]);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await productService.getProduct(id);
        setForm({
          ...data.product,
          tags: Array.isArray(data.product.tags) ? data.product.tags.join(', ') : data.product.tags || '',
          features: data.product.features || '',
          specifications: data.product.specifications || '',
        });
        setUploadedImages(data.product.images || []);
      } catch (err) {
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Handle input changes
  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle tags as comma separated
  const handleTagsChange = e => {
    setForm(prev => ({ ...prev, tags: e.target.value }));
  };

  // Handle colors
  const handleColorChange = (idx, field, value) => {
    setForm(prev => {
      const colors = [...prev.colors];
      colors[idx][field] = value;
      return { ...prev, colors };
    });
  };
  const addColor = () => {
    setForm(prev => ({ ...prev, colors: [...(prev.colors || []), { name: '', hex: '#000000', inStock: true }] }));
  };
  const removeColor = idx => {
    setForm(prev => ({ ...prev, colors: prev.colors.filter((_, i) => i !== idx) }));
  };

  // Handle sizes
  const handleSizeChange = (idx, field, value) => {
    setForm(prev => {
      const sizes = [...prev.sizes];
      sizes[idx][field] = value;
      return { ...prev, sizes };
    });
  };
  const addSize = () => {
    setForm(prev => ({ ...prev, sizes: [...(prev.sizes || []), { name: '', inStock: true }] }));
  };
  const removeSize = idx => {
    setForm(prev => ({ ...prev, sizes: prev.sizes.filter((_, i) => i !== idx) }));
  };

  // Handle variants
  const handleVariantChange = (idx, field, value) => {
    setForm(prev => {
      const variants = [...prev.variants];
      variants[idx][field] = value;
      return { ...prev, variants };
    });
  };
  const addVariant = () => {
    setForm(prev => ({
      ...prev,
      variants: [
        ...(prev.variants || []),
        { color: '', size: '', sku: '', price: '', compareAtPrice: '', stock: '', images: [] }
      ]
    }));
  };
  const removeVariant = idx => {
    setForm(prev => ({ ...prev, variants: prev.variants.filter((_, i) => i !== idx) }));
  };

  // Handle images: upload to backend/Cloudinary on select
  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    setError('');
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('image', file);
        const res = await api.post('/admin/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setUploadedImages(prev => [...prev, { url: res.data.url, public_id: res.data.public_id }]);
      }
    } catch {
      setError('Image upload failed.');
    } finally {
      setUploading(false);
    }
  };
  const handleImageRemove = idx => {
    setUploadedImages(prev => prev.filter((_, i) => i !== idx));
  };

  // Handle image upload for editor
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const res = await api.post('/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      editor.chain().focus().setImage({ src: res.data.url }).run();
    } catch {
      setError('Image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const setLink = () => {
    const url = window.prompt('URL');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const productData = {
        ...form,
        tags: form.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        images: uploadedImages.map(img => img.url),
        imagePublicIds: uploadedImages.map(img => img.public_id),
      };
      await productService.updateProduct(id, productData);
      navigate('/admin/products');
    } catch (err) {
      setError('Failed to update product');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/admin/products')}
          className="text-gray-600 hover:text-gray-800 transition"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Edit Product</h1>
      </div>
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 border border-red-200 flex items-center gap-2">
          <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 9v2m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}
      <form onSubmit={handleSubmit} autoComplete="off">
        {!editor ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
          </div>
        ) : (
          <>
            <SectionTitle>Basic Info</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <Label required>Name</Label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                  required
                  maxLength={100}
                  placeholder="Product name"
                />
              </div>
              {/* Brand */}
              <div>
                <Label required>Brand</Label>
                <input
                  type="text"
                  name="brand"
                  value={form.brand}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                  required
                  placeholder="Brand"
                />
              </div>
              {/* Category */}
              <div>
                <Label required>Category</Label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                  required
                >
                  <option value="">Select category</option>
                  {CATEGORY_OPTIONS.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              {/* Tags */}
              <div>
                <Label>Tags <span className="text-xs text-gray-400">(comma separated)</span></Label>
                <input
                  type="text"
                  name="tags"
                  value={form.tags}
                  onChange={handleTagsChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                  placeholder="e.g. luxury, men, gold"
                />
              </div>
              {/* Price */}
              <div>
                <Label required>Price</Label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                  min="0"
                  step="0.01"
                  required
                  placeholder="0.00"
                />
              </div>
              {/* Compare At Price */}
              <div>
                <Label>Compare At Price</Label>
                <input
                  type="number"
                  name="compareAtPrice"
                  value={form.compareAtPrice}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>
              {/* Stock */}
              <div>
                <Label required>Stock</Label>
                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                  min="0"
                  required
                  placeholder="Stock quantity"
                />
              </div>
            </div>
            {/* Description */}
            <div className="mt-6">
              <Label required>Description</Label>
              
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
                  onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                  className={`p-2 rounded text-sm font-bold ${editor.isActive('heading', { level: 1 }) ? 'bg-blue-200' : 'hover:bg-gray-200'}`}
                  title="Heading 1"
                >
                  H1
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                  className={`p-2 rounded text-sm font-bold ${editor.isActive('heading', { level: 2 }) ? 'bg-blue-200' : 'hover:bg-gray-200'}`}
                  title="Heading 2"
                >
                  H2
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                  className={`p-2 rounded text-sm font-bold ${editor.isActive('heading', { level: 3 }) ? 'bg-blue-200' : 'hover:bg-gray-200'}`}
                  title="Heading 3"
                >
                  H3
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().setParagraph().run()}
                  className={`p-2 rounded text-sm ${editor.isActive('paragraph') ? 'bg-blue-200' : 'hover:bg-gray-200'}`}
                  title="Paragraph"
                >
                  P
                </button>
                <div className="w-px h-6 bg-gray-300 mx-1"></div>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                  className={`p-2 rounded ${editor.isActive('bulletList') ? 'bg-blue-200' : 'hover:bg-gray-200'}`}
                  title="Bullet List"
                >
                  • List
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
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
                  ⬅
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
                  ➡
                </button>
                <div className="w-px h-6 bg-gray-300 mx-1"></div>
                <button
                  type="button"
                  onClick={() => setLink()}
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
                <input
                  type="color"
                  onChange={(e) => {
                    editor.chain().focus().setColor(e.target.value).run();
                  }}
                  className="w-8 h-8 border rounded cursor-pointer"
                  title="Text Color"
                />
                <button
                  type="button"
                  onClick={() => editor.chain().focus().unsetColor().run()}
                  className="p-2 rounded hover:bg-gray-200"
                  title="Remove Color"
                >
                  🎨
                </button>
                <div className="w-px h-6 bg-gray-300 mx-1"></div>
                <button
                  type="button"
                  onClick={() => imageUploadRef.current?.click()}
                  className="p-2 rounded hover:bg-gray-200"
                  title="Add Image"
                >
                  📷
                </button>
                <input
                  ref={imageUploadRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              
              {/* TipTap Editor */}
              <div className="border border-gray-300 rounded-b">
                <EditorContent 
                  editor={editor} 
                  className="prose max-w-none p-4 min-h-[200px] focus:outline-none"
                  style={{
                    '--tw-prose-body': '#374151',
                    '--tw-prose-headings': '#111827',
                    '--tw-prose-links': '#2563eb',
                    '--tw-prose-bold': '#111827',
                    '--tw-prose-counters': '#6b7280',
                    '--tw-prose-bullets': '#d1d5db',
                    '--tw-prose-hr': '#e5e7eb',
                    '--tw-prose-quotes': '#111827',
                    '--tw-prose-quote-borders': '#e5e7eb',
                    '--tw-prose-captions': '#6b7280',
                    '--tw-prose-code': '#111827',
                    '--tw-prose-code-bg': '#f3f4f6',
                    '--tw-prose-pre-code': '#e5e7eb',
                    '--tw-prose-pre-bg': '#1f2937',
                    '--tw-prose-pre-border': '#374151',
                    '--tw-prose-th-borders': '#d1d5db',
                    '--tw-prose-td-borders': '#e5e7eb',
                  }}
                />
              </div>
            </div>

            {/* Images Section */}
            <SectionTitle>Product Images</SectionTitle>
            <div className="mb-6">
              <Label>Product Images</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center">
                    <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-gray-600 mb-2">Click to upload images</p>
                    <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB each</p>
                  </div>
                </label>
              </div>
              {uploading && (
                <div className="mt-4 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto"></div>
                  <p className="text-sm text-gray-600 mt-2">Uploading...</p>
                </div>
              )}
              {uploadedImages.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {uploadedImages.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={img.url}
                        alt={`Product ${idx + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleImageRemove(idx)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Colors Section */}
            <SectionTitle>Colors</SectionTitle>
            <div className="mb-6">
              <div className="space-y-4">
                {form.colors?.map((color, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div>
                      <Label>Color Name</Label>
                      <input
                        type="text"
                        value={color.name}
                        onChange={(e) => handleColorChange(idx, 'name', e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                        placeholder="e.g. Red, Blue"
                      />
                    </div>
                    <div>
                      <Label>Color</Label>
                      <input
                        type="color"
                        value={color.hex}
                        onChange={(e) => handleColorChange(idx, 'hex', e.target.value)}
                        className="w-12 h-12 border rounded cursor-pointer"
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={color.inStock}
                        onChange={(e) => handleColorChange(idx, 'inStock', e.target.checked)}
                        className="mr-2"
                      />
                      <Label>In Stock</Label>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeColor(idx)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addColor}
                  className="text-yellow-600 hover:text-yellow-700 font-medium"
                >
                  + Add Color
                </button>
              </div>
            </div>

            {/* Sizes Section */}
            <SectionTitle>Sizes</SectionTitle>
            <div className="mb-6">
              <div className="space-y-4">
                {form.sizes?.map((size, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div>
                      <Label>Size Name</Label>
                      <input
                        type="text"
                        value={size.name}
                        onChange={(e) => handleSizeChange(idx, 'name', e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                        placeholder="e.g. S, M, L, XL"
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={size.inStock}
                        onChange={(e) => handleSizeChange(idx, 'inStock', e.target.checked)}
                        className="mr-2"
                      />
                      <Label>In Stock</Label>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSize(idx)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addSize}
                  className="text-yellow-600 hover:text-yellow-700 font-medium"
                >
                  + Add Size
                </button>
              </div>
            </div>

            {/* Variants Section */}
            <SectionTitle>Variants</SectionTitle>
            <div className="mb-6">
              <div className="space-y-4">
                {form.variants?.map((variant, idx) => (
                  <div key={idx} className="p-4 border rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Color</Label>
                        <input
                          type="text"
                          value={variant.color}
                          onChange={(e) => handleVariantChange(idx, 'color', e.target.value)}
                          className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                          placeholder="Color"
                        />
                      </div>
                      <div>
                        <Label>Size</Label>
                        <input
                          type="text"
                          value={variant.size}
                          onChange={(e) => handleVariantChange(idx, 'size', e.target.value)}
                          className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                          placeholder="Size"
                        />
                      </div>
                      <div>
                        <Label>SKU</Label>
                        <input
                          type="text"
                          value={variant.sku}
                          onChange={(e) => handleVariantChange(idx, 'sku', e.target.value)}
                          className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                          placeholder="SKU"
                        />
                      </div>
                      <div>
                        <Label>Price</Label>
                        <input
                          type="number"
                          value={variant.price}
                          onChange={(e) => handleVariantChange(idx, 'price', e.target.value)}
                          className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <Label>Compare At Price</Label>
                        <input
                          type="number"
                          value={variant.compareAtPrice}
                          onChange={(e) => handleVariantChange(idx, 'compareAtPrice', e.target.value)}
                          className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <Label>Stock</Label>
                        <input
                          type="number"
                          value={variant.stock}
                          onChange={(e) => handleVariantChange(idx, 'stock', e.target.value)}
                          className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                          min="0"
                          placeholder="Stock"
                        />
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeVariant(idx)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove Variant
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addVariant}
                  className="text-yellow-600 hover:text-yellow-700 font-medium"
                >
                  + Add Variant
                </button>
              </div>
            </div>

            {/* Additional Info Section */}
            <SectionTitle>Additional Information</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <Label>Features</Label>
                <textarea
                  name="features"
                  value={form.features}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                  rows="4"
                  placeholder="Product features..."
                />
              </div>
              <div>
                <Label>Specifications</Label>
                <textarea
                  name="specifications"
                  value={form.specifications}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                  rows="4"
                  placeholder="Product specifications..."
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4 mt-8">
              <button
                type="button"
                onClick={() => navigate('/admin/products')}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {submitting ? 'Updating...' : 'Update Product'}
              </button>
            </div>
          </>
        )}
      </form>
    </AdminLayout>
  );
};

export default EditProduct;