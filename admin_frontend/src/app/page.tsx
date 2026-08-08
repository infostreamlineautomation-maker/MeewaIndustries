"use client";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total_products: 0,
    active_categories: 0,
    total_enquiries: 0,
    new_enquiries: 0,
    recent_enquiries: [] as any[],
    warnings: [] as string[]
  });

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/dashboard-stats`)
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error("Error fetching stats:", err));
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">Total Products</h3>
          <p className="text-4xl font-bold text-gray-900">{stats.total_products}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">Active Categories</h3>
          <p className="text-4xl font-bold text-gray-900">{stats.active_categories}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">Total Enquiries</h3>
          <p className="text-4xl font-bold text-gray-900">{stats.total_enquiries}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-meewa-red/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-meewa-red/5 rounded-bl-full"></div>
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">New Enquiries</h3>
          <p className="text-4xl font-bold text-meewa-red relative z-10">{stats.new_enquiries}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Recent Enquiries</h2>
            <a href="/enquiries" className="text-sm text-meewa-red hover:underline font-medium">View All</a>
          </div>
          <div className="divide-y divide-gray-100">
            {stats.recent_enquiries && stats.recent_enquiries.length > 0 ? (
              stats.recent_enquiries.map((enquiry: any) => (
                <div key={enquiry.id} className="p-4 px-6 hover:bg-gray-50 flex justify-between items-center transition-colors">
                  <div>
                    <p className="font-medium text-gray-900">{enquiry.name}</p>
                    <p className="text-sm text-gray-500">{enquiry.subject}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${enquiry.status === 'New' ? 'bg-red-100 text-meewa-red' : enquiry.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                      {enquiry.status}
                    </span>
                    <span className="text-xs text-gray-400">
                      {enquiry.created_at ? new Date(enquiry.created_at).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500 text-sm">No recent enquiries</div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">System Status</h2>
            </div>
            <div className="p-6">
              {stats.warnings && stats.warnings.length > 0 ? (
                <ul className="space-y-3">
                  {stats.warnings.map((warning, idx) => (
                    <li key={idx} className="flex items-start text-sm text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-100">
                      <svg className="w-5 h-5 text-amber-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                      <span>{warning}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex items-center text-sm text-green-700 bg-green-50 p-3 rounded-lg border border-green-100">
                  <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span>All systems operational. No warnings.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
