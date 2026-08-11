"use client";
import { useState, useEffect } from "react";

export default function ProfilePage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [adminLogoUrl, setAdminLogoUrl] = useState("");
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch current user details
    fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/auth/me`)
      .then(res => res.json())
      .then(data => {
        if (data.username) setUsername(data.username);
      })
      .catch(console.error);
      
    // Fetch settings for logo
    fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/settings`)
      .then(res => res.json())
      .then(data => {
        if (data.admin_logo_url) setAdminLogoUrl(data.admin_logo_url);
      })
      .catch(console.error);
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError("");

    try {
      // 1. Update Profile
      const res = await fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/auth/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password: password || undefined })
      });
      
      // 2. Update Admin Logo in Settings
      const resSettings = await fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/settings/bulk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([{ key: "admin_logo_url", value: adminLogoUrl }])
      });
      
      if (res.ok && resSettings.ok) {
        setSuccess(true);
        setPassword("");
        // Reload page to reflect sidebar changes
        setTimeout(() => window.location.reload(), 1500);
      } else {
        const data = await res.json();
        setError(data.detail || "Update failed");
      }
    } catch (err) {
      setError("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setUploadingLogo(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/settings/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setAdminLogoUrl(data.url);
      } else {
        alert("Upload failed: " + JSON.stringify(data));
      }
    } catch (err) {
      alert("Error uploading file");
    } finally {
      setUploadingLogo(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        {success && (
          <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6 border border-green-100 font-medium">
            Profile updated successfully.
          </div>
        )}
        {error && (
          <div className="bg-red-50 text-meewa-red p-4 rounded-lg mb-6 border border-red-100 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border-gray-300 rounded-lg shadow-sm p-3 border focus:border-meewa-red focus:ring-meewa-red"
              required
            />
          </div>
          
          <div className="pt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Admin Panel Logo</label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gray-100 border border-gray-300 rounded-full flex items-center justify-center overflow-hidden shadow-sm">
                {adminLogoUrl ? (
                  <img 
                    src={adminLogoUrl.startsWith('http') ? adminLogoUrl : `${process.env.NEXT_PUBLIC_API_URL}${adminLogoUrl}`} 
                    alt="Admin Logo" 
                    className="w-full h-full object-contain p-2" 
                  />
                ) : (
                  <span className="text-gray-400 text-xs">No Logo</span>
                )}
              </div>
              <div className="flex-1">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleLogoUpload} 
                  disabled={uploadingLogo} 
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-meewa-red hover:file:bg-red-100 cursor-pointer" 
                />
                <p className="text-xs text-gray-500 mt-2">Recommended: Square image, transparent background (PNG).</p>
                {uploadingLogo && <p className="text-xs text-meewa-red mt-1">Uploading...</p>}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">New Password (leave blank to keep current)</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-gray-300 rounded-lg shadow-sm p-3 border focus:border-meewa-red focus:ring-meewa-red"
            />
          </div>

          <div className="pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={loading}
              className="bg-meewa-red text-white py-3 px-6 rounded-lg font-bold hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
