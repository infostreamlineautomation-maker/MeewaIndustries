"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    page_settings: true,
    db_settings: true,
    global_settings: true,
  });

  const toggleMenu = (menu: string) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/settings`)
      .then(res => res.json())
      .then(data => {
        if (data.admin_logo_url) {
          setLogoUrl(data.admin_logo_url.startsWith('http') ? data.admin_logo_url : `${process.env.NEXT_PUBLIC_API_URL}${data.admin_logo_url}`);
        }
      })
      .catch(err => console.error("Error fetching admin logo:", err));
  }, []);

  const isActive = (path: string) => {
    return pathname === path || (path !== '/' && pathname.startsWith(path));
  };

  const navItemClass = (path: string) => 
    `block px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
      isActive(path) 
        ? "bg-meewa-red text-white shadow-md" 
        : "text-gray-600 hover:bg-red-50 hover:text-meewa-red"
    }`;

  const navDropdownItemClass = (path: string) => 
    `block px-4 py-2 mt-1 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive(path) 
        ? "bg-red-50 text-meewa-red font-bold" 
        : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
    }`;

  const handleLogout = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/auth/logout`, { method: "POST" });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token');
    }
    window.location.href = "/login";
  };

  if (pathname === '/login') return null;

  return (
    <aside className="w-64 bg-white flex flex-col h-full shadow-[4px_0_24px_rgba(0,0,0,0.02)] shrink-0 border-r border-gray-100 z-20">
      <div className="p-8 border-b border-gray-100 flex flex-col items-center justify-center">
        {/* Circular Logo matching frontend */}
        <div className="bg-white rounded-full w-20 h-20 flex flex-col items-center justify-center shadow-md border-2 border-gray-50 overflow-hidden mb-4">
          {logoUrl ? (
            <img src={logoUrl} alt="MEEWA Admin Logo" className="w-full h-full object-contain p-2" />
          ) : null}
        </div>
        <h1 className="text-base font-bold tracking-widest text-meewa-dark text-center">MEEWA ADMIN</h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <Link href="/" className={navItemClass("/")}>
          Dashboard
        </Link>
        <Link href="/enquiries" className={navItemClass("/enquiries")}>
          Enquiries
        </Link>

        {/* Page Settings Dropdown */}
        <div>
          <button onClick={() => toggleMenu("page_settings")} className="w-full flex items-center justify-between px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors">
            <span>Page Settings</span>
            <span className="text-xs text-gray-400">{openMenus.page_settings ? "▲" : "▼"}</span>
          </button>
          {openMenus.page_settings && (
            <div className="pl-4 border-l-2 border-gray-100 ml-4 mt-1 space-y-1">
              <Link href="/landing" className={navDropdownItemClass("/landing")}>Landing Page</Link>
              <Link href="/about" className={navDropdownItemClass("/about")}>About Us Page</Link>
              <Link href="/categories" className={navDropdownItemClass("/categories")}>Products Page</Link>
              <Link href="/product-details" className={navDropdownItemClass("/product-details")}>Product Detail Page</Link>
              <Link href="/contact" className={navDropdownItemClass("/contact")}>Contact Us</Link>
            </div>
          )}
        </div>

        {/* DB Settings Dropdown */}
        <div>
          <button onClick={() => toggleMenu("db_settings")} className="w-full flex items-center justify-between px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors">
            <span>DB Settings</span>
            <span className="text-xs text-gray-400">{openMenus.db_settings ? "▲" : "▼"}</span>
          </button>
          {openMenus.db_settings && (
            <div className="pl-4 border-l-2 border-gray-100 ml-4 mt-1 space-y-1">
              <Link href="/manage-categories" className={navDropdownItemClass("/manage-categories")}>Manage Categories</Link>
              <Link href="/manage-products" className={navDropdownItemClass("/manage-products")}>Manage Products</Link>
            </div>
          )}
        </div>

        {/* Global Settings Dropdown */}
        <div>
          <button onClick={() => toggleMenu("global_settings")} className="w-full flex items-center justify-between px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors">
            <span>Global Settings</span>
            <span className="text-xs text-gray-400">{openMenus.global_settings ? "▲" : "▼"}</span>
          </button>
          {openMenus.global_settings && (
            <div className="pl-4 border-l-2 border-gray-100 ml-4 mt-1 space-y-1">
              <Link href="/settings" className={navDropdownItemClass("/settings")}>Global Settings</Link>
              <Link href="/profile" className={navDropdownItemClass("/profile")}>Admin Profile</Link>
            </div>
          )}
        </div>

        <Link href="/audit-logs" className={navItemClass("/audit-logs")}>
          Log Audit
        </Link>
      </nav>

      <div className="p-4 border-t border-gray-100 mt-auto bg-gray-50 shrink-0 flex justify-between items-center">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase">Logged in as</p>
          <p className="text-sm font-bold text-gray-800">Admin</p>
        </div>
        <button onClick={handleLogout} className="text-xs font-bold text-meewa-red hover:underline p-2">
          Logout
        </button>
      </div>
    </aside>
  );
}
