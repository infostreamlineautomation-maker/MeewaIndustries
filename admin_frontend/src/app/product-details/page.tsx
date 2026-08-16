"use client";

import { useState, useEffect } from 'react';

export default function ProductDetailSettings() {
  const [settings, setSettings] = useState({
    hide_pd_hero: "false",
    hide_pd_banner: "false",
    hide_pd_marquee: "false",
    hide_pd_features: "false",
    hide_pd_specs: "false",
    hide_pd_related: "false",
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastChanged, setLastChanged] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/settings`).then(res => res.json()),
      fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/audit-logs?target_type=settings&limit=1`).then(res => res.json())
    ])
      .then(([data, auditData]) => {
        setSettings({
          hide_pd_hero: data.hide_pd_hero || "false",
          hide_pd_banner: data.hide_pd_banner || "false",
          hide_pd_marquee: data.hide_pd_marquee || "false",
          hide_pd_features: data.hide_pd_features || "false",
          hide_pd_specs: data.hide_pd_specs || "false",
          hide_pd_related: data.hide_pd_related || "false",
        });
        if (auditData.length > 0) setLastChanged(auditData[0]);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch settings", err);
        setLoading(false);
      });
  }, []);

  const handleToggle = (key: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: (prev as any)[key] === "true" ? "false" : "true"
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const bulkData = Object.entries(settings).map(([key, value]) => ({ key, value }));
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/settings/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bulkData)
      });
      
      if (res.ok) {
        alert('Settings saved successfully!');
      } else {
        alert('Error saving settings.');
      }
    } catch (err) {
      alert('Error saving settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8">Loading settings...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Detail Page</h1>
          <p className="text-gray-500 mt-2">Manage the visibility of components on all product detail pages globally.</p>
        </div>
      </div>
      
      <form onSubmit={handleSave} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-10">
        
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Component Visibility</h2>
          <p className="text-sm text-gray-500">Toggle sections on or off for all product detail pages.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ToggleOption 
              label="Hero Section" 
              description="The top section with product name, price, and floating image." 
              checked={settings.hide_pd_hero !== "true"} 
              onChange={() => handleToggle('hide_pd_hero')} 
            />
            <ToggleOption 
              label="Banner Section" 
              description="The dark section with 'Get your customized coffee cup' text." 
              checked={settings.hide_pd_banner !== "true"} 
              onChange={() => handleToggle('hide_pd_banner')} 
            />
            <ToggleOption 
              label="Marquee Section" 
              description="The red scrolling text section." 
              checked={settings.hide_pd_marquee !== "true"} 
              onChange={() => handleToggle('hide_pd_marquee')} 
            />
            <ToggleOption 
              label="Features Grid" 
              description="The grid of product features/benefits." 
              checked={settings.hide_pd_features !== "true"} 
              onChange={() => handleToggle('hide_pd_features')} 
            />
            <ToggleOption 
              label="Specifications Table" 
              description="The technical specifications table for the product." 
              checked={settings.hide_pd_specs !== "true"} 
              onChange={() => handleToggle('hide_pd_specs')} 
            />
            <ToggleOption 
              label="Related Products" 
              description="The slider showing related products at the bottom." 
              checked={settings.hide_pd_related !== "true"} 
              onChange={() => handleToggle('hide_pd_related')} 
            />
          </div>
        </div>
        
        <div className="pt-6 border-t flex justify-end">
          <button 
            type="submit" 
            disabled={saving}
            className="px-6 py-2 bg-meewa-red text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
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
