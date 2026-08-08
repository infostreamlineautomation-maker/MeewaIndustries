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
      if (typeof resource === 'string' && resource.includes('localhost:8001')) {
        config.credentials = 'include';
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
