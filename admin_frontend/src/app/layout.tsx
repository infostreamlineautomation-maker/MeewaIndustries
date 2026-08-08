import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";
import FetchInterceptor from "@/components/FetchInterceptor";
import AdminHeaderActions from "@/components/AdminHeaderActions";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MEEWA Admin Dashboard",
  description: "Internal portal for managing MEEWA Industries platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className + " bg-meewa-light flex h-screen overflow-hidden text-gray-800"}>
        <FetchInterceptor />
        <AdminSidebar />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden bg-meewa-light">
          <header className="bg-white shadow-sm z-10 p-4 px-8 flex justify-between items-center h-20 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">Admin Portal</h2>
            <div className="flex items-center">
              <AdminHeaderActions />
              <div className="h-10 border-l border-gray-200 mr-6"></div>
              <Link href="/profile" className="flex items-center space-x-4 group cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                <div className="w-10 h-10 rounded-full bg-meewa-red text-white flex items-center justify-center font-bold shadow-md group-hover:scale-105 transition-transform">
                  A
                </div>
                <div className="text-sm font-medium text-gray-600 group-hover:text-meewa-red transition-colors">Admin User</div>
              </Link>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

