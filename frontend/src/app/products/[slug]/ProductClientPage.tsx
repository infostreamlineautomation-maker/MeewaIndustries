"use client";

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ContactFaqSection from '@/components/landing/ContactFaqSection';
import Link from 'next/link';

export default function ProductClientPage({ product, relatedProducts, settings }: any) {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (product?.specs?.available_colors?.length > 0) {
      setSelectedColor(product.specs.available_colors[0]);
    }
    if (product?.specs?.available_sizes?.length > 0) {
      setSelectedSize(product.specs.available_sizes[0]);
    }
  }, [product]);

  // Image Discrete States
  const imageStates = isMobile ? [
    { top: "20%", left: "50%", rotate: -10, scale: 0.9 }, // 0: Title
    { top: "20%", left: "50%", rotate: 5, scale: 0.7 },   // 1: Specs
    { top: "20%", left: "50%", rotate: -5, scale: 0.7 },  // 2: CTA
  ] : [
    { top: "55%", left: "75%", rotate: -15, scale: 1.2 }, // 0: Title
    { top: "55%", left: "65%", rotate: 5, scale: 0.8 },   // 1: Specs
    { top: "55%", left: "25%", rotate: -10, scale: 0.8 }, // 2: CTA
  ];

  // Marquee text
  const marqueeText = product?.marquee_text || "Restaurants Hotels Cafés Bakeries Caterers Retail Stores Supermarkets Global Importers";
  const marqueeWords = marqueeText.split(' ').filter(Boolean);
  const bannerImages = Array.isArray(product?.banner_images) ? product.banner_images : [];

  const heroImage = product?.hero_animated_image ? `${product.hero_animated_image?.startsWith('http') ? product.hero_animated_image : process.env.NEXT_PUBLIC_API_URL + product.hero_animated_image}` : null;

  return (
    <div className="bg-white min-h-screen text-gray-900">
      
      {/* 1. Discrete Scroll Sections */}
      <div className="relative">
        
        {/* Sticky Floating Image */}
        <div className="sticky top-0 h-screen w-full overflow-hidden pointer-events-none z-10">
          {heroImage && (
            <motion.div 
              className="absolute w-[200px] h-[200px] md:w-[300px] md:h-[300px] lg:w-[400px] lg:h-[400px]"
              animate={imageStates[activeSection]}
              transition={{ type: "spring", stiffness: 60, damping: 20 }}
              style={{ x: "-50%", y: "-50%" }}
            >
              <motion.div 
                animate={{ y: [0, -25, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-full h-full"
              >
                <img 
                  src={heroImage} 
                  alt={product?.name} 
                  className="w-full h-full object-contain drop-shadow-2xl mix-blend-multiply"
                />
              </motion.div>
            </motion.div>
          )}
        </div>

        {/* Scrolling Content Sections */}
        <div className="relative z-20 -mt-[100vh]">
          
          {/* Section 0: Title */}
          <motion.section 
            onViewportEnter={() => setActiveSection(0)}
            viewport={{ margin: "-40% 0px -40% 0px" }}
            className="min-h-screen flex items-end md:items-center pb-20 md:pb-0 px-8 md:px-24 lg:px-32"
          >
            <div className="max-w-3xl pt-20">
              <h4 className="text-meewa-red font-bold text-sm md:text-lg tracking-widest mb-4 mt-[40vh] md:mt-0">
                {product?.category?.name || "Premium Product"}
              </h4>
              <h1 className="text-6xl md:text-8xl font-black text-black leading-[1.1] tracking-tighter mb-6">
                {product?.name}
              </h1>
              {product?.hero_description && (
                <p className="text-xl md:text-2xl text-gray-600 font-medium leading-relaxed max-w-xl">
                  {product.hero_description}
                </p>
              )}
            </div>
          </motion.section>

          {/* Section 1: Description & Specs */}
          <motion.section 
            onViewportEnter={() => setActiveSection(1)}
            viewport={{ margin: "-40% 0px -40% 0px" }}
            className="min-h-screen flex items-end md:items-center pb-20 md:pb-0 px-8 md:px-24 lg:px-32"
          >
            <div className="max-w-xl bg-white/80 md:bg-white/50 backdrop-blur-md p-8 rounded-3xl shadow-sm border border-gray-100">
              <p className="text-xl md:text-2xl text-gray-600 font-medium mb-10 leading-relaxed text-left">
                {product?.short_description || "Reliable takeaway containers designed to keep food fresh during transport and delivery."}
              </p>
              
              <div className="space-y-8">
                {product?.specs?.available_colors && product.specs.available_colors.length > 0 && (
                  <div className="flex flex-col items-start">
                    <p className="font-bold uppercase text-xs tracking-[0.2em] mb-3 text-black">Available In:</p>
                    <div className="flex flex-wrap gap-2 justify-start">
                      {product.specs.available_colors.map((color: string, i: number) => (
                        <button 
                          key={i} 
                          onClick={() => setSelectedColor(color)}
                          className={`border rounded px-4 py-2 text-sm font-semibold transition-all ${
                            selectedColor === color 
                              ? 'border-meewa-red text-meewa-red bg-red-50 ring-1 ring-meewa-red' 
                              : 'border-gray-200 text-gray-600 hover:border-gray-400 hover:bg-gray-50'
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {product?.specs?.available_sizes && product.specs.available_sizes.length > 0 && (
                  <div className="flex flex-col items-start">
                    <p className="font-bold uppercase text-xs tracking-[0.2em] mb-3 text-black">Available Sizes:</p>
                    <div className="flex flex-wrap gap-2 justify-start">
                      {product.specs.available_sizes.map((size: string, i: number) => (
                        <button 
                          key={i} 
                          onClick={() => setSelectedSize(size)}
                          className={`border rounded px-4 py-2 text-sm font-semibold transition-all ${
                            selectedSize === size 
                              ? 'border-meewa-red text-meewa-red bg-red-50 ring-1 ring-meewa-red' 
                              : 'border-gray-200 text-gray-600 hover:border-gray-400 hover:bg-gray-50'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.section>
          
          {/* Section 2: CTA & Stats */}
          <motion.section 
            onViewportEnter={() => setActiveSection(2)}
            viewport={{ margin: "-40% 0px -40% 0px" }}
            className="min-h-screen flex items-end md:items-center justify-start md:justify-end pb-20 md:pb-0 px-8 md:px-24 lg:px-32"
          >
            <div className="max-w-xl flex flex-col items-start bg-white/80 md:bg-white/50 backdrop-blur-md p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-4xl md:text-5xl font-black mb-8 text-black leading-tight">
                Ready to elevate your packaging?
              </h2>
              <div className="flex gap-6 mb-8">
                {product?.moq && (
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-widest mb-1 font-bold">Minimum Order</p>
                    <p className="text-black font-black text-2xl">{product.moq}</p>
                  </div>
                )}
                {product?.price_from && (
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-widest mb-1 font-bold">Price From</p>
                    <p className="text-black font-black text-2xl">{product.price_from}</p>
                  </div>
                )}
              </div>
              <Link href={`/contact?product=${product?.id}`} className="bg-meewa-red text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-red-700 transition-colors shadow-lg hover:shadow-meewa-red/30">
                Request a Quote
              </Link>
            </div>
          </motion.section>

        </div>
      </div>

      {/* 2. Dual Marquee Section */}
      <section className="py-12 bg-white border-y border-gray-100 overflow-hidden relative z-20">
        {/* Clockwise (Left to Right) */}
        <div className="flex whitespace-nowrap mb-6 opacity-60">
          <motion.div 
            className="flex gap-8 text-4xl md:text-6xl font-black text-transparent [-webkit-text-stroke:2px_#cbd5e1]"
            animate={{ x: [0, -1000] }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          >
            {[...marqueeWords, ...marqueeWords, ...marqueeWords, ...marqueeWords].map((word, idx) => (
              <span key={`cw-${idx}`} className="px-4">{word}</span>
            ))}
          </motion.div>
        </div>
        {/* Anti-clockwise (Right to Left) */}
        <div className="flex whitespace-nowrap">
          <motion.div 
            className="flex gap-8 text-4xl md:text-6xl font-black text-transparent [-webkit-text-stroke:2px_#ee3050]"
            animate={{ x: [-1000, 0] }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          >
            {[...marqueeWords, ...marqueeWords, ...marqueeWords, ...marqueeWords].reverse().map((word, idx) => (
              <span key={`acw-${idx}`} className="px-4">{word}</span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 3. Long Banners Section */}
      {bannerImages.length > 0 && (
        <section className="py-24 bg-white relative z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            {bannerImages.map((bannerUrl: string, idx: number) => (
              <div key={idx} className="w-full rounded-3xl overflow-hidden shadow-sm border border-gray-100">
                <img src={`${bannerUrl?.startsWith('http') ? bannerUrl : process.env.NEXT_PUBLIC_API_URL + bannerUrl}`} alt="Product Banner" className="w-full h-auto object-cover" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. Related Products Section */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section className="py-24 bg-gray-50 relative z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-black border-b border-gray-200 pb-4 mb-12">Related Products</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedProducts.map((relProduct: any) => (
                <Link href={`/products/${relProduct.slug}`} key={relProduct.id} className="flex flex-col group cursor-pointer">
                  <div className="w-full aspect-[4/5] bg-white rounded-3xl overflow-hidden mb-6 shadow-sm group-hover:shadow-xl transition-all duration-300 border border-gray-200 p-6 flex items-center justify-center">
                    {relProduct.cover_image ? (
                      <img 
                        src={`${relProduct.cover_image?.startsWith('http') ? relProduct.cover_image : process.env.NEXT_PUBLIC_API_URL + relProduct.cover_image}`} 
                        alt={relProduct.name} 
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" 
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-2xl text-gray-400">No Image</div>
                    )}
                  </div>
                  <h4 className="text-meewa-red font-bold text-sm tracking-widest uppercase mb-1">{relProduct.category?.name || "Product"}</h4>
                  <h3 className="text-black font-bold text-2xl leading-tight group-hover:text-meewa-red transition-colors">{relProduct.name}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. Contact & FAQ Section */}
      <div className="relative z-20">
        <ContactFaqSection />
      </div>

    </div>
  );
}
