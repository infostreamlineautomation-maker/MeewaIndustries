"use client";

import { useState, useEffect } from 'react';

export default function CategoriesPageManagement() {
  const [settings, setSettings] = useState({
    categories_hero_image_url: "",
    categories_why_title: "",
    categories_why_subtitle: "",
    categories_custom_banner_title: "",
  });
  
  const [categoriesList, setCategoriesList] = useState<{title: string, subtitle: string, image_url: string}[]>([]);
  const [whyFeatures, setWhyFeatures] = useState<{title: string, icon_url: string}[]>([]);
  const [bannerImages, setBannerImages] = useState<{image_url: string}[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);

  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [draggedProductIdx, setDraggedProductIdx] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/settings`),
      fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/categories`),
      fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/products`)
    ])
      .then(async ([resSettings, resCat, resProd]) => {
        const data = await resSettings.json();
        setDbCategories(await resCat.json());
        const rawProds = await resProd.json();
        
        // Filter active products and sort by sequence
        const activeProds = rawProds
          .filter((p: any) => p.status === 'active')
          .sort((a: any, b: any) => (a.sequence || 0) - (b.sequence || 0));
        setDbProducts(activeProds);
        setSettings({
          categories_hero_image_url: data.categories_hero_image_url || "",
          categories_why_title: data.categories_why_title || "",
          categories_why_subtitle: data.categories_why_subtitle || "",
          categories_custom_banner_title: data.categories_custom_banner_title || "",
        });

        const defaultCategories = [
          { title: "Paper Cups", subtitle: "Coffee Paper Cups", image_url: "" },
          { title: "Paper Cups", subtitle: "Cold Drink Paper Cups", image_url: "" },
          { title: "Paper Cups", subtitle: "Custom Printed Cups", image_url: "" }
        ];

        const defaultWhyFeatures = [
          { title: "Food Safe Materials", icon_url: "" },
          { title: "Leak Resistant Design", icon_url: "" },
          { title: "Eco-Friendly Options", icon_url: "" },
          { title: "Bulk Manufacturing", icon_url: "" },
          { title: "Global Export Standards", icon_url: "" },
          { title: "Custom Branding", icon_url: "" },
        ];

        setCategoriesList(data.categories_list?.length > 0 ? data.categories_list : defaultCategories);
        setWhyFeatures(data.categories_why_features?.length > 0 ? data.categories_why_features : defaultWhyFeatures);
        setBannerImages(data.categories_custom_banner_images || []);
        
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch settings", err);
        setLoading(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setUploading(fieldName);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/settings/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setSettings(prev => ({ ...prev, [fieldName]: data.url }));
        await fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/settings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: fieldName, value: data.url })
        });
      } else {
        alert("Upload failed: " + JSON.stringify(data));
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading file");
    } finally {
      setUploading(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const bulkData = [
        ...Object.entries(settings).map(([key, value]) => ({ key, value })),
        { key: "categories_why_features", value: whyFeatures },
        { key: "categories_custom_banner_images", value: bannerImages }
      ];
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/settings/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bulkData)
      });
      
      if (res.ok) {
        alert('Categories page settings saved successfully!');
      } else {
        alert('Error saving settings.');
      }
    } catch (err) {
      alert('Error saving settings.');
    }
  };

  // Product Reorder Handlers
  const handleDragStart = (idx: number) => setDraggedProductIdx(idx);
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  
  const handleDrop = async (idx: number) => {
    if (draggedProductIdx === null || draggedProductIdx === idx) return;
    
    const newProducts = [...dbProducts];
    const item = newProducts.splice(draggedProductIdx, 1)[0];
    newProducts.splice(idx, 0, item);
    
    setDbProducts(newProducts);
    setDraggedProductIdx(null);
    
    try {
      const orderedIds = newProducts.map(p => p.id);
      await fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/products/reorder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderedIds)
      });
    } catch (err) {
      console.error("Failed to save sequence", err);
    }
  };

  // Why Features Handlers
  const addFeature = () => setWhyFeatures([...whyFeatures, { title: "", icon_url: "" }]);
  const removeFeature = (index: number) => setWhyFeatures(whyFeatures.filter((_, i) => i !== index));
  const updateFeature = (index: number, field: 'title', value: string) => {
    const newList = [...whyFeatures];
    newList[index][field] = value;
    setWhyFeatures(newList);
  };
  const handleFeatureIconUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/settings/upload`, { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok && data.url) {
        const newList = [...whyFeatures];
        newList[index].icon_url = data.url;
        setWhyFeatures(newList);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Banner Images Handlers
  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);
    setUploading('banners');
    
    try {
      const newBanners = [...bannerImages];
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/settings/upload`, { method: 'POST', body: formData });
        const data = await res.json();
        if (res.ok && data.url) {
          newBanners.push({ image_url: data.url });
        }
      }
      setBannerImages(newBanners);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(null);
    }
  };
  const removeBanner = (index: number) => {
    setBannerImages(bannerImages.filter((_, i) => i !== index));
  };

  if (loading) return <div className="p-8">Loading settings...</div>;

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Product Page Settings</h1>
      
      <form onSubmit={handleSave} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-12">
        
        {/* Product Reordering UI */}
        <div className="space-y-6">
          <div className="border-b pb-2">
            <h2 className="text-xl font-semibold text-gray-800">Product Display Order</h2>
            <p className="text-sm text-gray-500 mt-1">Drag and drop the products below to change the order they appear on the Product Page and Landing Page. Only active products are shown.</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <tbody className="bg-white divide-y divide-gray-200">
                {dbProducts.map((prod, idx) => (
                  <tr 
                    key={prod.id}
                    draggable
                    onDragStart={() => handleDragStart(idx)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(idx)}
                    className="cursor-move hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap w-24">
                      <div className="flex items-center gap-3">
                        <div className="text-gray-400 cursor-grab" title="Drag to reorder">⠿</div>
                        {prod.cover_image ? (
                          <img src={(prod.cover_image)?.startsWith("http") ? (prod.cover_image) : `${process.env.NEXT_PUBLIC_API_URL}${prod.cover_image}`} className="w-10 h-10 object-cover rounded" />
                        ) : (
                          <div className="w-10 h-10 bg-gray-200 rounded"></div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{prod.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">Category ID: {prod.category_id}</td>
                  </tr>
                ))}
                {dbProducts.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center text-gray-500">No active products found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Why Our Products? */}
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="text-xl font-semibold text-gray-800">Why Our Products?</h2>
            <button type="button" onClick={addFeature} className="text-sm bg-meewa-red text-white px-3 py-1 rounded">+ Add Feature</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input type="text" name="categories_why_title" value={settings.categories_why_title} onChange={handleChange} placeholder="Why Our Products?" className="w-full border-gray-300 rounded-md p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
              <input type="text" name="categories_why_subtitle" value={settings.categories_why_subtitle} onChange={handleChange} placeholder="Built for Quality, Designed for Performance" className="w-full border-gray-300 rounded-md p-2 border" />
            </div>
          </div>

          <div className="space-y-4">
            {whyFeatures.map((feat, idx) => (
              <div key={idx} className="flex gap-4 items-center bg-gray-50 p-4 rounded-lg relative">
                <button type="button" onClick={() => removeFeature(idx)} className="absolute top-4 right-4 text-red-500 font-bold">✕</button>
                <div className="w-2/3 mr-8">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Feature Title</label>
                  <input type="text" value={feat.title} onChange={(e) => updateFeature(idx, 'title', e.target.value)} className="w-full border-gray-300 rounded-md p-2 border text-sm" />
                </div>
                <div className="w-1/3">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Icon (Red Checkmark by default)</label>
                  <div className="flex items-center gap-2">
                    {feat.icon_url ? (
                      <img src={(feat.icon_url)?.startsWith("http") ? (feat.icon_url) : `${process.env.NEXT_PUBLIC_API_URL}${feat.icon_url}`} className="w-8 h-8 object-contain" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-red-500 text-xs">✓</div>
                    )}
                    <input type="file" accept="image/*" onChange={(e) => handleFeatureIconUpload(idx, e)} className="text-xs w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Packaging Banner */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Custom Packaging Banner</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Banner Title</label>
            <input type="text" name="categories_custom_banner_title" value={settings.categories_custom_banner_title} onChange={handleChange} placeholder="Custom Packaging Banner" className="w-full border-gray-300 rounded-md p-2 border" />
          </div>
          
          <div className="flex flex-wrap gap-4 mb-4 mt-4">
            {bannerImages.map((banner, idx) => (
              <div key={idx} className="relative border p-2 rounded bg-gray-50 w-32 h-32">
                <button type="button" onClick={() => removeBanner(idx)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center">✕</button>
                <img src={(banner.image_url)?.startsWith("http") ? (banner.image_url) : `${process.env.NEXT_PUBLIC_API_URL}${banner.image_url}`} className="w-full h-full object-cover rounded" />
              </div>
            ))}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Banner Images (Multiple)</label>
            <input type="file" multiple accept="image/*" onChange={handleBannerUpload} disabled={uploading === 'banners'} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-red-50 file:text-meewa-red" />
            {uploading === 'banners' && <p className="text-sm text-meewa-red mt-2">Uploading banners...</p>}
          </div>
        </div>

        <div className="mt-10 pt-6 border-t">
          <button type="submit" className="bg-meewa-red text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition-colors">
            Save Product Page Settings
          </button>
        </div>
      </form>
    </div>
  );
}
