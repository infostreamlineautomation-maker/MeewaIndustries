"use client";

import { useState, useEffect } from 'react';
import MediaPickerButton from "@/components/MediaPickerButton";
import FaqPlacementEditor from "@/components/FaqPlacementEditor";

export default function LandingPageManagement() {
  const [settings, setSettings] = useState({
    hero_title: "",
    hero_subtitle: "",
    hero_tagline: "",
    hero_image_url: "",
    about_title: "",
    about_subtitle: "",
    about_media_url: "",
    about_center_text: "",
    industries_image_1: "",
    industries_image_2: "",
    industries_image_3: "",
    industries_image_4: "",
    industries_image_5: "",
    contact_phone: "",
    contact_email: "",
    contact_address: "",
    contact_whatsapp: "",
    contact_website: "",
    get_in_touch_title: "",
    get_in_touch_subtitle: "",
    social_linkedin: "",
    social_facebook: "",
    social_instagram: "",
    social_youtube: "",
    reliable_partner_title: "",
    reliable_partner_subtitle: "",
    reliable_partner_btn_text: "",
    reliable_partner_btn_link: "",
    hide_reliable_partner: "false",
    industries_title: "",
    industries_subtitle: "",
    export_title: "",
    export_subtitle: "",
    export_process_media_url: "",
    landing_featured_products: [] as number[],
    hide_landing_hero: "false",
    hide_landing_featured: "false",
    hide_landing_why: "false",
    hide_landing_export: "false",
    hide_landing_industries: "false",
    hide_landing_about: "false",
    hide_landing_contact: "false",
  });
  
  const [products, setProducts] = useState<any[]>([]);
  
  const [features, setFeatures] = useState<{title: string, description: string, icon: string}[]>([]);
  const [industries, setIndustries] = useState<string[]>([]);
  const [exportSteps, setExportSteps] = useState<{num: string, title: string, desc: string}[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [heroBanners, setHeroBanners] = useState<{url: string, duration: number}[]>([]);

  useEffect(() => {
    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/settings`).then(res => res.json()),
      fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/products`).then(res => res.json())
    ])
      .then(([data, productsData]) => {
        setProducts(productsData || []);
        setSettings({
          hero_title: data.hero_title || "",
          hero_subtitle: data.hero_subtitle || "",
          hero_tagline: data.hero_tagline || "",
          hero_image_url: data.hero_image_url || "",
          about_title: data.about_title || "",
          about_subtitle: data.about_subtitle || "",
          about_media_url: data.about_media_url || "",
          about_center_text: data.about_center_text || "",
          industries_image_1: data.industries_image_1 || "",
          industries_image_2: data.industries_image_2 || "",
          industries_image_3: data.industries_image_3 || "",
          industries_image_4: data.industries_image_4 || "",
          industries_image_5: data.industries_image_5 || "",
          contact_phone: data.contact_phone || "",
          contact_email: data.contact_email || "",
          contact_address: data.contact_address || "",
          contact_whatsapp: data.contact_whatsapp || "",
          contact_website: data.contact_website || "",
          get_in_touch_title: data.get_in_touch_title || "",
          get_in_touch_subtitle: data.get_in_touch_subtitle || "",
          social_linkedin: data.social_linkedin || "",
          social_facebook: data.social_facebook || "",
          social_instagram: data.social_instagram || "",
          social_youtube: data.social_youtube || "",
          reliable_partner_title: data.reliable_partner_title || "",
          reliable_partner_subtitle: data.reliable_partner_subtitle || "",
          reliable_partner_btn_text: data.reliable_partner_btn_text || "",
          reliable_partner_btn_link: data.reliable_partner_btn_link || "",
          hide_reliable_partner: data.hide_reliable_partner || "false",
          industries_title: data.industries_title || "",
          industries_subtitle: data.industries_subtitle || "",
          export_title: data.export_title || "",
          export_subtitle: data.export_subtitle || "",
          export_process_media_url: data.export_process_media_url || "",
          landing_featured_products: data.landing_featured_products || [],
          hide_landing_hero: data.hide_landing_hero || "false",
          hide_landing_featured: data.hide_landing_featured || "false",
          hide_landing_why: data.hide_landing_why || "false",
          hide_landing_export: data.hide_landing_export || "false",
          hide_landing_industries: data.hide_landing_industries || "false",
          hide_landing_about: data.hide_landing_about || "false",
          hide_landing_contact: data.hide_landing_contact || "false",
        });
        
        let initialBanners = data.hero_banners || [];
        if (initialBanners.length === 0 && data.hero_image_url) {
          initialBanners = [{ url: data.hero_image_url, duration: 5 }];
        }
        setHeroBanners(initialBanners);

        const defaultFeatures = [
          { title: "Food-Grade Quality", description: "Manufactured using safe and reliable materials suitable for food applications.", icon: "/icons/Shield.svg" },
          { title: "Competitive Pricing", description: "Factory-direct solutions for wholesalers, importers, and distributors.", icon: "/icons/Guarantee.svg" },
          { title: "Custom Manufacturing", description: "OEM and private label packaging according to your brand requirements.", icon: "/icons/Print.svg" },
          { title: "Reliable Export Service", description: "Professional support for international orders and shipping.", icon: "/icons/Star of Bethlehem.svg" },
          { title: "Consistent Supply", description: "Efficient production and quality checks for bulk requirements.", icon: "/icons/Clock Checked.svg" }
        ];
        
        const defaultIndustries = [
          "Importers & Distributors", "Wholesale Suppliers", "Restaurants", "Cafés & Coffee Chains", 
          "Hotels", "Catering Companies", "Food Delivery Brands", "Supermarkets", "Hospitality Businesses"
        ];
        
        const defaultExportSteps = [
          { num: "01", title: "Inquiry", desc: "Share your product requirements and order details." },
          { num: "02", title: "Quotation", desc: "Receive pricing based on your quantity and specifications." },
          { num: "03", title: "Sample Approval", desc: "Review samples before bulk production." },
          { num: "04", title: "Production", desc: "Manufacturing begins with quality monitoring." },
          { num: "05", title: "Quality Check", desc: "Products are inspected before shipment." },
          { num: "06", title: "Global Shipping", desc: "Orders are packed and delivered worldwide." },
        ];


        setFeatures(data.landing_features?.length > 0 ? data.landing_features : defaultFeatures);
        setIndustries(data.landing_industries?.length > 0 ? data.landing_industries : defaultIndustries);
        setExportSteps(data.landing_export_steps?.length > 0 ? data.landing_export_steps : defaultExportSteps);
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

  const applyFieldUrl = async (fieldName: string, url: string) => {
    setSettings(prev => ({ ...prev, [fieldName]: url }));
    // Auto-save the image to the DB immediately
    await fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: fieldName, value: url })
    });
  };

  const addBannersFromLibrary = async (urls: string[]) => {
    const newBanners = [...heroBanners, ...urls.map(url => ({ url, duration: 5 }))];
    setHeroBanners(newBanners);
    await fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: "hero_banners", value: newBanners })
    });
  };

  const applyFeatureIcon = async (index: number, url: string) => {
    const newFeatures = [...features];
    newFeatures[index].icon = url;
    setFeatures(newFeatures);

    // Auto-save features array
    await fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'landing_features', value: newFeatures })
    });
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
        await applyFieldUrl(fieldName, data.url);
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

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploading("hero_banners");
    
    const uploadedBanners = [...heroBanners];
    let hasError = false;
    
    for (let i = 0; i < e.target.files.length; i++) {
      const file = e.target.files[i];
      const formData = new FormData();
      formData.append("file", file);
      
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/settings/upload`, {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        if (res.ok && data.url) {
          uploadedBanners.push({ url: data.url, duration: 5 });
        } else {
          hasError = true;
        }
      } catch (err) {
        console.error(err);
        hasError = true;
      }
    }
    
    if (hasError) alert("Some files failed to upload.");
    
    setHeroBanners(uploadedBanners);
    await fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: "hero_banners", value: uploadedBanners })
    });
    setUploading(null);
  };

  const removeBanner = async (index: number) => {
    const newBanners = heroBanners.filter((_, i) => i !== index);
    setHeroBanners(newBanners);
    await fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: "hero_banners", value: newBanners })
    });
  };

  const updateBannerDuration = async (index: number, duration: number) => {
    const newBanners = [...heroBanners];
    newBanners[index].duration = duration;
    setHeroBanners(newBanners);
    await fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: "hero_banners", value: newBanners })
    });
  };

  const handleFeatureIconUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/settings/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.url) {
        await applyFeatureIcon(index, data.url);
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

  const handleToggle = (key: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: (prev as any)[key] === "true" ? "false" : "true"
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const bulkData = [
        ...Object.entries(settings).map(([key, value]) => ({ key, value })),
        { key: "landing_features", value: features },
        { key: "landing_industries", value: industries },
        { key: "landing_export_steps", value: exportSteps }
      ];
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/settings/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bulkData)
      });
      
      if (res.ok) {
        alert('Landing page settings saved successfully!');
      } else {
        alert('Error saving settings.');
      }
    } catch (err) {
      alert('Error saving settings.');
    }
  };


  // Feature Handlers
  const addFeature = () => setFeatures([...features, { title: "", description: "", icon: "" }]);
  const removeFeature = (index: number) => setFeatures(features.filter((_, i) => i !== index));
  const updateFeature = (index: number, field: 'title' | 'description', value: string) => {
    const newFeatures = [...features];
    newFeatures[index][field] = value;
    setFeatures(newFeatures);
  };

  // Industries Handlers
  const addIndustry = () => setIndustries([...industries, ""]);
  const removeIndustry = (index: number) => setIndustries(industries.filter((_, i) => i !== index));
  const updateIndustry = (index: number, value: string) => {
    const newIndustries = [...industries];
    newIndustries[index] = value;
    setIndustries(newIndustries);
  };

  // Export Steps Handlers
  const addExportStep = () => setExportSteps([...exportSteps, { num: "0" + (exportSteps.length + 1), title: "", desc: "" }]);
  const removeExportStep = (index: number) => setExportSteps(exportSteps.filter((_, i) => i !== index));
  const updateExportStep = (index: number, field: 'num' | 'title' | 'desc', value: string) => {
    const newSteps = [...exportSteps];
    newSteps[index][field] = value;
    setExportSteps(newSteps);
  };

  // Featured Products Handlers
  const addFeaturedProduct = (productId: number) => {
    if (!settings.landing_featured_products.includes(productId)) {
      setSettings({ ...settings, landing_featured_products: [...settings.landing_featured_products, productId] });
    }
  };
  const removeFeaturedProduct = (index: number) => {
    const newList = [...settings.landing_featured_products];
    newList.splice(index, 1);
    setSettings({ ...settings, landing_featured_products: newList });
  };
  const moveFeaturedProduct = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index > 0) {
      const newList = [...settings.landing_featured_products];
      [newList[index - 1], newList[index]] = [newList[index], newList[index - 1]];
      setSettings({ ...settings, landing_featured_products: newList });
    } else if (direction === 'down' && index < settings.landing_featured_products.length - 1) {
      const newList = [...settings.landing_featured_products];
      [newList[index + 1], newList[index]] = [newList[index], newList[index + 1]];
      setSettings({ ...settings, landing_featured_products: newList });
    }
  };
  if (loading) return <div className="p-8">Loading settings...</div>;

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Landing Page Management</h1>
      
      <form onSubmit={handleSave} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-10">
        
        {/* Component Visibility Settings */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Component Visibility</h2>
          <p className="text-sm text-gray-500">Toggle sections on or off for the Landing Page.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ToggleOption label="Hero Section" description="The top banner section." checked={settings.hide_landing_hero !== "true"} onChange={() => handleToggle('hide_landing_hero')} />
            <ToggleOption label="Featured Products" description="Grid of featured products." checked={settings.hide_landing_featured !== "true"} onChange={() => handleToggle('hide_landing_featured')} />
            <ToggleOption label="Why Choose Us" description="Key benefits and features." checked={settings.hide_landing_why !== "true"} onChange={() => handleToggle('hide_landing_why')} />
            <ToggleOption label="Export Process" description="Step-by-step export flow." checked={settings.hide_landing_export !== "true"} onChange={() => handleToggle('hide_landing_export')} />
            <ToggleOption label="Industries We Serve" description="List of industries served." checked={settings.hide_landing_industries !== "true"} onChange={() => handleToggle('hide_landing_industries')} />
            <ToggleOption label="About Company" description="Brief company overview." checked={settings.hide_landing_about !== "true"} onChange={() => handleToggle('hide_landing_about')} />
            <ToggleOption label="Contact & FAQs" description="Contact form and FAQ list." checked={settings.hide_landing_contact !== "true"} onChange={() => handleToggle('hide_landing_contact')} />
          </div>
        </div>

        {/* Hero Section Settings */}
        <div className="space-y-12">
          {/* Hero Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Hero Section</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-gray-900">Hero Title</label>
              <input 
                type="text" 
                name="hero_title"
                value={settings.hero_title}
                onChange={handleChange}
                placeholder="Premium Paper Packaging"
                className="w-full border-gray-300 rounded-md shadow-sm p-2 border text-gray-900 bg-white placeholder-gray-400 focus:border-meewa-red focus:ring-meewa-red" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-gray-900">Hero Subtitle</label>
              <textarea 
                name="hero_subtitle"
                value={settings.hero_subtitle}
                onChange={handleChange}
                rows={3}
                placeholder="Sustainable, high-quality disposable food packaging solutions."
                className="w-full border-gray-300 rounded-md shadow-sm p-2 border text-gray-900 bg-white placeholder-gray-400 focus:border-meewa-red focus:ring-meewa-red"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-gray-900">Hero Pink Container Tagline</label>
              <textarea 
                name="hero_tagline"
                value={settings.hero_tagline}
                onChange={handleChange}
                rows={2} 
                placeholder="Premium Paper Packaging. Sustainable, high-quality disposable food packaging solutions."
                className="w-full border-gray-300 rounded-md shadow-sm p-2 border text-gray-900 bg-white placeholder-gray-400 focus:border-meewa-red focus:ring-meewa-red"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hero Banners (Images/Videos)</label>
              <p className="text-xs text-gray-500 mb-3">Upload multiple banners to create a presentation slider. Set how many seconds each banner should stay on screen.</p>
              
              <div className="space-y-4 mb-4">
                {heroBanners.map((banner, index) => (
                  <div key={index} className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <div className="w-32 h-20 shrink-0">
                      {banner.url.endsWith('.mp4') ? (
                        <video src={(banner.url)?.startsWith("http") ? banner.url : `${process.env.NEXT_PUBLIC_API_URL}${banner.url}`} autoPlay loop muted playsInline className="w-full h-full rounded border object-cover bg-black" />
                      ) : (
                        <img src={(banner.url)?.startsWith("http") ? banner.url : `${process.env.NEXT_PUBLIC_API_URL}${banner.url}`} alt={`Banner ${index + 1}`} className="w-full h-full rounded border object-cover" onError={(e) => { e.currentTarget.src = banner.url }} />
                      )}
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-center gap-2">
                      <label className="text-sm font-medium text-gray-700">Duration (Seconds)</label>
                      <input 
                        type="number" 
                        min="1"
                        value={banner.duration}
                        onChange={(e) => updateBannerDuration(index, parseInt(e.target.value) || 5)}
                        className="w-24 border-gray-300 rounded-md shadow-sm p-1 border text-gray-900 bg-white"
                      />
                    </div>
                    
                    <button 
                      type="button" 
                      onClick={() => removeBanner(index)}
                      className="text-red-500 hover:text-red-700 px-3 py-1 bg-red-50 hover:bg-red-100 rounded text-sm transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <input 
                type="file" 
                multiple
                accept="image/*,video/mp4"
                onChange={handleBannerUpload}
                disabled={uploading === "hero_banners"}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-red-50 file:text-meewa-red
                  hover:file:bg-red-100"
              />
              <div className="mt-2"><MediaPickerButton multiple accept="all" onSelect={addBannersFromLibrary} disabled={uploading === "hero_banners"} /></div>
              <p className="text-xs text-gray-500 mt-1">Min: 1920x1080 px (Landscape), Max: 3840x2160 px</p>
              {uploading === "hero_banners" && <p className="text-sm text-meewa-red mt-2">Uploading banners...</p>}
            </div>
          </div>

          {/* Featured Products Selection */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Featured Products</h2>
            <p className="text-sm text-gray-500">Select which products to display on the landing page and arrange their order. If none are selected, the first 5 active products will be shown automatically.</p>
            
            <div className="flex gap-4">
              <select 
                id="product-select"
                className="flex-1 border-gray-300 rounded-md shadow-sm p-2 border text-gray-900 bg-white"
                defaultValue=""
              >
                <option value="" disabled>Select a product to feature...</option>
                {products.filter(p => !settings.landing_featured_products.includes(p.id)).map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <button 
                type="button" 
                onClick={() => {
                  const select = document.getElementById('product-select') as HTMLSelectElement;
                  if (select && select.value) {
                    addFeaturedProduct(parseInt(select.value));
                    select.value = "";
                  }
                }}
                className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                Add
              </button>
            </div>

            <div className="space-y-2 mt-4">
              {settings.landing_featured_products.length === 0 && (
                <p className="text-sm text-gray-400 italic">No products manually featured. Displaying default recent products.</p>
              )}
              {settings.landing_featured_products.map((productId, idx) => {
                const prod = products.find(p => p.id === productId);
                return (
                  <div key={`${productId}-${idx}`} className="flex justify-between items-center bg-gray-50 border p-3 rounded-lg shadow-sm">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-gray-400">{idx + 1}.</span>
                      {prod?.cover_image && <img src={prod.cover_image.startsWith('http') ? prod.cover_image : `${process.env.NEXT_PUBLIC_API_URL}${prod.cover_image}`} alt="" className="w-10 h-10 object-cover rounded" />}
                      <span className="font-medium text-gray-800">{prod ? prod.name : `Unknown Product (ID: ${productId})`}</span>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => moveFeaturedProduct(idx, 'up')} disabled={idx === 0} className="p-1 text-gray-500 hover:text-gray-900 disabled:opacity-30">▲</button>
                      <button type="button" onClick={() => moveFeaturedProduct(idx, 'down')} disabled={idx === settings.landing_featured_products.length - 1} className="p-1 text-gray-500 hover:text-gray-900 disabled:opacity-30">▼</button>
                      <button type="button" onClick={() => removeFeaturedProduct(idx)} className="p-1 text-red-500 hover:text-red-700 font-bold ml-2">✕</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Industries We Serve */}
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-xl font-semibold text-gray-800">Industries We Serve</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 text-gray-900">Title</label>
                <input 
                  type="text" 
                  name="industries_title"
                  value={settings.industries_title}
                  onChange={handleChange}
                  placeholder="e.g. Food Packaging Solutions for Every Industry"
                  className="w-full border-gray-300 rounded-md shadow-sm p-2 border text-gray-900 bg-white placeholder-gray-400 focus:border-meewa-red focus:ring-meewa-red" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 text-gray-900">Subtitle</label>
                <input 
                  type="text" 
                  name="industries_subtitle"
                  value={settings.industries_subtitle}
                  onChange={handleChange}
                  placeholder="Industries We Serve"
                  className="w-full border-gray-300 rounded-md shadow-sm p-2 border text-gray-900 bg-white placeholder-gray-400 focus:border-meewa-red focus:ring-meewa-red" 
                />
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700 text-gray-900">Industry List</label>
                <button type="button" onClick={addIndustry} className="text-xs bg-meewa-red text-white px-2 py-1 rounded hover:bg-red-700">+ Add Industry</button>
              </div>
              <div className="space-y-2">
                {industries.map((ind, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input 
                      type="text" 
                      value={ind}
                      onChange={(e) => updateIndustry(idx, e.target.value)}
                      className="flex-1 border-gray-300 rounded-md shadow-sm p-2 border text-gray-900 bg-white placeholder-gray-400 focus:border-meewa-red text-sm" 
                    />
                    <button type="button" onClick={() => removeIndustry(idx)} className="text-red-500 hover:text-red-700 font-bold px-2">✕</button>
                  </div>
                ))}
              </div>
            </div>


            <div className="mt-6 border-t pt-4">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Industry Images (Collage)</h3>
              <p className="text-sm text-gray-500 mb-4">Upload images in the same masonry layout as they appear on the homepage.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl bg-gray-50 p-6 rounded-xl border border-gray-200">
                {/* Col 1 */}
                <div className="flex flex-col gap-4">
                  {[1, 2].map((num) => {
                    const key = `industries_image_${num}` as keyof typeof settings;
                    const labelMap = { 1: "Cafe/Restaurant", 2: "Wholesale/Warehouse" } as any;
                    return (
                      <div key={num} className="border border-gray-300 p-4 rounded-lg bg-white shadow-sm flex flex-col">
                        <label className="block text-sm font-medium text-gray-700 mb-3">{labelMap[num]}</label>
                        <div className="mb-4 bg-gray-100 rounded-md border border-dashed flex items-center justify-center overflow-hidden aspect-square relative">
                          {settings[key] ? (
                            <img src={(settings[key] as string)?.startsWith("http") ? (settings[key] as string) : `${process.env.NEXT_PUBLIC_API_URL}${settings[key]}`} alt={`${labelMap[num]} Preview`} className="w-full h-full object-cover absolute inset-0" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                          ) : (
                            <span className="text-gray-400 text-xs">No image</span>
                          )}
                        </div>
                        <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, key)} disabled={uploading === key} className="block w-full text-[10px] text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-red-50 file:text-meewa-red cursor-pointer" />
                        <div className="mt-2"><MediaPickerButton onSelect={(urls) => applyFieldUrl(key, urls[0])} /></div>
                        <p className="text-[10px] text-gray-500 mt-1">Min: 800x600 px, Max: 1920x1080 px</p>
                        {uploading === key && <p className="text-[10px] text-meewa-red mt-2">Uploading...</p>}
                      </div>
                    );
                  })}
                </div>

                {/* Col 2 */}
                <div className="flex flex-col">
                  <div className="border border-gray-300 p-4 rounded-lg bg-white shadow-sm flex flex-col h-full">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Hotel (Tall)</label>
                    <div className="mb-4 bg-gray-100 rounded-md border border-dashed flex items-center justify-center overflow-hidden flex-grow relative min-h-[200px]">
                      {settings.industries_image_3 ? (
                        <img src={(settings.industries_image_3 as string)?.startsWith("http") ? (settings.industries_image_3 as string) : `${process.env.NEXT_PUBLIC_API_URL}${settings.industries_image_3}`} alt="Hotel Preview" className="w-full h-full object-cover absolute inset-0" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                      ) : (
                        <span className="text-gray-400 text-xs">No image</span>
                      )}
                    </div>
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, "industries_image_3")} disabled={uploading === "industries_image_3"} className="block w-full text-[10px] text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-red-50 file:text-meewa-red cursor-pointer" />
                    <div className="mt-2"><MediaPickerButton onSelect={(urls) => applyFieldUrl("industries_image_3", urls[0])} /></div>
                    <p className="text-[10px] text-gray-500 mt-1">Min: 800x600 px, Max: 1920x1080 px</p>
                    {uploading === "industries_image_3" && <p className="text-[10px] text-meewa-red mt-2">Uploading...</p>}
                  </div>
                </div>

                {/* Col 3 */}
                <div className="flex flex-col gap-4">
                  {[4, 5].map((num) => {
                    const key = `industries_image_${num}` as keyof typeof settings;
                    const labelMap = { 4: "Supermarket", 5: "Coffee Chain / Bags" } as any;
                    const aspectMap = { 4: "aspect-[4/3]", 5: "flex-grow min-h-[150px]" } as any;
                    return (
                      <div key={num} className={`border border-gray-300 p-4 rounded-lg bg-white shadow-sm flex flex-col ${num === 5 ? 'flex-grow' : ''}`}>
                        <label className="block text-sm font-medium text-gray-700 mb-3">{labelMap[num]}</label>
                        <div className={`mb-4 bg-gray-100 rounded-md border border-dashed flex items-center justify-center overflow-hidden relative ${aspectMap[num]}`}>
                          {settings[key] ? (
                            <img src={(settings[key] as string)?.startsWith("http") ? (settings[key] as string) : `${process.env.NEXT_PUBLIC_API_URL}${settings[key]}`} alt={`${labelMap[num]} Preview`} className="w-full h-full object-cover absolute inset-0" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                          ) : (
                            <span className="text-gray-400 text-xs">No image</span>
                          )}
                        </div>
                        <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, key)} disabled={uploading === key} className="block w-full text-[10px] text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-red-50 file:text-meewa-red cursor-pointer" />
                        <div className="mt-2"><MediaPickerButton onSelect={(urls) => applyFieldUrl(key, urls[0])} /></div>
                        <p className="text-[10px] text-gray-500 mt-1">Min: 800x600 px, Max: 1920x1080 px</p>
                        {uploading === key && <p className="text-[10px] text-meewa-red mt-2">Uploading...</p>}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Export Process */}
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-xl font-semibold text-gray-800">Export Process</h2>
              <button type="button" onClick={addExportStep} className="text-sm bg-meewa-red text-white px-3 py-1 rounded hover:bg-red-700">+ Add Step</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 text-gray-900">Title</label>
                <input 
                  type="text" 
                  name="export_title"
                  value={settings.export_title}
                  onChange={handleChange}
                  placeholder="Export Process"
                  className="w-full border-gray-300 rounded-md shadow-sm p-2 border text-gray-900 bg-white placeholder-gray-400 focus:border-meewa-red focus:ring-meewa-red" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 text-gray-900">Subtitle</label>
                <input 
                  type="text" 
                  name="export_subtitle"
                  value={settings.export_subtitle}
                  onChange={handleChange}
                  placeholder="We make international sourcing easy with a transparent export process."
                  className="w-full border-gray-300 rounded-md shadow-sm p-2 border text-gray-900 bg-white placeholder-gray-400 focus:border-meewa-red focus:ring-meewa-red" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-gray-900">Export Process Media (Image or Video)</label>
              <p className="text-xs text-gray-500 mb-3">Upload an image or MP4 video for the right side of the Export Process block.</p>
              {settings.export_process_media_url && (
                <div className="mb-4">
                  {settings.export_process_media_url.endsWith('.mp4') ? (
                    <video src={(settings.export_process_media_url)?.startsWith("http") ? (settings.export_process_media_url) : `${process.env.NEXT_PUBLIC_API_URL}${settings.export_process_media_url}`} autoPlay loop muted playsInline className="h-40 rounded border object-cover" />
                  ) : (
                    <img src={(settings.export_process_media_url)?.startsWith("http") ? (settings.export_process_media_url) : `${process.env.NEXT_PUBLIC_API_URL}${settings.export_process_media_url}`} alt="Export Process Media Preview" className="h-40 rounded border object-cover" onError={(e) => { e.currentTarget.src = settings.export_process_media_url }} />
                  )}
                </div>
              )}
              <input 
                type="file" 
                accept="image/*,video/mp4"
                onChange={(e) => handleFileUpload(e, "export_process_media_url")}
                disabled={uploading === "export_process_media_url"}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-red-50 file:text-meewa-red
                  hover:file:bg-red-100"
              />
              <div className="mt-2"><MediaPickerButton accept="all" onSelect={(urls) => applyFieldUrl("export_process_media_url", urls[0])} /></div>
              <p className="text-xs text-gray-500 mt-1">Min: 800x600 px, Max: 1920x1080 px</p>
              {uploading === "export_process_media_url" && <p className="text-sm text-meewa-red mt-2">Uploading...</p>}
            </div>

            <div className="space-y-4">
              {exportSteps.map((step, idx) => (
                <div key={idx} className="p-4 border rounded-lg bg-gray-50 relative">
                  <button type="button" onClick={() => removeExportStep(idx)} className="absolute top-4 right-4 text-red-500 hover:text-red-700 text-sm font-bold">✕ Remove</button>
                  <div className="grid grid-cols-1 gap-4 mr-16">
                    <div className="flex gap-4">
                      <div className="w-1/4">
                        <label className="block text-xs font-medium text-gray-700 mb-1 text-gray-900">Number</label>
                        <input 
                          type="text" 
                          value={step.num}
                          onChange={(e) => updateExportStep(idx, 'num', e.target.value)}
                          placeholder="e.g. 01"
                          className="w-full border-gray-300 rounded-md shadow-sm p-2 border text-gray-900 bg-white placeholder-gray-400 focus:border-meewa-red text-sm" 
                        />
                      </div>
                      <div className="w-3/4">
                        <label className="block text-xs font-medium text-gray-700 mb-1 text-gray-900">Step Title</label>
                        <input 
                          type="text" 
                          value={step.title}
                          onChange={(e) => updateExportStep(idx, 'title', e.target.value)}
                          placeholder="e.g. Inquiry"
                          className="w-full border-gray-300 rounded-md shadow-sm p-2 border text-gray-900 bg-white placeholder-gray-400 focus:border-meewa-red text-sm" 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1 text-gray-900">Description</label>
                      <input 
                        type="text" 
                        value={step.desc}
                        onChange={(e) => updateExportStep(idx, 'desc', e.target.value)}
                        className="w-full border-gray-300 rounded-md shadow-sm p-2 border text-gray-900 bg-white placeholder-gray-400 focus:border-meewa-red text-sm" 
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Why Choose Us Section */}
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-xl font-semibold text-gray-800">Why Choose Us (Features)</h2>
              <button type="button" onClick={addFeature} className="text-sm bg-meewa-red text-white px-3 py-1 rounded hover:bg-red-700">+ Add Feature</button>
            </div>
            
            {features.length === 0 && <p className="text-gray-500 text-sm">No features added yet.</p>}
            
            <div className="space-y-4">
              {features.map((feature, idx) => (
                <div key={idx} className="p-4 border rounded-lg bg-gray-50 relative">
                  <button type="button" onClick={() => removeFeature(idx)} className="absolute top-4 right-4 text-red-500 hover:text-red-700 text-sm font-bold">✕ Remove</button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mr-16">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1 text-gray-900">Feature Title</label>
                      <input 
                        type="text" 
                        value={feature.title}
                        onChange={(e) => updateFeature(idx, 'title', e.target.value)}
                        className="w-full border-gray-300 rounded-md shadow-sm p-2 border text-gray-900 bg-white placeholder-gray-400 focus:border-meewa-red text-sm" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1 text-gray-900">Icon Upload</label>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 flex items-center justify-center bg-meewa-red rounded-xl shadow-sm flex-shrink-0">
                          {feature.icon ? (
                            <img src={feature.icon.startsWith('/') ? `${process.env.NEXT_PUBLIC_API_URL}${feature.icon}` : feature.icon} className="w-6 h-6 object-contain" alt="Icon" />
                          ) : (
                            <span className="text-white text-[10px] text-center leading-tight">No Icon</span>
                          )}
                        </div>
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => handleFeatureIconUpload(idx, e)}
                          className="text-xs"
                        />
                        <MediaPickerButton label="Library" onSelect={(urls) => applyFeatureIcon(idx, urls[0])} />
                        <p className="text-[10px] text-gray-500 mt-1">Min: 100x100 px</p>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1 text-gray-900">Description</label>
                      <textarea 
                        value={feature.description}
                        onChange={(e) => updateFeature(idx, 'description', e.target.value)}
                        rows={2}
                        className="w-full border-gray-300 rounded-md shadow-sm p-2 border text-gray-900 bg-white placeholder-gray-400 focus:border-meewa-red text-sm"
                      ></textarea>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* About Company Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">About Company Section</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-gray-900">About Title</label>
              <input 
                type="text" 
                name="about_title"
                value={settings.about_title}
                onChange={handleChange}
                placeholder="About Company"
                className="w-full border-gray-300 rounded-md shadow-sm p-2 border text-gray-900 bg-white placeholder-gray-400 focus:border-meewa-red focus:ring-meewa-red" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-gray-900">About Subtitle</label>
              <textarea 
                name="about_subtitle"
                value={settings.about_subtitle}
                onChange={handleChange}
                rows={2}
                placeholder="Your Trusted Disposable Food Packaging Export Partner"
                className="w-full border-gray-300 rounded-md shadow-sm p-2 border text-gray-900 bg-white placeholder-gray-400 focus:border-meewa-red focus:ring-meewa-red"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-gray-900">Center Text Overlay</label>
              <input 
                type="text" 
                name="about_center_text"
                value={settings.about_center_text}
                onChange={handleChange}
                placeholder="GLOBAL SUPPLY CHAIN NETWORK"
                className="w-full border-gray-300 rounded-md shadow-sm p-2 border text-gray-900 bg-white placeholder-gray-400 focus:border-meewa-red focus:ring-meewa-red" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-gray-900">Media (Background Video/Image)</label>
              {settings.about_media_url && (
                <div className="mb-4">
                  {settings.about_media_url.endsWith('.mp4') ? (
                    <video src={(settings.about_media_url)?.startsWith("http") ? (settings.about_media_url) : `${process.env.NEXT_PUBLIC_API_URL}${settings.about_media_url}`} autoPlay loop muted playsInline className="h-40 rounded border object-cover" />
                  ) : (
                    <img src={(settings.about_media_url)?.startsWith("http") ? (settings.about_media_url) : `${process.env.NEXT_PUBLIC_API_URL}${settings.about_media_url}`} alt="About Media Preview" className="h-40 rounded border object-cover" onError={(e) => { e.currentTarget.src = settings.about_media_url }} />
                  )}
                </div>
              )}
              <input 
                type="file" 
                accept="image/*,video/mp4"
                onChange={(e) => handleFileUpload(e, "about_media_url")}
                disabled={uploading === "about_media_url"}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-red-50 file:text-meewa-red
                  hover:file:bg-red-100"
              />
              <div className="mt-2"><MediaPickerButton accept="all" onSelect={(urls) => applyFieldUrl("about_media_url", urls[0])} /></div>
              <p className="text-xs text-gray-500 mt-1">Min: 1920x1080 px, Max: 3840x2160 px</p>
              {uploading === "about_media_url" && <p className="text-sm text-meewa-red mt-2">Uploading...</p>}
            </div>
          </div>


          {/* FAQs Section */}
          <FaqPlacementEditor location="landing" title="FAQs" />

          {/* Reliable Packaging Partner Promo Card */}
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-2">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Reliable Packaging Partner Card</h2>
                <p className="text-xs text-gray-500 mt-0.5">The call-to-action banner shown below FAQs on landing and product pages.</p>
              </div>
              <ToggleOption 
                label="Show Promo Card" 
                description="" 
                checked={settings.hide_reliable_partner !== "true"} 
                onChange={() => handleToggle('hide_reliable_partner')} 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1 text-gray-900">Card Title</label>
                <input 
                  type="text" 
                  name="reliable_partner_title"
                  value={settings.reliable_partner_title}
                  onChange={handleChange}
                  placeholder="Looking for a Reliable Packaging Partner?"
                  className="w-full border-gray-300 rounded-md shadow-sm p-2 border text-gray-900 bg-white placeholder-gray-400 focus:border-meewa-red focus:ring-meewa-red" 
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1 text-gray-900">Card Subtitle / Description</label>
                <textarea 
                  name="reliable_partner_subtitle"
                  value={settings.reliable_partner_subtitle}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Whether you're sourcing standard products or custom packaging, our team is ready to help."
                  className="w-full border-gray-300 rounded-md shadow-sm p-2 border text-gray-900 bg-white placeholder-gray-400 focus:border-meewa-red focus:ring-meewa-red"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 text-gray-900">Button Text</label>
                <input 
                  type="text" 
                  name="reliable_partner_btn_text"
                  value={settings.reliable_partner_btn_text}
                  onChange={handleChange}
                  placeholder="Request Quote"
                  className="w-full border-gray-300 rounded-md shadow-sm p-2 border text-gray-900 bg-white placeholder-gray-400 focus:border-meewa-red focus:ring-meewa-red" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 text-gray-900">Button Link URL</label>
                <input 
                  type="text" 
                  name="reliable_partner_btn_link"
                  value={settings.reliable_partner_btn_link}
                  onChange={handleChange}
                  placeholder="/contact"
                  className="w-full border-gray-300 rounded-md shadow-sm p-2 border text-gray-900 bg-white placeholder-gray-400 focus:border-meewa-red focus:ring-meewa-red" 
                />
              </div>
            </div>
          </div>

          {/* Contact & Support Section (Get In Touch Box) */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Get In Touch Box Settings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1 text-gray-900">Box Heading / Title</label>
                <input 
                  type="text" 
                  name="get_in_touch_title"
                  value={settings.get_in_touch_title}
                  onChange={handleChange}
                  placeholder="Get In Touch"
                  className="w-full border-gray-300 rounded-md shadow-sm p-2 border text-gray-900 bg-white placeholder-gray-400 focus:border-meewa-red focus:ring-meewa-red" 
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1 text-gray-900">Box Subtitle / Description</label>
                <textarea 
                  name="get_in_touch_subtitle"
                  value={settings.get_in_touch_subtitle}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Get product details, pricing, samples, and export support. We'll respond within 24 hours."
                  className="w-full border-gray-300 rounded-md shadow-sm p-2 border text-gray-900 bg-white placeholder-gray-400 focus:border-meewa-red focus:ring-meewa-red"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 text-gray-900">Contact Phone (Call Us)</label>
                <input 
                  type="text" 
                  name="contact_phone"
                  value={settings.contact_phone}
                  onChange={handleChange}
                  placeholder="e.g. +91 99786 44533"
                  className="w-full border-gray-300 rounded-md shadow-sm p-2 border text-gray-900 bg-white placeholder-gray-400 focus:border-meewa-red focus:ring-meewa-red" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 text-gray-900">Contact Email (Email Us)</label>
                <input 
                  type="email" 
                  name="contact_email"
                  value={settings.contact_email}
                  onChange={handleChange}
                  placeholder="e.g. sales@meewaindustries.com"
                  className="w-full border-gray-300 rounded-md shadow-sm p-2 border text-gray-900 bg-white placeholder-gray-400 focus:border-meewa-red focus:ring-meewa-red" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 text-gray-900">Website</label>
                <input 
                  type="text" 
                  name="contact_website"
                  value={settings.contact_website}
                  onChange={handleChange}
                  placeholder="e.g. www.meewaindustries.com"
                  className="w-full border-gray-300 rounded-md shadow-sm p-2 border text-gray-900 bg-white placeholder-gray-400 focus:border-meewa-red focus:ring-meewa-red" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 text-gray-900">WhatsApp Number</label>
                <input 
                  type="text" 
                  name="contact_whatsapp"
                  value={settings.contact_whatsapp}
                  onChange={handleChange}
                  placeholder="e.g. +91 99786 44533"
                  className="w-full border-gray-300 rounded-md shadow-sm p-2 border text-gray-900 bg-white placeholder-gray-400 focus:border-meewa-red focus:ring-meewa-red" 
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1 text-gray-900">Office Address</label>
                <textarea 
                  name="contact_address"
                  value={settings.contact_address}
                  onChange={handleChange}
                  rows={2}
                  placeholder="e.g. LG-04, Hiral Arcade, opp. New Court Building, Meghdoot Society, Athwalines, Athwa, Surat, Gujarat 395007"
                  className="w-full border-gray-300 rounded-md shadow-sm p-2 border text-gray-900 bg-white placeholder-gray-400 focus:border-meewa-red focus:ring-meewa-red"
                ></textarea>
              </div>

              <div className="md:col-span-2 pt-2 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">Connect With Us (Social Links)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">LinkedIn URL</label>
                    <input 
                      type="text" 
                      name="social_linkedin"
                      value={settings.social_linkedin}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/company/meewa"
                      className="w-full border-gray-300 rounded-md shadow-sm p-2 border text-sm text-gray-900 bg-white placeholder-gray-400 focus:border-meewa-red focus:ring-meewa-red" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Facebook URL</label>
                    <input 
                      type="text" 
                      name="social_facebook"
                      value={settings.social_facebook}
                      onChange={handleChange}
                      placeholder="https://facebook.com/meewa"
                      className="w-full border-gray-300 rounded-md shadow-sm p-2 border text-sm text-gray-900 bg-white placeholder-gray-400 focus:border-meewa-red focus:ring-meewa-red" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Instagram URL</label>
                    <input 
                      type="text" 
                      name="social_instagram"
                      value={settings.social_instagram}
                      onChange={handleChange}
                      placeholder="https://instagram.com/meewa"
                      className="w-full border-gray-300 rounded-md shadow-sm p-2 border text-sm text-gray-900 bg-white placeholder-gray-400 focus:border-meewa-red focus:ring-meewa-red" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">YouTube URL</label>
                    <input 
                      type="text" 
                      name="social_youtube"
                      value={settings.social_youtube}
                      onChange={handleChange}
                      placeholder="https://youtube.com/@meewa"
                      className="w-full border-gray-300 rounded-md shadow-sm p-2 border text-sm text-gray-900 bg-white placeholder-gray-400 focus:border-meewa-red focus:ring-meewa-red" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t">
          <button type="submit" className="bg-meewa-red text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition-colors">
            Save Landing Page Settings
          </button>
        </div>
      </form>
    </div>
  );
}

function ToggleOption({ label, description, checked, onChange }: { label: string, description: string, checked: boolean, onChange: () => void }) {
  return (
    <div className="flex items-start justify-between p-4 border rounded-lg bg-gray-50">
      <div className="pr-4">
        <h3 className="font-medium text-gray-900">{label}</h3>
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 mt-1">
        <input type="checkbox" className="sr-only peer" checked={checked} onChange={onChange} />
        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-meewa-red"></div>
      </label>
    </div>
  );
}
