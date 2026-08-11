"use client";

import { useState, useEffect } from "react";

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  cover_image: string;
  meta_title?: string;
  meta_description?: string;
}

export default function ManageCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Partial<Category>>({});
  
  const [uploading, setUploading] = useState(false);
  const [lastChanged, setLastChanged] = useState<any>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/categories`);
      const data = await res.json();
      setCategories(data);

      fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/audit-logs?target_type=category&limit=1`)
        .then(res => res.json())
        .then(data => {
          if (data.length > 0) setLastChanged(data[0]);
        })
        .catch(console.error);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let updates: any = { [name]: value };

    if (name === "name") {
      const oldSlugified = currentCategory.name ? slugify(currentCategory.name) : "";
      if (!currentCategory.slug || currentCategory.slug === oldSlugified) {
        updates.slug = slugify(value);
      }
    }

    setCurrentCategory({ ...currentCategory, ...updates });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    if (currentCategory.name) {
      formData.append("seo_name", currentCategory.name);
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/settings/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setCurrentCategory(prev => ({ ...prev, cover_image: data.url }));
      } else {
        alert("Upload failed");
      }
    } catch (err) {
      alert("Error uploading file");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!currentCategory.name || !currentCategory.slug) {
        alert("Name and Slug are required.");
        return;
      }
      
      const method = currentCategory.id ? 'PUT' : 'POST';
      const url = currentCategory.id ? `${process.env.NEXT_PUBLIC_ADMIN_API_URL}/categories/${currentCategory.id}` : `${process.env.NEXT_PUBLIC_ADMIN_API_URL}/categories`;
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentCategory)
      });
      
      if (res.ok) {
        alert(`Category ${currentCategory.id ? 'updated' : 'created'} successfully!`);
        setIsEditing(false);
        setCurrentCategory({});
        fetchCategories();
      } else {
        const errorData = await res.json();
        alert(`Error: ${JSON.stringify(errorData)}`);
      }
    } catch (err) {
      alert('Network error while saving category.');
    }
  };

  const editCategory = (cat: Category) => {
    setCurrentCategory(cat);
    setIsEditing(true);
  };

  const deleteCategory = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/categories/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchCategories();
      } else {
        alert("Failed to delete category");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const [draggedItemIdx, setDraggedItemIdx] = useState<number | null>(null);

  if (loading) return <div className="p-8">Loading Categories...</div>;

  const handleDragStart = (idx: number) => setDraggedItemIdx(idx);
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  
  const handleDrop = async (idx: number) => {
    if (draggedItemIdx === null || draggedItemIdx === idx) return;
    
    const newCategories = [...categories];
    const item = newCategories.splice(draggedItemIdx, 1)[0];
    newCategories.splice(idx, 0, item);
    
    setCategories(newCategories);
    setDraggedItemIdx(null);
    
    // Save to backend
    try {
      const orderedIds = newCategories.map(cat => cat.id);
      await fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/categories/reorder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderedIds)
      });
    } catch (err) {
      console.error("Failed to save sequence", err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Categories</h1>
          {lastChanged && (
            <p className="text-sm text-gray-500 mt-1">
              Last updated: {new Date(lastChanged.created_at).toLocaleString()} {lastChanged.admin?.username ? `(by ${lastChanged.admin.username})` : ""}
            </p>
          )}
        </div>
        {!isEditing && (
          <button 
            onClick={() => { setIsEditing(true); setCurrentCategory({ name: "", slug: "", description: "", cover_image: "" }); }}
            className="bg-meewa-red text-white px-4 py-2 rounded font-medium hover:bg-red-700 transition"
          >
            + Add New Category
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8 space-y-4">
          <h2 className="text-xl font-semibold mb-4">{currentCategory.id ? 'Edit Category' : 'Create Category'}</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" title="The exact name of the category as displayed to customers.">Name * <span className="text-gray-400 cursor-help font-normal ml-1">ⓘ</span></label>
              <input type="text" name="name" value={currentCategory.name || ""} onChange={handleInputChange} required className="w-full border p-2 rounded text-gray-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" title="The URL-friendly version of the name. Must be unique and contain no spaces (e.g., 'custom-boxes').">Slug * <span className="text-gray-400 cursor-help font-normal ml-1">ⓘ</span></label>
              <input type="text" name="slug" value={currentCategory.slug || ""} onChange={handleInputChange} required className="w-full border p-2 rounded text-gray-900" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" title="A brief description of this category, displayed on category grids.">Description <span className="text-gray-400 cursor-help font-normal ml-1">ⓘ</span></label>
            <textarea name="description" value={currentCategory.description || ""} onChange={handleInputChange} rows={3} className="w-full border p-2 rounded text-gray-900" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" title="The title shown in the browser tab and search engines.">Meta Title <span className="text-gray-400 cursor-help font-normal ml-1">ⓘ</span></label>
              <input type="text" name="meta_title" value={currentCategory.meta_title || ""} onChange={handleInputChange} className="w-full border p-2 rounded text-gray-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" title="The description shown in search engine results.">Meta Description <span className="text-gray-400 cursor-help font-normal ml-1">ⓘ</span></label>
              <input type="text" name="meta_description" value={currentCategory.meta_description || ""} onChange={handleInputChange} className="w-full border p-2 rounded text-gray-900" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" title="The main thumbnail image used for this category. Ideally square or standard portrait.">Cover Image <span className="text-gray-400 cursor-help font-normal ml-1">ⓘ</span></label>
            <div className="flex items-center gap-4">
              {currentCategory.cover_image && (
                <img src={(currentCategory.cover_image)?.startsWith("http") ? (currentCategory.cover_image) : `${process.env.NEXT_PUBLIC_API_URL}${currentCategory.cover_image}`} className="w-16 h-16 object-cover border rounded" />
              )}
              <input type="file" accept="image/*" onChange={handleFileUpload} disabled={uploading} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-meewa-red hover:file:bg-red-100 cursor-pointer" />
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t">
            <button type="submit" className="bg-meewa-red text-white px-4 py-2 rounded">Save</button>
            <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-200 text-gray-800 px-4 py-2 rounded">Cancel</button>
          </div>
        </form>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((cat, idx) => (
                <tr 
                  key={cat.id}
                  draggable
                  onDragStart={() => handleDragStart(idx)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(idx)}
                  className="cursor-move hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="text-gray-400 cursor-grab" title="Drag to reorder">⠿</div>
                      {cat.cover_image ? (
                        <img src={(cat.cover_image)?.startsWith("http") ? (cat.cover_image) : `${process.env.NEXT_PUBLIC_API_URL}${cat.cover_image}`} className="w-10 h-10 object-cover rounded" />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded"></div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{cat.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{cat.slug}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => editCategory(cat)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                    <button onClick={() => deleteCategory(cat.id)} className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">No categories found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
