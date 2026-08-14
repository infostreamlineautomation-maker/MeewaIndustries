import { fetchServerSettings } from '@/lib/fetchSettings';
import Image from 'next/image';

import AnimatedTagline from './AnimatedTagline';

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
      <div className="relative z-10 text-center text-white mb-10 md:mb-20 px-4 max-w-5xl">
        <h1 className="text-4xl md:text-7xl font-bold mb-4 hover:underline cursor-default transition-all duration-300">
          {settings.hero_title}
        </h1>
        <p className="text-lg md:text-3xl text-gray-200">
          {settings.hero_subtitle}
        </p>
      </div>

      {/* The Red Block Overlapping the Bottom - Creative Stats Bar */}
      <div className="relative z-10 mx-auto w-[92%] md:w-full max-w-[704px] lg:max-w-[804px] rounded-2xl md:rounded-3xl py-4 md:py-0 md:h-[121px] bg-meewa-red translate-y-[60.5px] flex items-center justify-center px-4 md:px-8">
        <div className="relative z-20 flex items-center justify-center text-center w-full">
          <AnimatedTagline text={settings.hero_tagline || "“Premium Paper Packaging. Sustainable , high-quality disposable food packaging.”"} />
        </div>
      </div>
    </section>
  );
}
