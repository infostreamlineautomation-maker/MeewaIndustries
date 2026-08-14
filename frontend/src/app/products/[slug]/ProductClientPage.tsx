"use client";

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import ContactFaqSection from '@/components/landing/ContactFaqSection';
import Link from 'next/link';

export default function ProductClientPage({ product, relatedProducts, settings }: any) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const marqueeWrapperRef = useRef<HTMLDivElement>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [relatedPage, setRelatedPage] = useState(0);

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

  // Desktop breakpoints are measured from the actual rendered banner/marquee sections
  // (not guessed) so settle A always lands inside the banner and settle B inside the marquee,
  // regardless of real section heights. Each settle gets a start+end pair with identical output
  // values (a hold), and the approach into settle B is spread across two points so the zoom
  // ramps gradually instead of jumping in one step.
  const [dBreakpoints, setDBreakpoints] = useState<number[]>([0, 0.15, 0.3, 0.45, 0.6, 0.75, 1]);

  useEffect(() => {
    function measure() {
      if (!containerRef.current || !bannerRef.current || !marqueeWrapperRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const bannerRect = bannerRef.current.getBoundingClientRect();
      const marqueeRect = marqueeWrapperRef.current.getBoundingClientRect();
      const totalHeight = containerRect.height;
      if (totalHeight <= 0) return;

      const bannerStart = (bannerRect.top - containerRect.top) / totalHeight;
      const bannerHeightFrac = bannerRect.height / totalHeight;
      const marqueeStart = (marqueeRect.top - containerRect.top) / totalHeight;
      const marqueeHeightFrac = marqueeRect.height / totalHeight;

      const clamp = (v: number) => Math.min(1, Math.max(0, v));
      const next = [
        0,
        clamp(bannerStart * 0.7),
        clamp(bannerStart + bannerHeightFrac * 0.4),
        clamp(bannerStart + bannerHeightFrac * 0.8),
        clamp(marqueeStart + marqueeHeightFrac * 0.15),
        clamp(marqueeStart + marqueeHeightFrac * 0.45),
        1,
      ];
      // Guard against degenerate/non-monotonic measurements (e.g. mid-hydration)
      for (let i = 1; i < next.length; i++) {
        if (next[i] <= next[i - 1]) next[i] = next[i - 1] + 0.001;
      }
      setDBreakpoints(next);
    }
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [product]);

  // Desktop Keyframes — hero (top-right) -> settle A in banner (hold) -> gradual zoom -> settle B centered on marquee (hold)
  const springConfig = { stiffness: 60, damping: 15, mass: 1 };
  const dTopRaw = useTransform(scrollYProgress, dBreakpoints, ["50%", "55%", "68%", "68%", "58%", "50%", "50%"]);
  const dLeftRaw = useTransform(scrollYProgress, dBreakpoints, ["75%", "40%", "28%", "28%", "38%", "50%", "50%"]);
  const dRotateRaw = useTransform(scrollYProgress, dBreakpoints, [-12, -12, -8, -8, 4, 0, 0]);
  const dScaleRaw = useTransform(scrollYProgress, dBreakpoints, [1.1, 0.78, 0.72, 0.72, 0.85, 0.92, 0.92]);
  const dTop = useSpring(dTopRaw, springConfig);
  const dLeft = useSpring(dLeftRaw, springConfig);
  const dRotate = useSpring(dRotateRaw, springConfig);
  const dScale = useSpring(dScaleRaw, springConfig);

  // Marquee text
  const marqueeText = product?.marquee_text || "Restaurants Hotels Cafés Bakeries Caterers Retail Stores Supermarkets Global Importers";
  const marqueeWords = marqueeText.split(' ').filter(Boolean);
  const bannerImages = Array.isArray(product?.banner_images) ? product.banner_images : [];

  const heroImage = product?.hero_animated_image ? `${product.hero_animated_image?.startsWith('http') ? product.hero_animated_image : process.env.NEXT_PUBLIC_API_URL + product.hero_animated_image}` : null;

  const relItemsPerPage = isMobile ? 3 : 4;
  const totalRelPages = Math.ceil((relatedProducts?.length || 0) / relItemsPerPage);
  const currentRelProducts = relatedProducts ? relatedProducts.slice(relatedPage * relItemsPerPage, (relatedPage + 1) * relItemsPerPage) : [];

  const handleNextRelPage = () => setRelatedPage((p) => (p + 1) % totalRelPages);
  const handlePrevRelPage = () => setRelatedPage((p) => (p - 1 + totalRelPages) % totalRelPages);

  return (
    <div className="bg-white min-h-screen text-gray-900 font-sans">
      
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
          <div className="w-full h-auto pb-0 md:pb-0 md:h-[calc(200vh-20rem)]">
            <div className="md:sticky top-0 pt-24 md:pt-[30vh] px-6 md:px-24 lg:px-32 md:h-screen flex flex-col justify-start">
              <h1 className="text-5xl md:text-8xl lg:text-9xl font-bold text-black leading-[1.1] tracking-tighter mb-4 md:mb-6 md:mt-0">
                {product?.name || "Food Service"}
              </h1>
              <h2 className="text-xl md:text-2xl font-semibold text-black leading-tight max-w-sm">
                {product?.hero_description || "Discover premium quality of customizable cups"}
              </h2>

              {/* Mobile Static Image (Top) - Bridging the gap */}
              <div className="block md:hidden mt-8 -mb-32 w-full max-w-[280px] mx-auto pointer-events-none relative z-30">
                {heroImage && (
                  <img src={heroImage} alt="Product" className="w-full h-auto drop-shadow-2xl mix-blend-multiply" />
                )}
              </div>
            </div>
          </div>

          {/* Banner Image Container */}
          <div id="banner-container" ref={bannerRef} className="relative w-full overflow-hidden shadow-2xl bg-black z-20 md:-mt-[calc(100vh-12rem)]">
            {product?.section1_image ? (
              <img src={`${product.section1_image?.startsWith('http') ? product.section1_image : process.env.NEXT_PUBLIC_API_URL + product.section1_image}`} alt="Banner" className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 w-full h-full bg-gray-900" />
            )}
            
            {/* Dark gradient overlay for text readability */}
            <div className="absolute inset-0 bg-black/40" />
            
            {/* Banner Content (Text on Right) */}
            <motion.section 
              onViewportEnter={() => setActiveSection(1)}
              viewport={{ margin: "-40% 0px -40% 0px" }}
              className="relative h-auto pt-32 pb-8 md:py-0 md:h-[120vh] flex flex-col justify-start md:justify-center items-start md:items-end px-6 md:px-24 lg:px-32"
            >
              <div className="max-w-xl text-left md:text-right z-40 flex flex-col items-start md:items-end gap-6">
                <motion.h2 
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, margin: "-50px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight drop-shadow-lg break-words"
                >
                  {product?.banner_title || "Get your customized coffee cup"}
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, margin: "-50px" }}
                  transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                  className="text-xl md:text-2xl text-white/90 font-medium drop-shadow-md max-w-lg"
                >
                  {product?.banner_subtitle || product?.short_description || "Hot, cold, frozen or fresh, our food service packaging works to keep every meal presentable and intact."}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, margin: "-50px" }}
                  transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                >
                  <Link href="/contact" className="inline-flex items-center gap-2 font-bold bg-meewa-red text-white px-8 py-4 md:px-10 md:py-5 rounded-full hover:bg-red-700 transition-colors shadow-xl text-lg md:text-xl mt-4">
                    Order now <span className="text-xl md:text-2xl font-light">↗</span>
                  </Link>
                </motion.div>
              </div>
            </motion.section>

            {/* Description Component (Bottom Left) */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: "-50px" }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              className="relative md:absolute mt-4 md:mt-0 pb-40 md:pb-0 md:top-auto md:bottom-[40vh] left-6 md:left-24 lg:left-32 z-40 max-w-[16rem] md:max-w-sm lg:max-w-md"
            >
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight drop-shadow-md">
                Premium Quality Materials
              </h3>
              <ul className="space-y-3">
                {[
                  "100% Recyclable & Eco-Friendly",
                  "Double-wall insulation",
                  "Custom branding available",
                  "Available in 8oz to 24oz sizes"
                ].map((point, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/90 text-lg font-medium drop-shadow-md">
                    <span className="text-meewa-red font-bold text-xl">✓</span>
                    {point}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Section 0.5: Discover Text (Absolute, ON TOP of Banner, Pure White, Clipped) */}
          <div className="absolute top-0 left-0 w-full h-[calc(200vh-20rem)] pointer-events-none z-50 hidden md:block">
            <div className="w-full h-full" style={{ clipPath: "inset(calc(100vh - 8rem) 0 0 0)" }}>
              <div className="sticky top-0 pt-48 md:pt-[30vh] px-6 md:px-24 lg:px-32 h-screen flex flex-col justify-start">
                <h1 className="text-5xl md:text-8xl lg:text-9xl font-bold leading-[1.1] tracking-tighter mb-6 opacity-0">
                  {product?.name || "Food Service"}
                </h1>
                <h2 className="text-xl md:text-2xl font-semibold leading-tight text-white max-w-sm drop-shadow-md">
                  {product?.hero_description || "Discover premium quality of customizable cups"}
                </h2>
              </div>
            </div>
          </div>

          {/* Mobile Static Image (Positioned at bottom of banner) */}
          <div className="block md:hidden relative w-full h-0 z-30 flex justify-center pointer-events-none">
             <div className="absolute top-0 -translate-y-3/4 w-48 h-48 drop-shadow-2xl">
               {heroImage && (
                  <img src={heroImage} alt="Product" className="w-full h-full object-contain mix-blend-multiply" />
               )}
             </div>
          </div>

          {/* Section 3: Solid Theme Color Section with Marquee */}
          <div ref={marqueeWrapperRef} className="relative -mt-[5vh] md:-mt-[15vh]">
            <div className="absolute inset-0 bg-meewa-red z-[25]"></div>
            <motion.section
              onViewportEnter={() => setActiveSection(3)}
              viewport={{ margin: "-20% 0px -20% 0px" }}
              className="relative z-40 flex flex-col justify-center overflow-hidden pt-24 pb-16 md:py-[40vh]"
            >
              {/* Clockwise (Left to Right) */}
              <div className="flex whitespace-nowrap mb-6 opacity-80">
                <motion.div
                  className="flex gap-8 text-4xl md:text-7xl font-bold text-transparent [-webkit-text-stroke:2px_white]"
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
                  className="flex gap-8 text-4xl md:text-7xl font-bold text-white"
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
      </div>

      {/* 3. Long Banners Section */}
      {bannerImages.length > 0 && (
        <section className="bg-white relative z-20 flex flex-col">
          {bannerImages.map((bannerUrl: string, idx: number) => (
            <div key={idx} className="w-full">
              <img src={`${bannerUrl?.startsWith('http') ? bannerUrl : process.env.NEXT_PUBLIC_API_URL + bannerUrl}`} alt="Product Banner" className="w-full h-auto object-cover" />
            </div>
          ))}
        </section>
      )}

      {/* 4. Related Products Section */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section className="py-12 md:py-24 bg-gray-50 relative z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-[28px] sm:text-[32px] md:text-[60px] font-medium text-meewa-red text-center leading-none tracking-normal mb-6 md:mb-16">Related Products</h2>
            
            <div className="relative">
              <div className={`grid grid-cols-3 gap-x-2 gap-y-6 md:gap-x-8 md:gap-y-12 ${currentRelProducts.length < 4 ? 'lg:flex lg:justify-center' : 'lg:grid-cols-4'}`}>
                {currentRelProducts.map((relProduct: any) => (
                  <Link href={`/products/${relProduct.slug || '#'}`} key={relProduct.id} className={`flex flex-col group cursor-pointer ${currentRelProducts.length < 4 ? 'lg:w-[calc(25%-1.5rem)]' : ''}`}>
                    <div className="w-full aspect-[4/5] bg-gray-100 rounded-lg md:rounded-3xl overflow-hidden mb-2 md:mb-4 shadow-sm group-hover:shadow-lg transition-shadow border border-gray-200 relative">
                      {relProduct.cover_image ? (
                        <img 
                          src={`${relProduct.cover_image?.startsWith('http') ? relProduct.cover_image : process.env.NEXT_PUBLIC_API_URL + relProduct.cover_image}`} 
                          alt={relProduct.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200"></div>
                      )}
                    </div>
                    <h3 className="text-gray-900 font-bold text-[12px] md:text-2xl leading-tight text-center px-1 md:px-2">{relProduct.name}</h3>
                  </Link>
                ))}
              </div>

              {/* Floating Pagination Arrows */}
              {totalRelPages > 1 && (
                <>
                  <button 
                    onClick={handlePrevRelPage}
                    className="absolute -left-3 md:-left-12 lg:-left-16 top-[40%] -translate-y-1/2 z-10 bg-white shadow-xl border border-gray-100 rounded-full w-8 h-8 md:w-14 md:h-14 flex items-center justify-center text-gray-500 hover:text-meewa-red hover:scale-110 transition-all opacity-80 hover:opacity-100"
                    aria-label="Previous Page"
                  >
                    <svg className="w-5 h-5 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
                  </button>
                  <button 
                    onClick={handleNextRelPage}
                    className="absolute -right-3 md:-right-12 lg:-right-16 top-[40%] -translate-y-1/2 z-10 bg-white shadow-xl border border-gray-100 rounded-full w-8 h-8 md:w-14 md:h-14 flex items-center justify-center text-gray-500 hover:text-meewa-red hover:scale-110 transition-all opacity-80 hover:opacity-100"
                    aria-label="Next Page"
                  >
                    <svg className="w-5 h-5 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path></svg>
                  </button>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 5. Contact & FAQ Section */}
      <div className="relative z-20">
        <ContactFaqSection isProductPage={true} productName={product.name} />
      </div>

    </div>
  );
}
