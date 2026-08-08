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

  useEffect(() => {
    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/settings`),
      fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/categories`),
      fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/products`)
    ])
      .then(async ([resSettings, resCat, resProd]) => {
        const data = await resSettings.json();
        setDbCategories(await resCat.json());
        setDbProducts(await resProd.json());
        setSettings({
          categories_hero_image_url: data.categories_hero_image_url || "",
          categories_why_title: data.categories_why_title || "Why Our Products?",
          categories_why_subtitle: data.categories_why_subtitle || "Built for Quality, Designed for Performance",
          categories_custom_banner_title: data.categories_custom_banner_title || "Custom Packaging Banner",
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
        { key: "categories_list", value: categoriesList },
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

  // Categories Handlers
  const addCategory = () => setCategoriesList([...categoriesList, { title: "", subtitle: "", image_url: "" }]);
  const removeCategory = (index: number) => setCategoriesList(categoriesList.filter((_, i) => i !== index));
  const updateCategory = (index: number, field: 'title' | 'subtitle', value: string) => {
    const newList = [...categoriesList];
    newList[index][field] = value;
    setCategoriesList(newList);
  };
  const handleCategoryImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/settings/upload`, { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok && data.url) {
        const newList = [...categoriesList];
        newList[index].image_url = data.url;
        setCategoriesList(newList);
      }
    } catch (err) {
      console.error(err);
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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Categories Page Management</h1>
      
      <form onSubmit={handleSave} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-12">
        
        {/* Hero Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Hero Section</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hero Background Image</label>
            {settings.categories_hero_image_url && (
              <div className="mb-4">
                <img src={`${process.env.NEXT_PUBLIC_API_URL}${settings.categories_hero_image_url}`} className="h-40 rounded border object-cover" />
              </div>
            )}
            <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, "categories_hero_image_url")} disabled={uploading === "categories_hero_image_url"} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-red-50 file:text-meewa-red" />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="text-xl font-semibold text-gray-800">Categories Grid</h2>
            <button type="button" onClick={addCategory} className="text-sm bg-meewa-red text-white px-3 py-1 rounded">+ Add Item</button>
          </div>
          <div className="space-y-4">
            {categoriesList.map((cat, idx) => (
              <div key={idx} className="p-4 border rounded-lg bg-gray-50 relative">
                <button type="button" onClick={() => removeCategory(idx)} className="absolute top-4 right-4 text-red-500 text-sm font-bold">✕ Remove</button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mr-16">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Select Category</label>
                    <select 
                      value={dbCategories.find(c => c.name === cat.title)?.id || ""}
                      onChange={(e) => {
                        const selectedCat = dbCategories.find(c => c.id === parseInt(e.target.value));
                        if (selectedCat) updateCategory(idx, 'title', selectedCat.name);
                      }}
                      className="w-full border-gray-300 rounded-md p-2 border text-sm bg-white"
                    >
                      <option value="" disabled>Select a category</option>
                      {dbCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Select Product</label>
                    <select 
                      value={dbProducts.find(p => p.name === cat.subtitle)?.id || ""}
                      onChange={(e) => {
                        const selectedProd = dbProducts.find(p => p.id === parseInt(e.target.value));
                        if (selectedProd) {
                           updateCategory(idx, 'subtitle', selectedProd.name);
                           if (selectedProd.cover_image) {
                             const newList = [...categoriesList];
                             newList[idx].image_url = selectedProd.cover_image;
                             setCategoriesList(newList);
                           }
                        }
                      }}
                      className="w-full border-gray-300 rounded-md p-2 border text-sm bg-white"
                    >
                      <option value="" disabled>Select a product</option>
                      {dbProducts
                        .filter(p => !cat.title || dbCategories.find(c => c.name === cat.title)?.id === p.category_id)
                        .map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Image Preview (Auto-populated from Product)</label>
                    <div className="flex items-center gap-4">
                      {cat.image_url && <img src={`${process.env.NEXT_PUBLIC_API_URL}${cat.image_url}`} className="w-16 h-16 object-cover bg-white rounded border" />}
                      <span className="text-xs text-gray-500">Edit the product in Manage Products to change this image.</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
              <input type="text" name="categories_why_title" value={settings.categories_why_title} onChange={handleChange} className="w-full border-gray-300 rounded-md p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
              <input type="text" name="categories_why_subtitle" value={settings.categories_why_subtitle} onChange={handleChange} className="w-full border-gray-300 rounded-md p-2 border" />
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
                      <img src={`${process.env.NEXT_PUBLIC_API_URL}${feat.icon_url}`} className="w-8 h-8 object-contain" />
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
            <input type="text" name="categories_custom_banner_title" value={settings.categories_custom_banner_title} onChange={handleChange} className="w-full border-gray-300 rounded-md p-2 border" />
          </div>
          
          <div className="flex flex-wrap gap-4 mb-4 mt-4">
            {bannerImages.map((banner, idx) => (
              <div key={idx} className="relative border p-2 rounded bg-gray-50 w-32 h-32">
                <button type="button" onClick={() => removeBanner(idx)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center">✕</button>
                <img src={`${process.env.NEXT_PUBLIC_API_URL}${banner.image_url}`} className="w-full h-full object-cover rounded" />
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
            Save Categories Page Settings
          </button>
        </div>
      </form>
    </div>
  );
}
