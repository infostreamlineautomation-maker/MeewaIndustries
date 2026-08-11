"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

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
        <Link href="/landing" className={navItemClass("/landing")}>
          Landing Page
        </Link>
        <Link href="/about" className={navItemClass("/about")}>
          About Us Page
        </Link>
        <div className="px-4 py-2 pt-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Database CRUD</div>
        <Link href="/manage-categories" className={navItemClass("/manage-categories")}>
          Manage Categories
        </Link>
        <Link href="/manage-products" className={navItemClass("/manage-products")}>
          Manage Products
        </Link>
        <div className="px-4 py-2 pt-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Page Settings</div>
        <Link href="/categories" className={navItemClass("/categories")}>
          Products Page
        </Link>
        <Link href="/enquiries" className={navItemClass("/enquiries")}>
          Enquiries
        </Link>
        <Link href="/contact" className={navItemClass("/contact")}>
          Contact Us
        </Link>
        <Link href="/settings" className={navItemClass("/settings")}>
          Global Settings
        </Link>
        <Link href="/profile" className={navItemClass("/profile")}>
          My Profile
        </Link>
        <Link href="/audit-logs" className={navItemClass("/audit-logs")}>
          Audit Logs
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
