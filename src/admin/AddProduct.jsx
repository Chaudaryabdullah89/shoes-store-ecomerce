import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
  'Running Shoes',
  'Basketball Shoes',
  'Soccer Cleats',
  'Tennis Shoes',
  'Golf Shoes',
  'Hiking Boots',
  'Casual Sneakers',
  'Formal Shoes',
  'Sandals',
  'Boots',
  'Athletic Shoes',
  'Slides & Flip Flops',
  'Other'
];

const AddProduct = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    compareAtPrice: '',
    category: '',
    brand: '',
    tags: '',
    stock: '',
    colors: [{ name: '', hex: '', inStock: true }],
    sizes: [{ name: '', inStock: true }],
    variants: [],
    features: '',
    specifications: '',
    weight: '',
    dimensions: '',
    isFeatured: false,
    isNew: false,
    isOnSale: false,
    salePercentage: '',
  });
  const [uploadedImages, setUploadedImages] = useState([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [categories, setCategories] = useState(CATEGORY_OPTIONS);
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
    content: form.description,
    onUpdate: ({ editor }) => {
      setForm(prev => ({ ...prev, description: editor.getHTML() }));
    },
  });

  // Update editor content when form changes
  useEffect(() => {
    if (editor && form.description !== editor.getHTML()) {
      editor.commands.setContent(form.description);
    }
  }, [form.description, editor]);

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
    setForm(prev => ({
      ...prev,
      tags: e.target.value
    }));
  };

  // Handle custom category
  const handleCustomCategoryChange = e => {
    setCustomCategory(e.target.value);
  };

  const addCustomCategory = () => {
    if (customCategory.trim() && !categories.includes(customCategory.trim())) {
      setCategories(prev => [...prev, customCategory.trim()]);
      setForm(prev => ({ ...prev, category: customCategory.trim() }));
      setCustomCategory('');
      setShowCustomCategory(false);
    }
  };

  const toggleCustomCategory = () => {
    setShowCustomCategory(!showCustomCategory);
    if (!showCustomCategory) {
      setCustomCategory('');
    }
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
    setForm(prev => ({
      ...prev,
      colors: [...prev.colors, { name: '', hex: '', inStock: true }]
    }));
  };
  const removeColor = idx => {
    setForm(prev => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== idx)
    }));
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
    setForm(prev => ({
      ...prev,
      sizes: [...prev.sizes, { name: '', inStock: true }]
    }));
  };
  const removeSize = idx => {
    setForm(prev => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== idx)
    }));
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
        ...prev.variants,
        { color: '', size: '', sku: '', price: '', compareAtPrice: '', stock: '', images: [] }
      ]
    }));
  };
  const removeVariant = idx => {
    setForm(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== idx)
    }));
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
        headers: { 'Content-Type': 'multipart/form-data' } 
      });
      
      editor.chain().focus().setImage({ src: res.data.url }).run();
    } catch {
      setError('Image upload failed');
    } finally {
      setUploading(false);
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

  // Submit handler
  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    // Validation
    if (!form.name || !form.description || !form.price || !form.category || !form.brand || !form.stock) {
      setError('Please fill in all required fields.');
      setSubmitting(false);
      return;
    }
    if (uploadedImages.length === 0) {
      setError('Please upload at least one image.');
      setSubmitting(false);
      return;
    }
    // Filter out incomplete colors and sizes
    const filteredColors = form.colors.filter(c => c.name && c.hex);
    const filteredSizes = form.sizes.filter(s => s.name);
    // Use specifications as string (as in your schema)
    const specifications = form.specifications;
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        compareAtPrice: form.compareAtPrice ? parseFloat(form.compareAtPrice) : undefined,
        stock: parseInt(form.stock) || 0,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        images: uploadedImages,
        colors: filteredColors,
        sizes: filteredSizes,
        variants: form.variants,
        features: form.features,
        specifications,
        weight: form.weight,
        dimensions: form.dimensions,
        isFeatured: form.isFeatured,
        isNew: form.isNew,
        isOnSale: form.isOnSale,
        salePercentage: form.salePercentage ? parseFloat(form.salePercentage) : undefined,
      };
      await productService.addProduct(payload);
      navigate('/admin/products');
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        (err?.response?.data?.errors && err.response.data.errors[0]?.msg) ||
        'Failed to add product'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto bg-white shadow rounded p-8 mt-8">
        <h1 className="text-2xl font-bold mb-6">Add Product</h1>
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</div>
        )}
        {!editor ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
          </div>
        ) : (
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="mb-4">
            <label className="block font-semibold mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
              required
              maxLength={100}
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Description</label>
            
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
                    disabled={uploading}
                  />
                  {uploading && <div className="text-sm text-gray-500">Uploading...</div>}
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
          <div className="mb-4 flex gap-4">
            <div className="flex-1">
              <label className="block font-semibold mb-1">Price</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block font-semibold mb-1">Compare At Price</label>
              <input
                type="number"
                name="compareAtPrice"
                value={form.compareAtPrice}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full"
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <div className="mb-4 flex gap-4">
            <div className="flex-1">
              <label className="block font-semibold mb-1">Category</label>
              <div className="space-y-2">
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="border rounded px-3 py-2 w-full"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleCustomCategory}
                    className="text-blue-600 text-sm hover:text-blue-800 underline"
                  >
                    {showCustomCategory ? 'Cancel' : '+ Add Custom Category'}
                  </button>
                </div>
                {showCustomCategory && (
                  <div className="flex gap-2 items-end">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={customCategory}
                        onChange={handleCustomCategoryChange}
                        placeholder="Enter custom category name"
                        className="border rounded px-3 py-2 w-full text-sm"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addCustomCategory();
                          }
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={addCustomCategory}
                      disabled={!customCategory.trim()}
                      className="bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1">
              <label className="block font-semibold mb-1">Brand</label>
              <input
                type="text"
                name="brand"
                value={form.brand}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Tags (comma separated)</label>
            <input
              type="text"
              name="tags"
              value={form.tags}
              onChange={handleTagsChange}
              className="border rounded px-3 py-2 w-full"
              placeholder="e.g. luxury, men, gold"
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Stock</label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
              min="0"
              required
            />
          </div>
          {/* Colors */}
          <div className="mb-4">
            <label className="block font-semibold mb-1">Colors</label>
            {form.colors.map((color, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Name"
                  value={color.name}
                  onChange={e => handleColorChange(idx, 'name', e.target.value)}
                  className="border rounded px-2 py-1 w-32"
                />
                <input
                  type="color"
                  value={color.hex}
                  onChange={e => handleColorChange(idx, 'hex', e.target.value)}
                  className="w-10 h-10 border rounded"
                />
                <label className="flex items-center gap-1 text-sm">
                  <input
                    type="checkbox"
                    checked={color.inStock}
                    onChange={e => handleColorChange(idx, 'inStock', e.target.checked)}
                  />
                  In Stock
                </label>
                {form.colors.length > 1 && (
                  <button
                    type="button"
                    className="text-red-500 ml-2"
                    onClick={() => removeColor(idx)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="text-blue-600 text-sm mt-1"
              onClick={addColor}
            >
              + Add Color
            </button>
          </div>
          {/* Sizes */}
          <div className="mb-4">
            <label className="block font-semibold mb-1">Sizes</label>
            {form.sizes.map((size, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Size"
                  value={size.name}
                  onChange={e => handleSizeChange(idx, 'name', e.target.value)}
                  className="border rounded px-2 py-1 w-32"
                />
                <label className="flex items-center gap-1 text-sm">
                  <input
                    type="checkbox"
                    checked={size.inStock}
                    onChange={e => handleSizeChange(idx, 'inStock', e.target.checked)}
                  />
                  In Stock
                </label>
                {form.sizes.length > 1 && (
                  <button
                    type="button"
                    className="text-red-500 ml-2"
                    onClick={() => removeSize(idx)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="text-blue-600 text-sm mt-1"
              onClick={addSize}
            >
              + Add Size
            </button>
          </div>
          {/* Variants */}
          <div className="mb-4">
            <label className="block font-semibold mb-1">Variants</label>
            {form.variants.map((variant, idx) => (
              <div key={idx} className="flex flex-wrap gap-2 mb-2 items-center">
                <input
                  type="text"
                  placeholder="Color"
                  value={variant.color}
                  onChange={e => handleVariantChange(idx, 'color', e.target.value)}
                  className="border rounded px-2 py-1 w-24"
                />
                <input
                  type="text"
                  placeholder="Size"
                  value={variant.size}
                  onChange={e => handleVariantChange(idx, 'size', e.target.value)}
                  className="border rounded px-2 py-1 w-20"
                />
                <input
                  type="text"
                  placeholder="SKU"
                  value={variant.sku}
                  onChange={e => handleVariantChange(idx, 'sku', e.target.value)}
                  className="border rounded px-2 py-1 w-24"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={variant.price}
                  onChange={e => handleVariantChange(idx, 'price', e.target.value)}
                  className="border rounded px-2 py-1 w-20"
                  min="0"
                  step="0.01"
                />
                <input
                  type="number"
                  placeholder="Compare At"
                  value={variant.compareAtPrice}
                  onChange={e => handleVariantChange(idx, 'compareAtPrice', e.target.value)}
                  className="border rounded px-2 py-1 w-20"
                  min="0"
                  step="0.01"
                />
                <input
                  type="number"
                  placeholder="Stock"
                  value={variant.stock}
                  onChange={e => handleVariantChange(idx, 'stock', e.target.value)}
                  className="border rounded px-2 py-1 w-16"
                  min="0"
                />
                {form.variants.length > 0 && (
                  <button
                    type="button"
                    className="text-red-500 ml-2"
                    onClick={() => removeVariant(idx)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="text-blue-600 text-sm mt-1"
              onClick={addVariant}
            >
              + Add Variant
            </button>
          </div>
          {/* Features */}
          <div className="mb-4">
            <label className="block font-semibold mb-1">Features</label>
            <textarea
              name="features"
              value={form.features}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
              rows={2}
              placeholder="Optional"
            />
          </div>
          {/* Specifications */}
          <div className="mb-4">
            <label className="block font-semibold mb-1">Specifications</label>
            <textarea
              name="specifications"
              value={form.specifications}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
              rows={2}
              placeholder="Optional"
            />
          </div>
          {/* Weight & Dimensions */}
          <div className="mb-4 flex gap-4">
            <div className="flex-1">
              <label className="block font-semibold mb-1">Weight</label>
              <input
                type="text"
                name="weight"
                value={form.weight}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full"
                placeholder="e.g. 1.2kg"
              />
            </div>
            <div className="flex-1">
              <label className="block font-semibold mb-1">Dimensions</label>
              <input
                type="text"
                name="dimensions"
                value={form.dimensions}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full"
                placeholder="e.g. 10x20x5cm"
              />
            </div>
          </div>
          {/* Flags */}
          <div className="mb-4 flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isFeatured"
                checked={form.isFeatured}
                onChange={handleChange}
              />
              Featured
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isNew"
                checked={form.isNew}
                onChange={handleChange}
              />
              New
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isOnSale"
                checked={form.isOnSale}
                onChange={handleChange}
              />
              On Sale
            </label>
            {form.isOnSale && (
              <input
                type="number"
                name="salePercentage"
                value={form.salePercentage}
                onChange={handleChange}
                className="border rounded px-2 py-1 w-20"
                min="0"
                max="100"
                placeholder="%"
              />
            )}
          </div>
          {/* Images */}
          <div className="mb-6">
            <label className="block font-semibold mb-1">Images</label>
            <input
              type="file"
              name="images"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="block"
              disabled={uploading}
            />
            {uploading && <div className="text-xs text-yellow-600 mt-1">Uploading...</div>}
            {uploadedImages.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {uploadedImages.map((img, idx) => (
                  <div key={idx} className="w-20 h-20 border rounded overflow-hidden flex items-center justify-center relative">
                    <img
                      src={img.url}
                      alt="preview"
                      className="object-cover w-full h-full"
                    />
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                      onClick={() => handleImageRemove(idx)}
                    >×</button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-yellow-500 text-white px-6 py-2 rounded font-semibold hover:bg-yellow-600 transition"
              disabled={submitting || uploading}
            >
              {submitting ? 'Adding...' : 'Add Product'}
            </button>
            <button
              type="button"
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded font-semibold hover:bg-gray-300 transition"
              onClick={() => navigate('/admin/products')}
              disabled={submitting}
            >
              Cancel
            </button>
          </div>
        </form>
        )}
      </div>
    </AdminLayout>
  );
};

export default AddProduct;
