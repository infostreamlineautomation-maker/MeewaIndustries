"use client";

import { useState, useEffect } from 'react';

export default function AboutPageManagement() {
  const [settings, setSettings] = useState({
    about_hero_title: "",
    about_hero_subtitle: "",
    about_hero_media: "",
    about_vision_title: "",
    about_vision_subtitle: "",
    about_vision_desc: "",
    about_mission_title: "",
    about_mission_subtitle: "",
    about_mission_desc: "",
    about_how_we_work_title: "",
    about_how_we_work_desc: "",
    about_how_we_work_media: "",
    about_vision_icon: "",
    about_mission_icon: "",
  });
  
  const [stats, setStats] = useState<{title: string, subtitle: string}[]>([]);
  const [clients, setClients] = useState<{logo_url: string}[]>([]);
  const [howWeWorkList, setHowWeWorkList] = useState<{title: string, subtitle: string}[]>([]);
  const [features, setFeatures] = useState<{title: string, description: string, icon: string}[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/settings`)
      .then(res => res.json())
      .then(data => {
        setSettings({
          about_hero_title: data.about_hero_title || "Stories built to feel precise, cinematic, and commercially sharp.",
          about_hero_subtitle: data.about_hero_subtitle || "Leading exporter of high-quality packaging materials for businesses worldwide.",
          about_hero_media: data.about_hero_media || "",
          about_vision_title: data.about_vision_title || "Our Vision",
          about_vision_subtitle: data.about_vision_subtitle || "See beyond the brief",
          about_vision_desc: data.about_vision_desc || "To become a global leader in sustainable packaging solutions through innovation, quality, and customer-focused manufacturing.\n\nWe aim to empower businesses worldwide with eco-friendly, high-performance packaging materials that drive growth and environmental responsibility.",
          about_vision_icon: data.about_vision_icon || "",
          about_mission_title: data.about_mission_title || "Our Mission",
          about_mission_subtitle: data.about_mission_subtitle || "Deliver with precision",
          about_mission_desc: data.about_mission_desc || "To deliver high-quality packaging materials and custom manufacturing solutions that help businesses grow.\n\nWe are committed to innovation, ethical practices, sustainable packaging, and exceptional customer satisfaction to build long-term partnerships worldwide.",
          about_mission_icon: data.about_mission_icon || "",
          about_how_we_work_title: data.about_how_we_work_title || "Production-minded design for every brand touch point.",
          about_how_we_work_desc: data.about_how_we_work_desc || "We combine brand strategy, AI assisted production, web experiences and high quality print solutions so every campaign feels considered from first idea to final delivery.",
          about_how_we_work_media: data.about_how_we_work_media || "",
        });

        const defaultStats = [
          { title: "360", subtitle: "Brand, print and digital thinking" },
          { title: "Fast", subtitle: "Production-ready execution" },
          { title: "Premium", subtitle: "Brand, print and digital thinking" }
        ];

        const defaultHowWeWork = [
          { title: "Brand Strategy", subtitle: "Discover" },
          { title: "AI Production", subtitle: "Develop" },
          { title: "Print & Packaging", subtitle: "Deliver" },
          { title: "Web Experience", subtitle: "Deploy" }
        ];

        const defaultFeatures = [
          { title: "Premium Print", description: "Luxury business cards, brochures and marketing collaterals finished with crisp detail.", icon: "" },
          { title: "Creative Branding", description: "Packaging, mockups and campaign visuals designed to feel polished, modern and memorable.", icon: "" },
          { title: "Large Format", description: "Signage, retail panels and exhibition graphics produced to stand out at every scale.", icon: "" },
          { title: "Packaging Care", description: "Premium materials, consistent color output and dependable delivery for every production run.", icon: "" }
        ];

        setStats(data.about_stats?.length > 0 ? data.about_stats : defaultStats);
        setClients(data.about_clients || []);
        setHowWeWorkList(data.about_how_we_work_list?.length > 0 ? data.about_how_we_work_list : defaultHowWeWork);
        setFeatures(data.about_features?.length > 0 ? data.about_features : defaultFeatures);
        
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

  const handleClientLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);
    
    setUploading('clients');
    
    try {
      const newClients = [...clients];
      
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/settings/upload`, {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        
        if (res.ok && data.url) {
          newClients.push({ logo_url: data.url });
        }
      }
      
      setClients(newClients);
      
      await fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'about_clients', value: newClients })
      });
      
    } catch (err) {
      console.error(err);
      alert("Error uploading files");
    } finally {
      setUploading(null);
    }
  };
  
  const removeClientLogo = async (index: number) => {
    const newClients = clients.filter((_, i) => i !== index);
    setClients(newClients);
    await fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'about_clients', value: newClients })
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const bulkData = [
        ...Object.entries(settings).map(([key, value]) => ({ key, value })),
        { key: "about_stats", value: stats },
        { key: "about_clients", value: clients },
        { key: "about_how_we_work_list", value: howWeWorkList },
        { key: "about_features", value: features }
      ];
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/settings/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bulkData)
      });
      
      if (res.ok) {
        alert('About page settings saved successfully!');
      } else {
        alert('Error saving settings.');
      }
    } catch (err) {
      alert('Error saving settings.');
    }
  };

  // Stats Handlers
  const addStat = () => setStats([...stats, { title: "", subtitle: "" }]);
  const removeStat = (index: number) => setStats(stats.filter((_, i) => i !== index));
  const updateStat = (index: number, field: 'title' | 'subtitle', value: string) => {
    const newStats = [...stats];
    newStats[index][field] = value;
    setStats(newStats);
  };
  
  // How We Work Handlers
  const addHowWeWork = () => setHowWeWorkList([...howWeWorkList, { title: "", subtitle: "" }]);
  const removeHowWeWork = (index: number) => setHowWeWorkList(howWeWorkList.filter((_, i) => i !== index));
  const updateHowWeWork = (index: number, field: 'title' | 'subtitle', value: string) => {
    const newList = [...howWeWorkList];
    newList[index][field] = value;
    setHowWeWorkList(newList);
  };

  // Feature Handlers
  const addFeature = () => setFeatures([...features, { title: "", description: "", icon: "" }]);
  const removeFeature = (index: number) => setFeatures(features.filter((_, i) => i !== index));
  const updateFeature = (index: number, field: 'title' | 'description', value: string) => {
    const newFeatures = [...features];
    newFeatures[index][field] = value;
    setFeatures(newFeatures);
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
        
        await fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/settings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: 'about_features', value: newFeatures })
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-8">Loading settings...</div>;

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">About Us Page Management</h1>
      
      <form onSubmit={handleSave} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-12">
        
        {/* Hero Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Hero Section</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hero Title</label>
            <textarea name="about_hero_title" value={settings.about_hero_title} onChange={handleChange} rows={2} className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:border-meewa-red"></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hero Subtitle</label>
            <textarea name="about_hero_subtitle" value={settings.about_hero_subtitle} onChange={handleChange} rows={2} className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:border-meewa-red"></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hero Image/Video</label>
            {settings.about_hero_media && (
              <div className="mb-4">
                {settings.about_hero_media.endsWith('.mp4') ? (
                  <video src={(settings.about_hero_media)?.startsWith("http") ? (settings.about_hero_media) : `${process.env.NEXT_PUBLIC_API_URL}${settings.about_hero_media}`} autoPlay loop muted className="h-40 rounded border object-cover" />
                ) : (
                  <img src={(settings.about_hero_media)?.startsWith("http") ? (settings.about_hero_media) : `${process.env.NEXT_PUBLIC_API_URL}${settings.about_hero_media}`} className="h-40 rounded border object-cover" />
                )}
              </div>
            )}
            <input type="file" accept="image/*,video/mp4" onChange={(e) => handleFileUpload(e, "about_hero_media")} disabled={uploading === "about_hero_media"} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-red-50 file:text-meewa-red" />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="text-xl font-semibold text-gray-800">Stats Grid</h2>
            <button type="button" onClick={addStat} className="text-sm bg-meewa-red text-white px-3 py-1 rounded">+ Add Stat</button>
          </div>
          <div className="space-y-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="flex gap-4 items-center bg-gray-50 p-4 rounded-lg relative">
                <button type="button" onClick={() => removeStat(idx)} className="absolute top-4 right-4 text-red-500 font-bold">✕</button>
                <div className="w-1/3">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Title (e.g. 360)</label>
                  <input type="text" value={stat.title} onChange={(e) => updateStat(idx, 'title', e.target.value)} className="w-full border-gray-300 rounded-md p-2 border" />
                </div>
                <div className="w-2/3 mr-10">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Subtitle</label>
                  <input type="text" value={stat.subtitle} onChange={(e) => updateStat(idx, 'subtitle', e.target.value)} className="w-full border-gray-300 rounded-md p-2 border" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vision & Mission */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Vision & Mission</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-bold text-gray-700">Vision Card</h3>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Vision Icon</label>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 flex items-center justify-center bg-meewa-red rounded-xl shadow-sm flex-shrink-0">
                    {settings.about_vision_icon ? (
                      <img src={settings.about_vision_icon.startsWith('/') ? `${process.env.NEXT_PUBLIC_API_URL}${settings.about_vision_icon}` : settings.about_vision_icon} className="w-6 h-6 object-contain" alt="Icon" />
                    ) : (
                      <span className="text-white text-[10px] text-center leading-tight">No Icon</span>
                    )}
                  </div>
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, "about_vision_icon")} disabled={uploading === "about_vision_icon"} className="block w-full text-xs text-gray-500 file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:bg-red-50 file:text-meewa-red" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Subtitle (e.g. See beyond the brief)</label>
                <input type="text" name="about_vision_subtitle" value={settings.about_vision_subtitle} onChange={handleChange} className="w-full border-gray-300 rounded-md p-2 border" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Title (e.g. Our Vision)</label>
                <input type="text" name="about_vision_title" value={settings.about_vision_title} onChange={handleChange} className="w-full border-gray-300 rounded-md p-2 border" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                <textarea name="about_vision_desc" value={settings.about_vision_desc} onChange={handleChange} rows={4} className="w-full border-gray-300 rounded-md p-2 border"></textarea>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-bold text-gray-700">Mission Card</h3>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Mission Icon</label>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 flex items-center justify-center bg-meewa-red rounded-xl shadow-sm flex-shrink-0">
                    {settings.about_mission_icon ? (
                      <img src={settings.about_mission_icon.startsWith('/') ? `${process.env.NEXT_PUBLIC_API_URL}${settings.about_mission_icon}` : settings.about_mission_icon} className="w-6 h-6 object-contain" alt="Icon" />
                    ) : (
                      <span className="text-white text-[10px] text-center leading-tight">No Icon</span>
                    )}
                  </div>
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, "about_mission_icon")} disabled={uploading === "about_mission_icon"} className="block w-full text-xs text-gray-500 file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:bg-red-50 file:text-meewa-red" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Subtitle (e.g. Deliver with precision)</label>
                <input type="text" name="about_mission_subtitle" value={settings.about_mission_subtitle} onChange={handleChange} className="w-full border-gray-300 rounded-md p-2 border" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Title (e.g. Our Mission)</label>
                <input type="text" name="about_mission_title" value={settings.about_mission_title} onChange={handleChange} className="w-full border-gray-300 rounded-md p-2 border" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                <textarea name="about_mission_desc" value={settings.about_mission_desc} onChange={handleChange} rows={4} className="w-full border-gray-300 rounded-md p-2 border"></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* Our Clients */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Our Clients (Marquee)</h2>
          <div className="flex flex-wrap gap-4 mb-4">
            {clients.map((client, idx) => (
              <div key={idx} className="relative border p-2 rounded bg-gray-50 flex items-center justify-center w-24 h-24">
                <button type="button" onClick={() => removeClientLogo(idx)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center">✕</button>
                <img src={(client.logo_url)?.startsWith("http") ? (client.logo_url) : `${process.env.NEXT_PUBLIC_API_URL}${client.logo_url}`} className="max-w-full max-h-full object-contain" />
              </div>
            ))}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Client Logos (Multiple)</label>
            <input type="file" multiple accept="image/*" onChange={handleClientLogoUpload} disabled={uploading === 'clients'} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-red-50 file:text-meewa-red" />
            {uploading === 'clients' && <p className="text-sm text-meewa-red mt-2">Uploading logos...</p>}
          </div>
        </div>

        {/* How We Work */}
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="text-xl font-semibold text-gray-800">How We Work</h2>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <textarea name="about_how_we_work_title" value={settings.about_how_we_work_title} onChange={handleChange} rows={2} className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:border-meewa-red"></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea name="about_how_we_work_desc" value={settings.about_how_we_work_desc} onChange={handleChange} rows={3} className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:border-meewa-red"></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Media</label>
            {settings.about_how_we_work_media && (
              <div className="mb-4">
                <img src={(settings.about_how_we_work_media)?.startsWith("http") ? (settings.about_how_we_work_media) : `${process.env.NEXT_PUBLIC_API_URL}${settings.about_how_we_work_media}`} className="h-40 rounded border object-cover" />
              </div>
            )}
            <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, "about_how_we_work_media")} className="block w-full text-sm text-gray-500 file:mr-4 file:bg-red-50 file:text-meewa-red" />
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Capabilities List</label>
              <button type="button" onClick={addHowWeWork} className="text-xs bg-meewa-red text-white px-2 py-1 rounded hover:bg-red-700">+ Add Item</button>
            </div>
            <div className="space-y-2">
              {howWeWorkList.map((item, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input type="text" placeholder="Subtitle (e.g. Discover)" value={item.subtitle} onChange={(e) => updateHowWeWork(idx, 'subtitle', e.target.value)} className="w-1/3 border-gray-300 rounded-md p-2 border text-sm" />
                  <input type="text" placeholder="Title (e.g. Brand Strategy)" value={item.title} onChange={(e) => updateHowWeWork(idx, 'title', e.target.value)} className="w-2/3 border-gray-300 rounded-md p-2 border text-sm" />
                  <button type="button" onClick={() => removeHowWeWork(idx)} className="text-red-500 hover:text-red-700 font-bold px-2">✕</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="text-xl font-semibold text-gray-800">Capabilities Grid (Features)</h2>
            <button type="button" onClick={addFeature} className="text-sm bg-meewa-red text-white px-3 py-1 rounded">+ Add Card</button>
          </div>
          <div className="space-y-4">
            {features.map((feature, idx) => (
              <div key={idx} className="p-4 border rounded-lg bg-gray-50 relative">
                <button type="button" onClick={() => removeFeature(idx)} className="absolute top-4 right-4 text-red-500 text-sm font-bold">✕ Remove</button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mr-16">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
                    <input type="text" value={feature.title} onChange={(e) => updateFeature(idx, 'title', e.target.value)} className="w-full border-gray-300 rounded-md p-2 border text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Icon Upload</label>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 flex items-center justify-center bg-meewa-red rounded-xl shadow-sm flex-shrink-0">
                        {feature.icon ? (
                          <img src={feature.icon.startsWith('/') ? `${process.env.NEXT_PUBLIC_API_URL}${feature.icon}` : feature.icon} className="w-6 h-6 object-contain" alt="Icon" />
                        ) : (
                          <span className="text-white text-[10px] text-center leading-tight">No Icon</span>
                        )}
                      </div>
                      <input type="file" accept="image/*" onChange={(e) => handleFeatureIconUpload(idx, e)} className="text-xs" />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                    <textarea value={feature.description} onChange={(e) => updateFeature(idx, 'description', e.target.value)} rows={2} className="w-full border-gray-300 rounded-md p-2 border text-sm"></textarea>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 pt-6 border-t">
          <button type="submit" className="bg-meewa-red text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition-colors">
            Save About Page Settings
          </button>
        </div>
      </form>
    </div>
  );
}
