import { fetchServerSettings } from '@/lib/fetchSettings';
import { Metadata } from 'next';
import ProductGrid from '@/components/products/ProductGrid';

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
    { image_url: "" }
  ];

  const whyFeatures = settings.categories_why_features?.length > 0 ? settings.categories_why_features : defaultWhyFeatures;
  const bannerImages = settings.categories_custom_banner_images?.length > 0 ? settings.categories_custom_banner_images : defaultBannerImages;

  return (
    <div className="bg-white min-h-screen pb-20">
      
      {/* 1. Hero Section (Image Behind Header) */}
      <section className="relative w-full h-[300px] md:h-[400px] bg-gray-900">
        {settings.categories_hero_image_url ? (
          <img src={`${settings.categories_hero_image_url?.startsWith('http') ? settings.categories_hero_image_url : process.env.NEXT_PUBLIC_API_URL + settings.categories_hero_image_url}`} alt="Products Hero" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-300"></div>
        )}
      </section>

      {/* 2. Products Grid */}
      <ProductGrid products={dbProducts} />

      {/* 3. Why Our Products? */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-meewa-red mb-3">{settings.categories_why_title || "Why Our Products?"}</h2>
          <p className="text-xl text-gray-600">{settings.categories_why_subtitle || "Built for Quality, Designed for Performance"}</p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-8 md:gap-12 text-center">
          {whyFeatures.map((feat: any, idx: number) => (
            <div key={idx} className="flex flex-col items-center w-28 md:w-36">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4 shadow-sm">
                {feat.icon_url ? (
                  <img src={`${feat.icon_url?.startsWith('http') ? feat.icon_url : process.env.NEXT_PUBLIC_API_URL + feat.icon_url}`} alt={feat.title} className="w-8 h-8 object-contain" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-meewa-red flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                )}
              </div>
              <h4 className="text-gray-900 font-medium text-sm leading-tight">{feat.title}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Custom Packaging Banner */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-5xl font-bold text-meewa-red mb-8">{settings.categories_custom_banner_title || "Custom Packaging Banner"}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
          {bannerImages.map((banner: any, idx: number) => {
            // Asymmetrical bento grid: 7/5 then 5/7
            let colSpanClass = "md:col-span-6"; 
            if (idx === 0) colSpanClass = "md:col-span-7";
            else if (idx === 1) colSpanClass = "md:col-span-5";
            else if (idx === 2) colSpanClass = "md:col-span-5";
            else if (idx === 3) colSpanClass = "md:col-span-7";

            return (
              <div key={idx} className={`w-full h-64 md:h-[340px] bg-gray-100 rounded-3xl overflow-hidden shadow-sm ${colSpanClass}`}>
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

    </div>
  );
}
