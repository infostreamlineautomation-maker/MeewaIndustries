"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Banner {
  url: string;
  duration: number;
}

interface HeroCarouselProps {
  banners: Banner[];
  fallbackUrl: string;
}

export default function HeroCarousel({ banners, fallbackUrl }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  // If no banners, format the fallback to look like a single banner
  const activeBanners = banners && banners.length > 0 
    ? banners 
    : [{ url: fallbackUrl, duration: 5 }];

  useEffect(() => {
    if (activeBanners.length <= 1) return;

    const currentDuration = (activeBanners[currentIndex]?.duration || 5) * 1000;
    
    const timer = setTimeout(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, currentDuration);

    return () => clearTimeout(timer);
  }, [currentIndex, activeBanners]);

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeBanners.length]);

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) handleNext();
    if (distance < -minSwipeDistance) handlePrevious();
  };

  const handlePrevious = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? activeBanners.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
  };

  const handleDotClick = (idx: number) => {
    setDirection(idx > currentIndex ? 1 : -1);
    setCurrentIndex(idx);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 1
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 1
    })
  };

  return (
    <div 
      className="absolute inset-0 z-0 overflow-hidden bg-black"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ x: { type: "spring", stiffness: 300, damping: 30 } }}
          className="absolute inset-0"
        >
          {activeBanners[currentIndex].url.endsWith('.mp4') ? (
            <video 
              src={activeBanners[currentIndex].url?.startsWith('http') ? activeBanners[currentIndex].url : process.env.NEXT_PUBLIC_API_URL + activeBanners[currentIndex].url}
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-full h-full object-cover object-[left_center] md:object-center"
            />
          ) : (
            <img 
              src={activeBanners[currentIndex].url?.startsWith('http') ? activeBanners[currentIndex].url : process.env.NEXT_PUBLIC_API_URL + activeBanners[currentIndex].url}
              alt="Landing Page Banner" 
              className="w-full h-full object-cover object-[left_center] md:object-center"
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Subtle dark overlay */}
      <div className="absolute inset-0 bg-black/30 z-10 pointer-events-none"></div>

      {/* Manual Controls (Dots in Hover-Reveal Glass Container) */}
      {activeBanners.length > 1 && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-2.5 p-2.5 px-3 rounded-full bg-transparent border border-transparent transition-all duration-500 hover:bg-white/10 hover:backdrop-blur-lg hover:border-white/20 hover:shadow-[0_4px_12px_rgba(0,0,0,0.1),inset_0_1px_1px_rgba(255,255,255,0.3)] items-center group">
          {activeBanners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleDotClick(idx)}
              className={`rounded-full transition-all duration-300 shadow-[0_2px_4px_rgba(0,0,0,0.2)] ${idx === currentIndex ? 'w-2.5 h-2.5 bg-white' : 'w-2 h-2 bg-white/20 group-hover:bg-white/40 hover:!bg-white/70'}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
