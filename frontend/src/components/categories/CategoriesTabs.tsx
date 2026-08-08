"use client";

import { useRef, useState, useEffect } from "react";

export default function CategoriesTabs({ categories }: { categories: any[] }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState<string>("");

  // Categories are already unique in DB
  const topCategories = categories.map((curr: any) => ({
    name: curr.name,
    cover_image: curr.cover_image
  }));

  useEffect(() => {
    if (topCategories.length > 0 && !activeCategory) {
      setActiveCategory(topCategories[0].name);
    }
  }, [topCategories, activeCategory]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const scrollToSection = (name: string) => {
    setActiveCategory(name);
    const element = document.getElementById(`category-${name.replace(/\s+/g, '-')}`);
    if (element) {
      // Offset for sticky header
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <section className="pt-20 pb-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-4xl md:text-5xl font-bold text-meewa-red text-center mb-12">Product Categories</h2>
      
      <div className="relative group">
        {/* Left Arrow */}
        <button 
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 bg-white shadow-md rounded-full w-10 h-10 flex items-center justify-center text-gray-500 hover:text-meewa-red md:opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
        </button>

        {/* Scroll Container */}
        <div 
          ref={scrollContainerRef}
          className="flex space-x-6 overflow-x-auto scrollbar-hide snap-x py-4 px-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {topCategories.map((cat: any, idx: number) => {
            const isActive = activeCategory === cat.name;
            return (
              <div 
                key={idx} 
                onClick={() => scrollToSection(cat.name)}
                className="snap-start shrink-0 cursor-pointer flex flex-col w-48 transition-transform hover:-translate-y-1"
              >
                <div className="w-full aspect-[4/3] bg-gray-100 rounded-t-xl overflow-hidden relative border border-gray-200 border-b-0">
                  {cat.cover_image ? (
                    <img src={`${process.env.NEXT_PUBLIC_API_URL}${cat.cover_image}`} alt={cat.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-200"></div>
                  )}
                </div>
                <div className={`py-3 px-4 rounded-b-xl text-center font-medium border border-t-0 transition-colors ${
                  isActive 
                    ? 'bg-meewa-red text-white border-meewa-red' 
                    : 'bg-[#222222] text-white border-[#222222]'
                }`}>
                  {cat.name}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Arrow */}
        <button 
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 bg-white shadow-md rounded-full w-10 h-10 flex items-center justify-center text-gray-500 hover:text-meewa-red md:opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
        </button>
      </div>
    </section>
  );
}
