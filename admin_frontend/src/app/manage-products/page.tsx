"use client";

import { useState, useEffect } from "react";

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  category_id: number;
  short_description: string;
  hero_description?: string;
  moq: string;
  price_from: string;
  status: string;
  cover_image?: string;
  hero_animated_image?: string;
  section1_image?: string;
  section2_image?: string;
  banner_images?: string[];
  banner_title?: string;
  banner_subtitle?: string;
  marquee_text?: string;
  description_title?: string;
  description_points?: string[];
  description_list_style?: string;
  specs?: {
    available_colors?: string[];
    available_sizes?: string[];
  };
}

export default function ManageProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastChanged, setLastChanged] = useState<any>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({ status: "active" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [prodRes, catRes, auditRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/products`),
        fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/categories`),
        fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/audit-logs?target_type=product&limit=1`)
      ]);
      const prodData = await prodRes.json();
      const catData = await catRes.json();
      const auditData = await auditRes.json();
      setProducts(prodData);
      setCategories(catData);
      if (auditData.length > 0) setLastChanged(auditData[0]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let updates: any = { [name]: value };

    if (name === "name") {
      const oldSlugified = currentProduct.name ? slugify(currentProduct.name) : "";
      if (!currentProduct.slug || currentProduct.slug === oldSlugified) {
        updates.slug = slugify(value);
      }
    }

    setCurrentProduct({ ...currentProduct, ...updates });
  };

  const [uploading, setUploading] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const inputElement = e.target;
    
    const performUpload = async () => {
      setUploading(fieldName);
      const formData = new FormData();
      formData.append("file", file);
      if (currentProduct.name) {
        formData.append("seo_name", currentProduct.name);
      }

      try {
        const uploadUrl = fieldName === 'hero_animated_image' 
          ? `${process.env.NEXT_PUBLIC_ADMIN_API_URL}/settings/upload?remove_bg=true` 
          : `${process.env.NEXT_PUBLIC_ADMIN_API_URL}/settings/upload`;
          
        const res = await fetch(uploadUrl, {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        if (res.ok && data.url) {
          if (fieldName === 'hero_animated_image') {
             alert("Animation image brewed perfectly! Background successfully removed.");
          }
          if (fieldName === 'banner_images') {
            const currentBanners = Array.isArray(currentProduct.banner_images) ? currentProduct.banner_images : [];
            setCurrentProduct({ ...currentProduct, banner_images: [...currentBanners, data.url] });
          } else {
            setCurrentProduct({ ...currentProduct, [fieldName]: data.url });
          }
        } else {
          alert("Upload failed: " + JSON.stringify(data));
        }
      } catch (err) {
        console.error(err);
        alert("Error uploading file");
      } finally {
        setUploading(null);
        inputElement.value = ""; // Reset input so same file can be selected again if needed
      }
    };

    if (fieldName === 'banner_images') {
      const img = new window.Image();
      const objectUrl = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        // Ensure it is a long banner (e.g., width > 1000 and width is at least 2.5x height)
        if (img.width < 1000 || (img.width / img.height) < 2.5) {
          alert("Banner image must be a long landscape format (e.g. 1920x400) and at least 1000px wide. Your image is " + img.width + "x" + img.height + ".");
          inputElement.value = "";
          return;
        }
        performUpload();
      };
      img.src = objectUrl;
    } else {
      performUpload();
    }
  };

  const removeBanner = (index: number) => {
    if (Array.isArray(currentProduct.banner_images)) {
      const newBanners = [...currentProduct.banner_images];
      newBanners.splice(index, 1);
      setCurrentProduct({ ...currentProduct, banner_images: newBanners });
    }
  };

  const [draggedBannerIdx, setDraggedBannerIdx] = useState<number | null>(null);

  const handleBannerDragStart = (idx: number) => setDraggedBannerIdx(idx);
  const handleBannerDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault(); // Necessary to allow dropping
  };
  const handleBannerDrop = (idx: number) => {
    if (draggedBannerIdx === null || draggedBannerIdx === idx) return;
    const newBanners = [...(currentProduct.banner_images || [])];
    const item = newBanners.splice(draggedBannerIdx, 1)[0];
    newBanners.splice(idx, 0, item);
    setCurrentProduct({ ...currentProduct, banner_images: newBanners });
    setDraggedBannerIdx(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!currentProduct.name || !currentProduct.slug || !currentProduct.category_id) {
        alert("Name, Slug, and Category are required.");
        return;
      }
      
      const payload = { ...currentProduct, category_id: parseInt(currentProduct.category_id as any) };
      const method = currentProduct.id ? 'PUT' : 'POST';
      const url = currentProduct.id ? `${process.env.NEXT_PUBLIC_ADMIN_API_URL}/products/${currentProduct.id}` : `${process.env.NEXT_PUBLIC_ADMIN_API_URL}/products`;
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        alert(`Product ${currentProduct.id ? 'updated' : 'created'} successfully!`);
        setIsEditing(false);
        setCurrentProduct({ status: "active" });
        fetchData();
      } else {
        const errorData = await res.json();
        alert(`Error: ${JSON.stringify(errorData)}`);
      }
    } catch (err) {
      alert('Network error while saving product.');
    }
  };

  const editProduct = (prod: Product) => {
    setCurrentProduct(prod);
    setIsEditing(true);
  };

  const deleteProduct = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
      } else {
        alert("Failed to delete product");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const [draggedItemIdx, setDraggedItemIdx] = useState<number | null>(null);

  if (loading) return <div className="p-8">Loading Products...</div>;

  const handleDragStart = (idx: number) => setDraggedItemIdx(idx);
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  
  const handleDrop = async (idx: number) => {
    if (draggedItemIdx === null || draggedItemIdx === idx) return;
    
    const newProducts = [...products];
    const item = newProducts.splice(draggedItemIdx, 1)[0];
    newProducts.splice(idx, 0, item);
    
    setProducts(newProducts);
    setDraggedItemIdx(null);
    
    // Save to backend
    try {
      const orderedIds = newProducts.map(prod => prod.id);
      await fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/products/reorder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderedIds)
      });
    } catch (err) {
      console.error("Failed to save sequence", err);
    }
  };

  return (
    <div className="max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Products</h1>
          {lastChanged && (
            <p className="text-sm text-gray-500 mt-1">
              Last updated: {new Date(lastChanged.created_at).toLocaleString()} (by {lastChanged.admin.username})
            </p>
          )}
        </div>
        {!isEditing && (
          <button 
            onClick={() => { setIsEditing(true); setCurrentProduct({ name: "", slug: "", short_description: "", hero_description: "", moq: "", price_from: "", status: "active", category_id: undefined, banner_images: [], banner_title: "", banner_subtitle: "" }); }}
            className="bg-meewa-red text-white px-4 py-2 rounded font-medium hover:bg-red-700 transition"
          >
            + Add New Product
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8 space-y-4">
          <h2 className="text-xl font-semibold mb-4">{currentProduct.id ? 'Edit Product' : 'Create Product'}</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" title="The exact name of the product as displayed to customers.">Name * <span className="text-gray-400 cursor-help font-normal ml-1">ⓘ</span></label>
              <input type="text" name="name" value={currentProduct.name || ""} onChange={handleInputChange} required className="w-full border p-2 rounded text-gray-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" title="The URL-friendly version of the name. Must be unique and contain no spaces (e.g., 'custom-pizza-boxes').">Slug * <span className="text-gray-400 cursor-help font-normal ml-1">ⓘ</span></label>
              <input type="text" name="slug" value={currentProduct.slug || ""} onChange={handleInputChange} required className="w-full border p-2 rounded text-gray-900" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" title="The category this product belongs to. Controls where it shows up in navigation.">Category * <span className="text-gray-400 cursor-help font-normal ml-1">ⓘ</span></label>
              <select name="category_id" value={currentProduct.category_id || ""} onChange={handleInputChange} required className="w-full border p-2 rounded bg-white text-gray-900">
                <option value="" disabled>Select a category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select name="status" value={currentProduct.status || "active"} onChange={handleInputChange} className="w-full border p-2 rounded bg-white text-gray-900">
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" title="A brief 1-2 sentence description shown in product grids and underneath the main hero title.">Short Description <span className="text-gray-400 cursor-help font-normal ml-1">ⓘ</span></label>
            <textarea name="short_description" value={currentProduct.short_description || ""} onChange={handleInputChange} rows={3} className="w-full border p-2 rounded text-gray-900" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" title="A longer description shown prominently at the top of the product page beneath the title.">Hero Description <span className="text-gray-400 cursor-help font-normal ml-1">ⓘ</span></label>
            <textarea name="hero_description" value={currentProduct.hero_description || ""} onChange={handleInputChange} rows={4} className="w-full border p-2 rounded text-gray-900" placeholder="Discover premium quality of customizable cups" />
          </div>



          <div className="border-t pt-4 mt-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Product Detail Page (PDP) Settings</h3>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" title="The main thumbnail image used in grids and search results. Should be square or standard portrait.">Cover Image (Thumbnail) <span className="text-gray-400 cursor-help font-normal ml-1">ⓘ</span></label>
                {currentProduct.cover_image && (
                  <div className="relative inline-block mb-2 group">
                    <img src={(currentProduct.cover_image)?.startsWith("http") ? (currentProduct.cover_image) : `${process.env.NEXT_PUBLIC_API_URL}${currentProduct.cover_image}`} className="h-20 rounded border object-contain bg-gray-50" />
                    <button type="button" onClick={() => setCurrentProduct({ ...currentProduct, cover_image: '' })} className="absolute -top-2 -right-2 bg-white text-red-500 rounded-full p-1 shadow border border-gray-200 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity" title="Remove image">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    </button>
                  </div>
                )}
                <input type="file" onChange={(e) => handleFileUpload(e, 'cover_image')} className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-meewa-red hover:file:bg-red-100 cursor-pointer" />
                {uploading === 'cover_image' && <span className="block text-sm text-red-500 mt-2">Uploading...</span>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" title="The image that animates downwards on scroll on the product page. Ideally a transparent PNG of the product.">Hero Animated Image (Cutout for Parallax) <span className="text-gray-400 cursor-help font-normal ml-1">ⓘ</span></label>
                {currentProduct.hero_animated_image && (
                  <div className="relative inline-block mb-2 group">
                    <img src={(currentProduct.hero_animated_image)?.startsWith("http") ? (currentProduct.hero_animated_image) : `${process.env.NEXT_PUBLIC_API_URL}${currentProduct.hero_animated_image}`} className="h-20 rounded border object-contain bg-gray-100" />
                    <button type="button" onClick={() => setCurrentProduct({ ...currentProduct, hero_animated_image: '' })} className="absolute -top-2 -right-2 bg-white text-red-500 rounded-full p-1 shadow border border-gray-200 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity" title="Remove image">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    </button>
                  </div>
                )}
                
                {uploading === 'hero_animated_image' ? (
                  <div className="mt-2 p-4 rounded-lg bg-red-50/50 border border-red-100">
                    <style>{`
                      @keyframes indeterminate {
                        0% { transform: translateX(-100%); }
                        100% { transform: translateX(200%); }
                      }
                    `}</style>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-5 h-5 rounded-full border-2 border-meewa-red border-t-transparent animate-spin"></div>
                      <span className="text-sm font-semibold text-gray-900">Brewing your animation...</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-3 ml-8 leading-relaxed">
                      Our AI is currently processing this image to precisely remove the background. <br/>This usually takes <strong>10-15 seconds</strong>. Please don't close this page.
                    </p>
                    <div className="ml-8 w-full max-w-sm h-1.5 bg-gray-200 rounded-full overflow-hidden relative">
                      <div 
                        className="absolute top-0 left-0 h-full bg-meewa-red rounded-full w-1/2" 
                        style={{ animation: 'indeterminate 1.5s infinite ease-in-out' }}
                      ></div>
                    </div>
                  </div>
                ) : (
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'hero_animated_image')} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:font-semibold file:bg-red-50 file:text-meewa-red hover:file:bg-red-100 cursor-pointer" />
                )}
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section 1 Banner Image (Parallax Background)</label>
                {currentProduct.section1_image && (
                  <div className="relative inline-block mb-2 group">
                    <img src={`${currentProduct.section1_image?.startsWith('http') ? currentProduct.section1_image : process.env.NEXT_PUBLIC_ADMIN_API_URL + currentProduct.section1_image}`} alt="Preview" className="h-16 object-contain rounded-md border" />
                    <button type="button" onClick={() => setCurrentProduct({ ...currentProduct, section1_image: '' })} className="absolute -top-2 -right-2 bg-white text-red-500 rounded-full p-1 shadow border border-gray-200 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity" title="Remove image">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    </button>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'section1_image')} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"/>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Banner Title</label>
                <input type="text" name="banner_title" value={currentProduct.banner_title || ""} onChange={handleInputChange} placeholder="Get your customized coffee cup" className="w-full border p-2 rounded text-gray-900" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Banner Subtitle (Paragraph)</label>
                <textarea name="banner_subtitle" value={currentProduct.banner_subtitle || ""} onChange={handleInputChange} rows={3} placeholder={currentProduct.short_description || "Hot, cold, frozen or fresh, our food service packaging works to keep every meal presentable and intact."} className="w-full border p-2 rounded text-gray-900" />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1" title="The scrolling text banner shown across the product page. Space separate the words.">Marquee Text (Ticker tape) <span className="text-gray-400 cursor-help font-normal ml-1">ⓘ</span></label>
              <input type="text" name="marquee_text" value={currentProduct.marquee_text || ""} onChange={handleInputChange} placeholder="Restaurants Hotels Cafés Bakeries Caterers Retail Stores Supermarkets Global Importers" className="w-full border p-2 rounded text-gray-900" />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1" title="Wide banners to show below the product. MUST be very wide (at least 1000px wide and 2.5:1 ratio, e.g., 1920x400).">Long Banner Images <span className="text-gray-400 cursor-help font-normal ml-1">ⓘ</span></label>
              <p className="text-xs text-gray-500 mb-2 mt-[-2px]">Required dimensions: Minimum 1000 x 400 px, Maximum 3000 x 1200 px</p>
              <div className="flex items-center gap-4 mb-2">
                <input type="file" onChange={(e) => handleFileUpload(e, 'banner_images')} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-meewa-red hover:file:bg-red-100 cursor-pointer" />
                {uploading === 'banner_images' && <span className="text-sm text-red-500">Uploading...</span>}
              </div>
              <div className="space-y-2">
                {Array.isArray(currentProduct.banner_images) && currentProduct.banner_images.map((banner, idx) => (
                  <div 
                    key={idx} 
                    draggable
                    onDragStart={() => handleBannerDragStart(idx)}
                    onDragOver={(e) => handleBannerDragOver(e, idx)}
                    onDrop={() => handleBannerDrop(idx)}
                    className="flex items-center gap-4 bg-gray-50 p-2 rounded border cursor-move hover:bg-gray-100 transition-colors"
                  >
                    <div className="text-gray-400 px-2 cursor-grab" title="Drag to reorder">⠿</div>
                    <img src={(banner)?.startsWith("http") ? (banner) : `${process.env.NEXT_PUBLIC_API_URL}${banner}`} className="h-12 object-contain" />
                    <button type="button" onClick={() => removeBanner(idx)} className="text-red-500 text-sm font-medium ml-auto">✕ Remove</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4 mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Product Description Component (Points)</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Component Title</label>
                  <input type="text" name="description_title" value={currentProduct.description_title || ""} onChange={handleInputChange} placeholder="Premium Quality Materials" className="w-full border p-2 rounded text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">List Style</label>
                  <select name="description_list_style" value={currentProduct.description_list_style || "checkmarks"} onChange={handleInputChange} className="w-full border p-2 rounded bg-white text-gray-900">
                    <option value="checkmarks">Checkmarks (Red)</option>
                    <option value="bullets">Bullets (Disc)</option>
                    <option value="numbers">Numbers</option>
                    <option value="none">None (Plain Text)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bullet Points</label>
                <div className="space-y-2">
                  {Array.isArray(currentProduct.description_points) && currentProduct.description_points.map((pt: string, idx: number) => (
                    <div key={idx} className="flex gap-2">
                      <input 
                        type="text" 
                        value={pt} 
                        onChange={(e) => {
                          const pts = [...(currentProduct.description_points || [])];
                          pts[idx] = e.target.value;
                          setCurrentProduct({ ...currentProduct, description_points: pts });
                        }} 
                        className="w-full border p-2 rounded text-gray-900" 
                      />
                      <button 
                        type="button" 
                        onClick={() => {
                          const pts = [...(currentProduct.description_points || [])];
                          pts.splice(idx, 1);
                          setCurrentProduct({ ...currentProduct, description_points: pts });
                        }} 
                        className="bg-red-50 text-red-500 px-3 py-2 rounded border border-red-100 hover:bg-red-100"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                <button 
                  type="button" 
                  onClick={() => {
                    const pts = Array.isArray(currentProduct.description_points) ? [...currentProduct.description_points] : [];
                    pts.push("");
                    setCurrentProduct({ ...currentProduct, description_points: pts });
                  }} 
                  className="mt-2 text-sm text-meewa-red font-medium flex items-center gap-1 hover:underline"
                >
                  + Add Point
                </button>
              </div>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((prod, idx) => (
                <tr 
                  key={prod.id}
                  draggable
                  onDragStart={() => handleDragStart(idx)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(idx)}
                  className="cursor-move hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="text-gray-400 cursor-grab" title="Drag to reorder">⠿</div>
                      {prod.cover_image ? <img src={(prod.cover_image)?.startsWith("http") ? (prod.cover_image) : `${process.env.NEXT_PUBLIC_API_URL}${prod.cover_image}`} className="w-10 h-10 rounded object-cover" /> : <div className="w-10 h-10 bg-gray-200 rounded"></div>}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{prod.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {categories.find(c => c.id === prod.category_id)?.name || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${prod.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {prod.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => editProduct(prod)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                    <button onClick={() => deleteProduct(prod.id)} className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">No products found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
