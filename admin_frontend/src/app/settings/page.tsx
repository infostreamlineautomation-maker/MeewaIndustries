"use client";

import { useState, useEffect } from 'react';

function DynamicLinkList({ label, items, onChange }: { label: string, items: {label: string, href: string}[], onChange: (items: any) => void }) {
  const addItem = () => onChange([...(items || []), { label: "", href: "" }]);
  const removeItem = (index: number) => onChange((items || []).filter((_, i) => i !== index));
  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...(items || [])];
    newItems[index] = { ...newItems[index], [field]: value };
    onChange(newItems);
  };

  return (
    <div className="space-y-2 mt-4 bg-gray-50 p-4 rounded-lg border">
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <button type="button" onClick={addItem} className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded">Add Link</button>
      </div>
      {(items || []).map((item, idx) => (
        <div key={idx} className="flex gap-2 items-center">
          <input type="text" value={item.label} onChange={(e) => updateItem(idx, 'label', e.target.value)} placeholder="Label (e.g. Home)" className="flex-1 border-gray-300 rounded-md shadow-sm p-2 border text-sm" />
          <input type="text" value={item.href} onChange={(e) => updateItem(idx, 'href', e.target.value)} placeholder="URL (e.g. /home)" className="flex-1 border-gray-300 rounded-md shadow-sm p-2 border text-sm" />
          <button type="button" onClick={() => removeItem(idx)} className="text-red-500 font-bold px-2">✕</button>
        </div>
      ))}
    </div>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>({
    site_title: "",
    meta_description: "",
    contact_email: "",
    notification_emails: "",
    site_logo_url: "",
    header_text: "",
    footer_text: "",
    smtp_host: "",
    smtp_port: "587",
    smtp_user: "",
    smtp_pass: "",
    smtp_from_email: "",
    smtp_from_name: "",
    footer_title: "",
    footer_subtitle: "",
    privacy_content: "",
    terms_content: "",
    sitemap_content: "",
    cookies_content: ""
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [lastChanged, setLastChanged] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/settings`).then(res => res.json()),
      fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/audit-logs?target_type=settings&limit=1`).then(res => res.json())
    ])
    .then(([settingsData, auditData]) => {
      setSettings({
        site_title: settingsData.site_title || "MEEWA",
        meta_description: settingsData.meta_description || "Premium Quality Export For Global Markets. Manufacturer and supplier of high quality paper cups, bagasse tableware, and packaging.",
        contact_email: settingsData.contact_email || "info@meewaindustries.com",
        notification_emails: settingsData.notification_emails || "",
        site_logo_url: settingsData.site_logo_url || "",
        header_text: settingsData.header_text || "Free shipping on bulk orders!",
        footer_text: settingsData.footer_text || `© ${new Date().getFullYear()} Meewa. All Rights Reserved.`,
        smtp_host: settingsData.smtp_host || "",
        smtp_port: settingsData.smtp_port || "587",
        smtp_user: settingsData.smtp_user || "",
        smtp_pass: settingsData.smtp_pass || "",
        smtp_from_email: settingsData.smtp_from_email || "",
        smtp_from_name: settingsData.smtp_from_name || "",
        header_links: settingsData.header_links || [],
        footer_links: settingsData.footer_links || [
          {label: "Home", href: "/"},
          {label: "Our Products", href: "/categories"},
          {label: "About Us", href: "/about"},
          {label: "Contact Us", href: "/contact"}
        ],
        footer_socials: settingsData.footer_socials || [
          {label: "LinkedIn", href: "#"},
          {label: "Facebook", href: "#"},
          {label: "Instagram", href: "#"},
          {label: "YouTube", href: "#"}
        ],
        footer_title: settingsData.footer_title || "Ready to source premium food packaging?",
        footer_subtitle: settingsData.footer_subtitle || "Get in touch with our experts for customized manufacturing and global export solutions.",
        privacy_content: settingsData.privacy_content || "We value your privacy. This privacy policy explains how we collect and use your data.",
        terms_content: settingsData.terms_content || "These are the terms and conditions for using our website.",
        sitemap_content: settingsData.sitemap_content || "Sitemap coming soon.",
        cookies_content: settingsData.cookies_content || "This website uses cookies to ensure you get the best experience."
      });
      if (auditData.length > 0) setLastChanged(auditData[0]);
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

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/settings/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setSettings((prev: any) => ({ ...prev, [key]: data.url }));
      } else {
        alert("Upload failed: " + JSON.stringify(data));
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading file");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const bulkData = Object.entries(settings).map(([key, value]) => ({ key, value }));
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/settings/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bulkData)
      });
      
      if (res.ok) {
        alert('Draft saved successfully! You can preview it before publishing.');
      } else {
        alert('Error saving draft.');
      }
    } catch (err) {
      alert('Error saving draft.');
    }
  };

  const handlePublish = async () => {
    // Moved to header
  };

  const handlePreview = () => {
    // Moved to header
  };

  if (loading) return <div className="p-8">Loading settings...</div>;

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Global Settings</h1>
        {lastChanged && (
          <p className="text-sm text-gray-500 mt-1">
            Last updated: {new Date(lastChanged.created_at).toLocaleString()} {lastChanged.admin?.username ? `(by ${lastChanged.admin.username})` : ""}
          </p>
        )}
      </div>
      
      <form onSubmit={handleSave} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-10">
        
        {/* Branding Settings */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Branding & Identity</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Site Logo</label>
            {settings.site_logo_url && (
              <div className="mb-4 bg-gray-100 p-4 rounded inline-block">
                <img src={`${process.env.NEXT_PUBLIC_API_URL}${settings.site_logo_url}`} alt="Site Logo Preview" className="h-16 object-contain" onError={(e) => { e.currentTarget.src = settings.site_logo_url }} />
              </div>
            )}
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => handleMediaUpload(e, "site_logo_url")}
              disabled={uploading}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-red-50 file:text-meewa-red
                hover:file:bg-red-100"
            />
            {uploading && <p className="text-sm text-meewa-red mt-2">Uploading...</p>}
          </div>


          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Header Announcement Text</label>
            <input 
              type="text" 
              name="header_text"
              value={settings.header_text}
              onChange={handleChange}
              placeholder="e.g. Free shipping on bulk orders!"
              className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:border-meewa-red focus:ring-meewa-red" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Footer Copyright / Description Text</label>
            <textarea 
              name="footer_text"
              value={settings.footer_text}
              onChange={handleChange}
              rows={2} 
              placeholder="e.g. © 2026 MEEWA Industries. All rights reserved."
              className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:border-meewa-red focus:ring-meewa-red"
            ></textarea>
          </div>

          <div className="pt-4 border-t">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Navigation Links</h3>
            <DynamicLinkList label="Header Links" items={settings.header_links} onChange={(val) => setSettings({...settings, header_links: val})} />
            <DynamicLinkList label="Footer Quick Links" items={settings.footer_links} onChange={(val) => setSettings({...settings, footer_links: val})} />
            <DynamicLinkList label="Footer Social Links" items={settings.footer_socials} onChange={(val) => setSettings({...settings, footer_socials: val})} />
          </div>

          <div className="pt-4 border-t">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Footer Text</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Footer Main Title</label>
                <input 
                  type="text" 
                  name="footer_title"
                  value={settings.footer_title}
                  onChange={handleChange}
                  className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:border-meewa-red focus:ring-meewa-red" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Footer Subtitle</label>
                <textarea 
                  name="footer_subtitle"
                  value={settings.footer_subtitle}
                  onChange={handleChange}
                  rows={2} 
                  className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:border-meewa-red focus:ring-meewa-red"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* SEO Settings */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">SEO Configurations</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Site Title</label>
            <input 
              type="text" 
              name="site_title"
              value={settings.site_title}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:border-meewa-red focus:ring-meewa-red" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Global Meta Description</label>
            <textarea 
              name="meta_description"
              value={settings.meta_description}
              onChange={handleChange}
              rows={3} 
              className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:border-meewa-red focus:ring-meewa-red"
            ></textarea>
          </div>
        </div>

        {/* Mail Settings */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Mail Configurations</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Public Contact Email</label>
            <input 
              type="email" 
              name="contact_email"
              value={settings.contact_email}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:border-meewa-red focus:ring-meewa-red" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Admin Notification Emails (comma separated)</label>
            <input 
              type="text" 
              name="notification_emails"
              value={settings.notification_emails}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:border-meewa-red focus:ring-meewa-red" 
            />
          </div>
        </div>

        {/* SMTP Settings */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">SMTP Configuration (For sending Enquiries)</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Host</label>
              <input 
                type="text" 
                name="smtp_host"
                value={settings.smtp_host}
                onChange={handleChange}
                placeholder="e.g. smtp.gmail.com"
                className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:border-meewa-red focus:ring-meewa-red" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Port</label>
              <input 
                type="text" 
                name="smtp_port"
                value={settings.smtp_port}
                onChange={handleChange}
                placeholder="e.g. 587 or 465"
                className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:border-meewa-red focus:ring-meewa-red" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Username (Email)</label>
            <input 
              type="text" 
              name="smtp_user"
              value={settings.smtp_user}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:border-meewa-red focus:ring-meewa-red" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Password</label>
            <input 
              type="password" 
              name="smtp_pass"
              value={settings.smtp_pass}
              onChange={handleChange}
              placeholder="Use App Passwords for Gmail"
              className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:border-meewa-red focus:ring-meewa-red" 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Send Emails From Name (e.g. Sales Team)</label>
              <input 
                type="text" 
                name="smtp_from_name"
                value={settings.smtp_from_name}
                onChange={handleChange}
                className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:border-meewa-red focus:ring-meewa-red" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Send Emails From Email (e.g. sales@meewa.com)</label>
              <input 
                type="email" 
                name="smtp_from_email"
                value={settings.smtp_from_email}
                onChange={handleChange}
                className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:border-meewa-red focus:ring-meewa-red" 
              />
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t">
          <button type="submit" className="bg-gray-800 text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-700 transition-colors shadow-sm">
            Save Draft
          </button>
        </div>
        {/* Legal Pages */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Legal & Policy Pages</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Privacy Policy Content</label>
            <textarea 
              name="privacy_content"
              value={settings.privacy_content}
              onChange={handleChange}
              rows={4} 
              className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:border-meewa-red focus:ring-meewa-red font-mono text-sm"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Terms & Conditions Content</label>
            <textarea 
              name="terms_content"
              value={settings.terms_content}
              onChange={handleChange}
              rows={4} 
              className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:border-meewa-red focus:ring-meewa-red font-mono text-sm"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sitemap Content</label>
            <textarea 
              name="sitemap_content"
              value={settings.sitemap_content}
              onChange={handleChange}
              rows={4} 
              className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:border-meewa-red focus:ring-meewa-red font-mono text-sm"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cookies Policy Content</label>
            <textarea 
              name="cookies_content"
              value={settings.cookies_content}
              onChange={handleChange}
              rows={4} 
              className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:border-meewa-red focus:ring-meewa-red font-mono text-sm"
            ></textarea>
          </div>
        </div>
      </form>
    </div>
  );
}
