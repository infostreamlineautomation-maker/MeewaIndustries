import { fetchServerSettings } from '@/lib/fetchSettings';
import Image from 'next/image';

import AnimatedTagline from './AnimatedTagline';
import HeroCarousel from './HeroCarousel';

export default async function HeroSection() {
  let settings: any = {};
  try {
    const res = await fetchServerSettings();
    settings = await res.json();
  } catch(e) {}

  const fallbackUrl = settings.hero_image_url 
    ? `${settings.hero_image_url?.startsWith('http') ? settings.hero_image_url : process.env.NEXT_PUBLIC_API_URL + settings.hero_image_url}` 
    : "/images/Flow.svg";

  const banners = settings.hero_banners || [];

  return (
    <section className="relative w-full aspect-[4/3] sm:aspect-[16/10] md:h-[85vh] md:min-h-[600px] md:aspect-auto flex flex-col justify-end items-center">
      {/* Background Carousel */}
      <div className="absolute inset-0 z-0">
        <HeroCarousel banners={banners} fallbackUrl={fallbackUrl} />
      </div>

      {/* Hero Text Content (Centered over image) */}
      <div className="relative z-10 text-center text-white px-4 max-w-5xl mb-16 md:mb-24 pointer-events-none drop-shadow-md">
        {settings.hero_title && (
          <h1 className="text-3xl sm:text-4xl md:text-7xl font-bold mb-4 cursor-default transition-all duration-300">
            {settings.hero_title}
          </h1>
        )}
        {settings.hero_subtitle && (
          <p className="text-base sm:text-lg md:text-3xl text-gray-200">
            {settings.hero_subtitle}
          </p>
        )}
      </div>

      {/* The Red Block Overlapping the Bottom - Creative Stats Bar */}
      <div className="absolute bottom-0 translate-y-1/2 z-10 mx-auto w-[92%] max-w-[526px] md:max-w-[704px] lg:max-w-[804px] rounded-lg md:rounded-xl h-auto py-2 md:py-4 lg:py-5 bg-meewa-red flex items-center justify-center px-2 md:px-8 shadow-lg">
        <div className="relative z-20 flex items-center justify-center text-center w-full h-full">
          <AnimatedTagline text={settings.hero_tagline || "“Premium Paper Packaging. Sustainable , high-quality disposable food packaging.”"} />
        </div>
      </div>
    </section>
  );
}
