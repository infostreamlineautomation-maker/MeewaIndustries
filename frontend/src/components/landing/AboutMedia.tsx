"use client";

import { useState } from 'react';

export default function AboutMedia({ mediaUrl }: { mediaUrl: string }) {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const url = mediaUrl.startsWith('http') ? mediaUrl : process.env.NEXT_PUBLIC_API_URL + mediaUrl;
  const isVideo = url.endsWith('.mp4');

  return (
    <>
      <div className="absolute inset-0 group">
        {isVideo ? (
          <>
            <video 
              src={url} 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="w-full h-full object-cover" 
            />
            {/* Play Button Overlay */}
            <div 
              className="absolute inset-0 flex items-center justify-center cursor-pointer group"
              onClick={() => setIsFullScreen(true)}
            >
              <div className="bg-meewa-red text-white rounded-full p-4 transform transition-transform hover:scale-110">
                <svg className="w-10 h-10 ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4l12 6-12 6z" />
                </svg>
              </div>
            </div>
          </>
        ) : (
          <img src={url} alt="About Background" className="w-full h-full object-cover" />
        )}
      </div>

      {/* Full Screen Modal */}
      {isFullScreen && isVideo && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center">
          <button 
            className="absolute top-6 right-6 text-white hover:text-gray-300 z-50 bg-black/50 p-2 rounded-full"
            onClick={() => setIsFullScreen(false)}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <video 
            src={url} 
            controls 
            autoPlay 
            className="w-[90vw] h-[90vh] object-contain outline-none" 
          />
        </div>
      )}
    </>
  );
}
