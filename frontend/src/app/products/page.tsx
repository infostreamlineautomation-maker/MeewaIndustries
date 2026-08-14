import { fetchServerSettings } from '@/lib/fetchSettings';
import { Metadata } from 'next';
import ProductGrid from '@/components/products/ProductGrid';
import ContactFaqSection from '@/components/landing/ContactFaqSection';

export const metadata: Metadata = {
  title: 'Our Products | MEEWA Industries',
  description: 'Explore our wide range of premium food packaging products.',
};

export default async function ProductsPage() {
  let settings: any = {};
  let dbProducts: any[] = [];
  try {
    const [resSet, resProd] = await Promise.all([
      fetchServerSettings(),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, { next: { revalidate: 10 } })
    ]);
    if (resSet.ok) settings = await resSet.json();
    if (resProd.ok) dbProducts = await resProd.json();
  } catch (e) {
    console.error("Could not fetch data:", e);
  }

  const defaultWhyFeatures = [
    { title: "Food Safe Materials", icon_url: "" },
    { title: "Leak Resistant Design", icon_url: "" },
    { title: "Eco-Friendly Options", icon_url: "" },
    { title: "Bulk Manufacturing", icon_url: "" },
    { title: "Global Export Standards", icon_url: "" },
    { title: "Custom Branding", icon_url: "" },
  ];

  const defaultBannerImages = [
    { image_url: "" },
    { image_url: "" },
    { image_url: "" },
    { image_url: "" }
  ];

  const whyFeatures = settings.categories_why_features?.length > 0 ? settings.categories_why_features : defaultWhyFeatures;
  const bannerImages = settings.categories_custom_banner_images?.length > 0 ? settings.categories_custom_banner_images : defaultBannerImages;

  return (
    <div className="bg-white min-h-screen pb-20">
      
      {/* 2. Products Grid */}
      <ProductGrid products={dbProducts} />

      {/* 3. Why Our Products? */}
      <section className="py-10 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-8 md:mb-12">
          <h2 className="text-[28px] sm:text-[32px] md:text-[40px] font-medium text-meewa-red leading-none tracking-normal mb-2 md:mb-6">{settings.categories_why_title || "Why Our Products?"}</h2>
          <p className="text-[12px] md:text-xl text-gray-600">{settings.categories_why_subtitle || "Built for Quality, Designed for Performance"}</p>
        </div>
        
        <div className="grid grid-cols-3 md:grid-cols-6 gap-y-6 md:gap-y-0 gap-x-2 md:gap-x-4 lg:gap-x-8 text-center mt-8 md:mt-12">
          {whyFeatures.map((feat: any, idx: number) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="w-11 h-11 md:w-16 md:h-16 bg-[#e5e7eb] rounded-full flex items-center justify-center mb-2 md:mb-4 shadow-sm">
                {feat.icon_url ? (
                  <img src={`${feat.icon_url?.startsWith('http') ? feat.icon_url : process.env.NEXT_PUBLIC_API_URL + feat.icon_url}`} alt={feat.title} className="w-5 h-5 md:w-8 md:h-8 object-contain" />
                ) : (
                  <svg className="w-5 h-5 md:w-8 md:h-8 text-[#9A1B1B]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.642 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.358-.166-2.001A11.954 11.954 0 0110 1.944zM13.707 8.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <h4 className="text-gray-900 font-medium text-[9px] md:text-sm leading-tight px-1">{feat.title}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Custom Packaging Banner */}
      <section className="py-10 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-[28px] sm:text-[32px] md:text-[40px] font-medium text-meewa-red leading-none tracking-normal mb-6 md:mb-12">{settings.categories_custom_banner_title || "Custom Packaging Banner"}</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-12 gap-3 md:gap-6">
          {bannerImages.map((banner: any, idx: number) => {
            // Mobile: 0 and 3 are full width (col-span-2), 1 and 2 are half width (col-span-1)
            // Desktop: Asymmetrical bento grid: 7/5 then 5/7
            let colSpanClass = "col-span-2 md:col-span-6"; 
            let heightClass = "h-48 md:h-[340px]";
            
            if (idx === 0) {
              colSpanClass = "col-span-2 md:col-span-7";
              heightClass = "h-[180px] sm:h-64 md:h-[340px]";
            } else if (idx === 1) {
              colSpanClass = "col-span-1 md:col-span-5";
              heightClass = "h-40 sm:h-56 md:h-[340px]";
            } else if (idx === 2) {
              colSpanClass = "col-span-1 md:col-span-5";
              heightClass = "h-40 sm:h-56 md:h-[340px]";
            } else if (idx === 3) {
              colSpanClass = "col-span-2 md:col-span-7";
              heightClass = "h-[180px] sm:h-64 md:h-[340px]";
            }

            return (
              <div key={idx} className={`w-full bg-gray-100 rounded-2xl md:rounded-3xl overflow-hidden shadow-sm ${colSpanClass} ${heightClass}`}>
                {banner.image_url ? (
                  <img src={`${banner.image_url?.startsWith('http') ? banner.image_url : process.env.NEXT_PUBLIC_API_URL + banner.image_url}`} alt="Custom Banner" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-200"></div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Contact & FAQs (Added for Products Page) */}
      <ContactFaqSection />

    </div>
  );
}
