"use client";
import { useEffect } from "react";

export default function FetchInterceptor() {
  useEffect(() => {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      let [resource, config] = args;
      if (!config) {
        config = {};
      }
      
      // If fetching from our backend API, always include credentials for cookies
      const apiUrl = process.env.NEXT_PUBLIC_ADMIN_API_URL || 'localhost:8001';
      if (typeof resource === 'string' && (resource.includes(apiUrl) || resource.includes('localhost:8001'))) {
        config.credentials = 'include';
        
        // Also add Bearer token for cross-domain auth where cookies are blocked by the browser
        const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
        if (token) {
          config.headers = {
            ...config.headers,
            'Authorization': `Bearer ${token}`
          };
        }
      }
      
      // Handle the case where the API returns 401 Unauthorized
      const response = await originalFetch(resource, config);
      if (response.status === 401 && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      
      return response;
    };
    
    return () => {
      window.fetch = originalFetch;
    };
  }, []);
  
  return null;
}
