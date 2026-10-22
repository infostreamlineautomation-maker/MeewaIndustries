"use client";

import { useState, useEffect } from "react";

export default function ContactSettingsPage() {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/settings`)
      .then((res) => res.json())
      .then((data) => {
        const footerSocials = Array.isArray(data.footer_socials) ? data.footer_socials : [];
        const findHref = (label: string) => {
          const item = footerSocials.find((s: any) => (s?.label || "").toLowerCase() === label.toLowerCase());
          return item?.href && item.href !== '#' ? item.href : '';
        };

        setSettings({
          ...data,
          connect_with_us_title: data.connect_with_us_title || "Connect with us",
          social_linkedin: data.social_linkedin || findHref('linkedin'),
          social_facebook: data.social_facebook || findHref('facebook'),
          social_instagram: data.social_instagram || findHref('instagram'),
          social_youtube: data.social_youtube || findHref('youtube'),
          social_twitter: data.social_twitter || findHref('x') || findHref('twitter'),
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load settings", err);
        setLoading(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const currentFooterSocials = Array.isArray(settings.footer_socials) ? [...settings.footer_socials] : [];
      const updatedFooterSocials = [
        { label: "LinkedIn", href: settings.social_linkedin || "#" },
        { label: "Facebook", href: settings.social_facebook || "#" },
        { label: "Instagram", href: settings.social_instagram || "#" },
        { label: "YouTube", href: settings.social_youtube || "#" },
      ];
      if (settings.social_twitter) {
        updatedFooterSocials.push({ label: "X", href: settings.social_twitter });
      }

      const labelsUpdated = ["linkedin", "facebook", "instagram", "youtube", "x", "twitter"];
      const customSocials = currentFooterSocials.filter(
        (s: any) => !labelsUpdated.includes((s.label || "").toLowerCase())
      );
      const mergedFooterSocials = [...updatedFooterSocials, ...customSocials];

      const newSettings = {
        ...settings,
        footer_socials: mergedFooterSocials,
      };

      const payload = Object.entries(newSettings).map(([key, value]) => ({
        key,
        value,
      }));

      const response = await fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/settings/bulk`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSettings(newSettings);
        setMessage("Settings saved successfully!");
      } else {
        setMessage("Failed to save settings.");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      setMessage("An error occurred while saving.");
    }
    setSaving(false);
    setTimeout(() => setMessage(""), 3000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl font-semibold text-gray-500">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contact Us Settings</h1>
          <p className="text-gray-500 mt-1">Manage the content and details shown on the public Contact page.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-meewa-red hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition-all flex items-center gap-2"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg font-medium ${message.includes("success") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {message}
        </div>
      )}

      <div className="space-y-8">
        
        {/* Header Content Section */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Header Content</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Page Title</label>
              <input
                type="text"
                name="contact_title"
                value={settings.contact_title || ""}
                onChange={handleChange}
                placeholder="Contact Us"
                className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 bg-white placeholder-gray-400 focus:ring-meewa-red focus:border-meewa-red"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Page Subtitle</label>
              <textarea
                name="contact_subtitle"
                value={settings.contact_subtitle || ""}
                onChange={handleChange}
                rows={2}
                placeholder="Any question or remarks? Just write us a message!"
                className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 bg-white placeholder-gray-400 focus:ring-meewa-red focus:border-meewa-red"
              />
            </div>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="text"
                name="contact_phone"
                value={settings.contact_phone || ""}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 bg-white placeholder-gray-400 focus:ring-meewa-red focus:border-meewa-red"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                name="contact_email"
                value={settings.contact_email || ""}
                onChange={handleChange}
                placeholder="info@meewaindustries.com"
                className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 bg-white placeholder-gray-400 focus:ring-meewa-red focus:border-meewa-red"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Number (Optional)</label>
              <input
                type="text"
                name="contact_whatsapp"
                value={settings.contact_whatsapp || ""}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 bg-white placeholder-gray-400 focus:ring-meewa-red focus:border-meewa-red"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
              <input
                type="text"
                name="contact_website"
                value={settings.contact_website || ""}
                onChange={handleChange}
                placeholder="www.meewaindustries.com"
                className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 bg-white placeholder-gray-400 focus:ring-meewa-red focus:border-meewa-red"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Office Address</label>
              <textarea
                name="contact_address"
                value={settings.contact_address || ""}
                onChange={handleChange}
                rows={3}
                placeholder="Your Company Address, Gujarat, India"
                className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 bg-white placeholder-gray-400 focus:ring-meewa-red focus:border-meewa-red"
              />
            </div>
            <div className="md:col-span-2 pt-4 border-t border-gray-200">
              <h3 className="text-base font-semibold text-gray-800 mb-4">Get In Touch Card (Header & Subtitle)</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Get In Touch Title</label>
                  <input
                    type="text"
                    name="get_in_touch_title"
                    value={settings.get_in_touch_title || ""}
                    onChange={handleChange}
                    placeholder="Get In Touch"
                    className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 bg-white placeholder-gray-400 focus:ring-meewa-red focus:border-meewa-red"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Get In Touch Subtitle</label>
                  <textarea
                    name="get_in_touch_subtitle"
                    value={settings.get_in_touch_subtitle || ""}
                    onChange={handleChange}
                    rows={2}
                    placeholder="Get product details, pricing, samples, and export support. We'll respond within 24 hours."
                    className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 bg-white placeholder-gray-400 focus:ring-meewa-red focus:border-meewa-red"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Connect With Us (Social Media Links) */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <div className="border-b pb-4 mb-6">
            <h2 className="text-xl font-bold text-gray-800">Connect With Us (Social Links)</h2>
            <p className="text-sm text-gray-500 mt-1">
              Configure the social media links displayed on the Contact Us page, Landing page, and Footer globally.
            </p>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Connect Card Section Title</label>
              <input
                type="text"
                name="connect_with_us_title"
                value={settings.connect_with_us_title || ""}
                onChange={handleChange}
                placeholder="Connect with us"
                className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 bg-white placeholder-gray-400 focus:ring-meewa-red focus:border-meewa-red"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL</label>
                <input
                  type="text"
                  name="social_linkedin"
                  value={settings.social_linkedin || ""}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/company/meewa"
                  className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 bg-white placeholder-gray-400 focus:ring-meewa-red focus:border-meewa-red"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Facebook URL</label>
                <input
                  type="text"
                  name="social_facebook"
                  value={settings.social_facebook || ""}
                  onChange={handleChange}
                  placeholder="https://facebook.com/meewa"
                  className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 bg-white placeholder-gray-400 focus:ring-meewa-red focus:border-meewa-red"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Instagram URL</label>
                <input
                  type="text"
                  name="social_instagram"
                  value={settings.social_instagram || ""}
                  onChange={handleChange}
                  placeholder="https://instagram.com/meewa"
                  className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 bg-white placeholder-gray-400 focus:ring-meewa-red focus:border-meewa-red"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">YouTube URL</label>
                <input
                  type="text"
                  name="social_youtube"
                  value={settings.social_youtube || ""}
                  onChange={handleChange}
                  placeholder="https://youtube.com/@meewa"
                  className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 bg-white placeholder-gray-400 focus:ring-meewa-red focus:border-meewa-red"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">X / Twitter URL (Optional)</label>
                <input
                  type="text"
                  name="social_twitter"
                  value={settings.social_twitter || ""}
                  onChange={handleChange}
                  placeholder="https://x.com/meewa"
                  className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 bg-white placeholder-gray-400 focus:ring-meewa-red focus:border-meewa-red"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Google Maps Embed</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Map Embed URL (src attribute from Google Maps iframe)</label>
              <input
                type="text"
                name="contact_map_url"
                value={settings.contact_map_url || ""}
                onChange={handleChange}
                placeholder="https://www.google.com/maps/embed?pb=..."
                className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 bg-white placeholder-gray-400 focus:ring-meewa-red focus:border-meewa-red"
              />
              <p className="text-xs text-gray-500 mt-2">
                Go to Google Maps, search for your location, click Share -{">"} Embed a map, copy the HTML, and extract the URL inside the `src="..."` attribute.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
