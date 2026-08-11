"use client";

import { useState, useEffect } from 'react';

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
    contact_phone: "",
    contact_email: "",
    contact_address: "",
    contact_whatsapp: "",
    industries_title: "",
    industries_subtitle: "",
    export_title: "",
    export_subtitle: "",
    export_process_media_url: "",
    landing_featured_products: [] as number[],
  });
  
  const [products, setProducts] = useState<any[]>([]);
  
  const [faqs, setFaqs] = useState<{question: string, answer: string}[]>([]);
  const [features, setFeatures] = useState<{title: string, description: string, icon: string}[]>([]);
  const [industries, setIndustries] = useState<string[]>([]);
  const [exportSteps, setExportSteps] = useState<{num: string, title: string, desc: string}[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);

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
          contact_phone: data.contact_phone || "",
          contact_email: data.contact_email || "",
          contact_address: data.contact_address || "",
          contact_whatsapp: data.contact_whatsapp || "",
          industries_title: data.industries_title || "",
          industries_subtitle: data.industries_subtitle || "",
          export_title: data.export_title || "",
          export_subtitle: data.export_subtitle || "",
          export_process_media_url: data.export_process_media_url || "",
          landing_featured_products: data.landing_featured_products || [],
        });

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

        const defaultFaqs = [
          { question: "What products do you manufacture?", answer: "Detailed answer for \"What products do you manufacture?\" will be added here. Our team is always ready to provide comprehensive support for your specific needs." },
          { question: "Do you offer custom printing?", answer: "Yes, we offer custom printing on many of our packaging products to help your brand stand out." },
          { question: "What is your minimum order quantity?", answer: "Our minimum order quantity varies by product. Please contact our sales team for detailed information." },
          { question: "Which countries do you export to?", answer: "We export globally to many countries across North America, Europe, Asia, and the Middle East." },
          { question: "Can I request product samples?", answer: "Yes, product samples are available upon request to ensure quality meets your standards before bulk ordering." }
        ];

        setFaqs(data.landing_faqs?.length > 0 ? data.landing_faqs : defaultFaqs);
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
        // Auto-save the image to the DB immediately
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
        const newFeatures = [...features];
        newFeatures[index].icon = data.url;
        setFeatures(newFeatures);
        
        // Auto-save features array
        await fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/settings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: 'landing_features', value: newFeatures })
        });
      } else {
        alert("Upload failed: " + JSON.stringify(data));
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading file");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const bulkData = [
        ...Object.entries(settings).map(([key, value]) => ({ key, value })),
        { key: "landing_faqs", value: faqs },
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

  // FAQ Handlers
  const addFaq = () => setFaqs([...faqs, { question: "", answer: "" }]);
  const removeFaq = (index: number) => setFaqs(faqs.filter((_, i) => i !== index));
  const updateFaq = (index: number, field: 'question' | 'answer', value: string) => {
    const newFaqs = [...faqs];
    newFaqs[index][field] = value;
    setFaqs(newFaqs);
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
      
      <form onSubmit={handleSave} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <p className="text-gray-600 mb-8">
          Manage the content displayed on the public-facing landing page. Configure banners, company details, features, FAQs, and contact information below.
        </p>

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
              <label className="block text-sm font-medium text-gray-700 mb-1">Hero Banner Image/Video</label>
              {settings.hero_image_url && (
                <div className="mb-4">
                  {settings.hero_image_url.endsWith('.mp4') ? (
                    <video src={(settings.hero_image_url)?.startsWith("http") ? (settings.hero_image_url) : `${process.env.NEXT_PUBLIC_API_URL}${settings.hero_image_url}`} autoPlay loop muted playsInline className="h-40 rounded border object-cover" />
                  ) : (
                    <img src={(settings.hero_image_url)?.startsWith("http") ? (settings.hero_image_url) : `${process.env.NEXT_PUBLIC_API_URL}${settings.hero_image_url}`} alt="Hero Banner Preview" className="h-40 rounded border object-cover" onError={(e) => { e.currentTarget.src = settings.hero_image_url }} />
                  )}
                </div>
              )}
              <input 
                type="file" 
                accept="image/*,video/mp4"
                onChange={(e) => handleFileUpload(e, "hero_image_url")}
                disabled={uploading === "hero_image_url"}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-red-50 file:text-meewa-red
                  hover:file:bg-red-100"
              />
              {uploading === "hero_image_url" && <p className="text-sm text-meewa-red mt-2">Uploading...</p>}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((num) => {
                  const key = `industries_image_${num}` as keyof typeof settings;
                  const labelMap = { 1: "Restaurant Image", 2: "Supermarket Image", 3: "Hotel Image", 4: "Coffee Chain Image" } as any;
                  return (
                    <div key={num} className="border p-4 rounded-lg bg-gray-50">
                      <label className="block text-sm font-medium text-gray-700 mb-2">{labelMap[num]}</label>
                      {settings[key] && (
                        <div className="mb-2 flex items-center justify-center">
                          <img src={(settings[key] as string)?.startsWith("http") ? (settings[key] as string) : `${process.env.NEXT_PUBLIC_API_URL}${settings[key]}`} alt={`Industry ${num} Preview`} className="h-24 rounded border object-contain bg-white w-full" onError={(e) => { e.currentTarget.src = settings[key] as string }} />
                        </div>
                      )}
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, key)}
                        disabled={uploading === key}
                        className="block w-full text-xs text-gray-500
                          file:mr-4 file:py-1 file:px-2
                          file:rounded-md file:border-0
                          file:bg-red-50 file:text-meewa-red"
                      />
                      {uploading === key && <p className="text-xs text-meewa-red mt-1">Uploading...</p>}
                    </div>
                  );
                })}
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
              {uploading === "about_media_url" && <p className="text-sm text-meewa-red mt-2">Uploading...</p>}
            </div>
          </div>


          {/* FAQs Section */}
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-xl font-semibold text-gray-800">FAQs</h2>
              <button type="button" onClick={addFaq} className="text-sm bg-meewa-red text-white px-3 py-1 rounded hover:bg-red-700">+ Add FAQ</button>
            </div>
            
            {faqs.length === 0 && <p className="text-gray-500 text-sm">No FAQs added yet.</p>}
            
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="p-4 border rounded-lg bg-gray-50 relative">
                  <button type="button" onClick={() => removeFaq(idx)} className="absolute top-4 right-4 text-red-500 hover:text-red-700 text-sm font-bold">✕ Remove</button>
                  <div className="grid grid-cols-1 gap-4 mr-16">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1 text-gray-900">Question</label>
                      <input 
                        type="text" 
                        value={faq.question}
                        onChange={(e) => updateFaq(idx, 'question', e.target.value)}
                        className="w-full border-gray-300 rounded-md shadow-sm p-2 border text-gray-900 bg-white placeholder-gray-400 focus:border-meewa-red text-sm" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1 text-gray-900">Answer</label>
                      <textarea 
                        value={faq.answer}
                        onChange={(e) => updateFaq(idx, 'answer', e.target.value)}
                        rows={2}
                        className="w-full border-gray-300 rounded-md shadow-sm p-2 border text-gray-900 bg-white placeholder-gray-400 focus:border-meewa-red text-sm"
                      ></textarea>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact & Support Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Contact & Support Section</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 text-gray-900">Contact Phone</label>
                <input 
                  type="text" 
                  name="contact_phone"
                  value={settings.contact_phone}
                  onChange={handleChange}
                  placeholder="e.g. +91-98765-43210"
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
                  placeholder="e.g. +91-98765-43210"
                  className="w-full border-gray-300 rounded-md shadow-sm p-2 border text-gray-900 bg-white placeholder-gray-400 focus:border-meewa-red focus:ring-meewa-red" 
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1 text-gray-900">Contact Email</label>
                <input 
                  type="email" 
                  name="contact_email"
                  value={settings.contact_email}
                  onChange={handleChange}
                  placeholder="e.g. info@meewaindustries.com"
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
                  placeholder="e.g. 123 Industry Hub, Gujarat, India"
                  className="w-full border-gray-300 rounded-md shadow-sm p-2 border text-gray-900 bg-white placeholder-gray-400 focus:border-meewa-red focus:ring-meewa-red"
                ></textarea>
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
