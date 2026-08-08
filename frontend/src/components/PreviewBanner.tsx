'use client';
import { useEffect, useState } from 'react';

export default function PreviewBanner() {
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    if (document.cookie.includes('preview_mode=true')) {
      setIsPreview(true);
    }
  }, []);

  if (!isPreview) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-yellow-400 text-yellow-900 px-4 py-2 flex justify-between items-center z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.1)] font-bold">
      <span>You are currently viewing a Preview of the Draft Settings.</span>
      <a href="/api/preview?action=exit" className="bg-yellow-900 text-yellow-100 px-4 py-1 rounded hover:bg-yellow-800 transition-colors text-sm">
        Exit Preview
      </a>
    </div>
  );
}
