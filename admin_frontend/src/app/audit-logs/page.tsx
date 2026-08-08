"use client";
import { useState, useEffect } from "react";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  const fetchLogs = () => {
    setLoading(true);
    let url = `${process.env.NEXT_PUBLIC_ADMIN_API_URL}/audit-logs`;
    if (filter) url += `?target_type=${filter}`;
    
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setLogs(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching logs", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLogs();
  }, [filter]);

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-80px)] flex flex-col">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>
        <select 
          value={filter} 
          onChange={e => setFilter(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 text-sm bg-white focus:outline-none focus:border-meewa-red"
        >
          <option value="">All Categories</option>
          <option value="product">Products</option>
          <option value="category">Categories</option>
          <option value="settings">Settings</option>
        </select>
      </div>
      
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        <div className="overflow-y-auto flex-1 p-0">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : logs.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No logs found.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm">
                  <th className="p-4 font-semibold uppercase tracking-wider">Time</th>
                  <th className="p-4 font-semibold uppercase tracking-wider">Admin</th>
                  <th className="p-4 font-semibold uppercase tracking-wider">Action</th>
                  <th className="p-4 font-semibold uppercase tracking-wider">Type</th>
                  <th className="p-4 font-semibold uppercase tracking-wider">Details</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="p-4 text-sm font-medium text-gray-900">
                      {log.admin.username}
                    </td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap font-semibold ${
                        log.action === 'Created' ? 'bg-green-100 text-green-700' :
                        log.action === 'Updated' ? 'bg-blue-100 text-blue-700' :
                        log.action === 'Deleted' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-500 capitalize">
                      {log.target_type}
                    </td>
                    <td className="p-4 text-sm text-gray-700">
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
