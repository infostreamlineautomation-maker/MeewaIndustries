import { fetchServerSettings } from '@/lib/fetchSettings';
import Image from 'next/image';

export default async function HeroSection() {
  let settings: any = {};
  try {
    const res = await fetchServerSettings();
    settings = await res.json();
  } catch(e) {}

  const bannerUrl = settings.hero_image_url 
    ? `${settings.hero_image_url?.startsWith('http') ? settings.hero_image_url : process.env.NEXT_PUBLIC_API_URL + settings.hero_image_url}` 
    : "/images/Flow.svg";

  return (
    <section className="relative w-full h-[85vh] min-h-[600px] flex flex-col justify-end items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        {bannerUrl.endsWith('.mp4') ? (
          <video 
            src={bannerUrl}
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <img 
            src={bannerUrl}
            alt="Landing Page Banner" 
            className="w-full h-full object-cover"
          />
        )}
        {/* Subtle dark overlay to ensure text readability without darkening the video too much */}
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      {/* Hero Text Content */}
      <div className="relative z-10 text-center text-white mb-20 px-4 max-w-4xl">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">
          {settings.hero_title}
        </h1>
        <p className="text-xl md:text-2xl text-gray-200">
          {settings.hero_subtitle}
        </p>
      </div>

      {/* The Red Block Overlapping the Bottom - Creative Stats Bar */}
      <div className="relative z-10 w-[90%] md:w-[70%] bg-meewa-red rounded-xl shadow-2xl translate-y-12 p-6 overflow-hidden">
        {/* Animated subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] [background-size:20px_20px] animate-[pulse_4s_ease-in-out_infinite]"></div>
        
        <div className="relative z-20 flex flex-col md:flex-row items-center justify-between gap-6 px-4 md:px-10">
          
          <div className="flex flex-col items-center group cursor-pointer">
            <span className="text-3xl md:text-4xl font-black text-white group-hover:scale-110 transition-transform duration-300 drop-shadow-md">50+</span>
            <span className="text-xs md:text-sm font-bold text-white/90 uppercase tracking-widest mt-1">Countries Served</span>
          </div>

          <div className="hidden md:block w-px h-12 bg-white/30"></div>

          <div className="flex flex-col items-center group cursor-pointer">
            <span className="text-3xl md:text-4xl font-black text-white group-hover:scale-110 transition-transform duration-300 drop-shadow-md">100%</span>
            <span className="text-xs md:text-sm font-bold text-white/90 uppercase tracking-widest mt-1">Food-Grade Safe</span>
          </div>

          <div className="hidden md:block w-px h-12 bg-white/30"></div>

          <div className="flex flex-col items-center group cursor-pointer">
            <span className="text-3xl md:text-4xl font-black text-white group-hover:scale-110 transition-transform duration-300 drop-shadow-md">48h</span>
            <span className="text-xs md:text-sm font-bold text-white/90 uppercase tracking-widest mt-1">Quote Turnaround</span>
          </div>
          
        </div>
      </div>
    </section>
  );
}
