"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      if (res.ok) {
        // Save token for cross-domain auth
        if (data.token) {
          localStorage.setItem('admin_token', data.token);
        }
        // Redirect to dashboard on success
        window.location.href = "/";
      } else {
        setError(data.detail || "Login failed");
      }
    } catch (err) {
      setError("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-50 flex items-center justify-center z-[100]">
      <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-100 max-w-md w-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black tracking-widest text-meewa-dark mb-2">MEEWA</h1>
          <p className="text-sm font-bold tracking-widest text-meewa-red uppercase">Admin Portal</p>
        </div>

        {error && (
          <div className="bg-red-50 text-meewa-red p-3 rounded-lg text-sm mb-6 border border-red-100 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border-gray-300 rounded-lg shadow-sm p-3 border focus:border-meewa-red focus:ring-meewa-red"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-gray-300 rounded-lg shadow-sm p-3 border focus:border-meewa-red focus:ring-meewa-red"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-meewa-red text-white py-3 rounded-lg font-bold hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
