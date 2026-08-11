"use client";

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import ContactFaqSection from '@/components/landing/ContactFaqSection';
import Link from 'next/link';

export default function ProductClientPage({ product, relatedProducts, settings }: any) {
  const containerRef = useRef<HTMLDivElement>(null);
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

  // Scroll-linked Animation
  const { scrollYProgress } = useScroll({ 
    target: containerRef, 
    offset: ["start start", "end end"] 
  });

  // Mobile Keyframes
  const mTop = useTransform(scrollYProgress, [0, 0.38, 0.77, 1], ["30%", "40%", "60%", "85%"]);
  const mLeft = useTransform(scrollYProgress, [0, 0.38, 0.77, 1], ["50%", "50%", "50%", "50%"]);
  const mRotate = useTransform(scrollYProgress, [0, 0.38, 0.77, 1], [-10, 5, -5, 0]);
  const mScale = useTransform(scrollYProgress, [0, 0.38, 0.77, 1], [0.7, 0.7, 0.7, 0.8]);

  // Desktop Keyframes
  const dTop = useTransform(scrollYProgress, [0, 0.38, 0.77, 1], ["45%", "50%", "70%", "85%"]);
  const dLeft = useTransform(scrollYProgress, [0, 0.38, 0.77, 1], ["75%", "46%", "25%", "50%"]);
  const dRotate = useTransform(scrollYProgress, [0, 0.38, 0.77, 1], [-15, 5, -10, 0]);
  const dScale = useTransform(scrollYProgress, [0, 0.38, 0.77, 1], [0.95, 0.95, 0.95, 0.9]);

  // Marquee text
  const marqueeText = product?.marquee_text || "Restaurants Hotels Cafés Bakeries Caterers Retail Stores Supermarkets Global Importers";
  const marqueeWords = marqueeText.split(' ').filter(Boolean);
  const bannerImages = Array.isArray(product?.banner_images) ? product.banner_images : [];

  const heroImage = product?.hero_animated_image ? `${product.hero_animated_image?.startsWith('http') ? product.hero_animated_image : process.env.NEXT_PUBLIC_API_URL + product.hero_animated_image}` : null;

  return (
    <div className="bg-white min-h-screen text-gray-900">
      
      {/* 1. Discrete Scroll Sections */}
      <div className="relative" ref={containerRef}>
        
        {/* Sticky Floating Image */}
        <div className="sticky top-0 h-screen w-full overflow-hidden pointer-events-none z-30 hidden md:block">
          {heroImage && (
            <motion.div 
              className="absolute w-[200px] h-[200px] md:w-[300px] md:h-[300px] lg:w-[400px] lg:h-[400px]"
              style={{ 
                x: "-50%", 
                y: "-50%",
                top: isMobile ? mTop : dTop,
                left: isMobile ? mLeft : dLeft,
                rotate: isMobile ? mRotate : dRotate,
                scale: isMobile ? mScale : dScale
              }}
            >
              <img 
                src={heroImage} 
                alt={product?.name} 
                className="w-full h-full object-contain drop-shadow-2xl mix-blend-multiply"
              />
            </motion.div>
          )}
        </div>

        {/* Scrolling Content Sections */}
        <div className="relative md:-mt-[100vh]">
          
          {/* Invisible Trigger for Section 0 */}
          <motion.div 
            onViewportEnter={() => setActiveSection(0)}
            viewport={{ margin: "-40% 0px -40% 0px" }}
            className="absolute top-0 w-full h-[80vh] pointer-events-none"
          />

          {/* Section 0: Title (Behind Banner) */}
          <div className="w-full h-auto pb-12 md:pb-0 md:h-[200vh]">
            <div className="md:sticky top-0 pt-32 md:pt-56 px-6 md:px-24 lg:px-32 md:h-screen flex flex-col justify-start z-10">
              <h1 className="text-5xl md:text-8xl lg:text-9xl font-black text-black leading-[1.1] tracking-tighter mb-6 mt-16 md:mt-0">
                {product?.name || "Food Service"}
              </h1>
              <h2 className="text-xl md:text-2xl font-extrabold text-black leading-tight max-w-sm">
                {product?.hero_description || "Discover premium quality of customizable cups"}
              </h2>

              {/* Mobile Static Image (Top) */}
              <div className="block md:hidden mt-8 w-full max-w-[250px] mx-auto pointer-events-none">
                {heroImage && (
                  <img src={heroImage} alt="Product" className="w-full h-auto drop-shadow-2xl mix-blend-multiply" />
                )}
              </div>
            </div>
          </div>

          {/* Banner Image Container */}
          <div id="banner-container" className="relative w-full overflow-hidden shadow-2xl bg-black z-20 md:-mt-[calc(100vh+8rem)]">
            {product?.section1_image ? (
              <img src={`${product.section1_image?.startsWith('http') ? product.section1_image : process.env.NEXT_PUBLIC_API_URL + product.section1_image}`} alt="Banner" className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 w-full h-full bg-gray-900" />
            )}
            
            {/* Dark gradient overlay for text readability */}
            <div className="absolute inset-0 bg-black/40" />
            
            {/* Banner Top (Cup in Middle, Text on Right) */}
            <motion.section 
              onViewportEnter={() => setActiveSection(1)}
              viewport={{ margin: "-40% 0px -40% 0px" }}
              className="relative h-[50vh] flex flex-row justify-end items-center px-6 md:px-24 lg:px-32"
            >
              {/* Right Side: Title */}
              <div className="max-w-xl text-right z-40">
                <h2 className="text-3xl md:text-5xl lg:text-7xl font-black text-white leading-tight drop-shadow-lg">
                  {product?.banner_title || "Get your customized coffee cup"}
                </h2>
              </div>
            </motion.section>

            {/* Banner Bottom (Text on Right, Cup on Left) */}
            <motion.section 
              onViewportEnter={() => setActiveSection(2)}
              viewport={{ margin: "-40% 0px -40% 0px" }}
              className="relative h-[50vh] flex flex-col justify-start items-end px-6 md:px-24 lg:px-32 pt-10"
            >
              <div className="max-w-xl text-right z-40">
                <p className="text-xl md:text-2xl text-white/90 font-medium mb-8 drop-shadow-md">
                  {product?.banner_subtitle || product?.short_description || "Hot, cold, frozen or fresh, our food service packaging works to keep every meal presentable and intact."}
                </p>
                <Link href="/contact" className="inline-flex items-center gap-2 font-bold bg-meewa-red text-white px-8 py-4 md:px-10 md:py-5 rounded-full hover:bg-red-700 transition-colors shadow-xl text-lg md:text-xl">
                  Order now <span className="text-xl md:text-2xl font-light">↗</span>
                </Link>
              </div>
            </motion.section>
          </div>

          {/* Section 0.5: Discover Text (Absolute, ON TOP of Banner, Pure White, Clipped) */}
          <div className="absolute top-0 left-0 w-full h-[200vh] pointer-events-none z-50 hidden md:block">
            <div className="w-full h-full" style={{ clipPath: "inset(calc(100vh - 8rem) 0 0 0)" }}>
              <div className="sticky top-0 pt-48 md:pt-56 px-6 md:px-24 lg:px-32 h-screen flex flex-col justify-start">
                <h1 className="text-5xl md:text-8xl lg:text-9xl font-black leading-[1.1] tracking-tighter mb-6 opacity-0">
                  {product?.name || "Food Service"}
                </h1>
                <h2 className="text-xl md:text-2xl font-extrabold leading-tight text-white max-w-sm drop-shadow-md">
                  {product?.hero_description || "Discover premium quality of customizable cups"}
                </h2>
              </div>
            </div>
          </div>

          {/* Mobile Static Image (Positioned at bottom of banner) */}
          <div className="block md:hidden relative w-full h-0 z-30 flex justify-center pointer-events-none">
             <div className="absolute top-0 -translate-y-1/2 w-48 h-48 drop-shadow-2xl">
               {heroImage && (
                  <img src={heroImage} alt="Product" className="w-full h-full object-contain mix-blend-multiply" />
               )}
             </div>
          </div>

          {/* Section 3: Dual Marquee Section */}
          <motion.section 
            onViewportEnter={() => setActiveSection(3)}
            viewport={{ margin: "-20% 0px -20% 0px" }}
            className="h-[30vh] flex flex-col justify-center border-y border-gray-100 overflow-hidden relative z-20"
          >
            {/* Clockwise (Left to Right) */}
            <div className="flex whitespace-nowrap mb-6 opacity-60">
              <motion.div 
                className="flex gap-8 text-3xl md:text-6xl font-black text-transparent [-webkit-text-stroke:2px_#cbd5e1]"
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
                className="flex gap-8 text-3xl md:text-6xl font-black text-transparent [-webkit-text-stroke:2px_#ee3050]"
                animate={{ x: [-1000, 0] }}
                transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
              >
                {[...marqueeWords, ...marqueeWords, ...marqueeWords, ...marqueeWords].reverse().map((word, idx) => (
                  <span key={`acw-${idx}`} className="px-4">{word}</span>
                ))}
              </motion.div>
            </div>
          </motion.section>

        </div>
      </div>

      {/* 3. Long Banners Section */}
      {bannerImages.length > 0 && (
        <section className="py-12 md:py-24 bg-white relative z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 md:space-y-12">
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
        <section className="py-12 md:py-24 bg-gray-50 relative z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-black border-b border-gray-200 pb-4 mb-12">Related Products</h2>
            
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
