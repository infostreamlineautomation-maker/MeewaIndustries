import { fetchServerSettings } from '@/lib/fetchSettings';
import { Metadata } from 'next';
import CategoriesTabs from '@/components/categories/CategoriesTabs';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Product Categories | MEEWA Industries',
  description: 'Explore our wide range of premium food packaging products.',
};

export default async function CategoriesPage() {
  let settings: any = {};
  let dbCategories: any[] = [];
  let dbProducts: any[] = [];
  try {
    const [resSet, resCat, resProd] = await Promise.all([
      fetchServerSettings(),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, { next: { revalidate: 10 } }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, { next: { revalidate: 10 } })
    ]);
    if (resSet.ok) settings = await resSet.json();
    if (resCat.ok) dbCategories = await resCat.json();
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
      <section className="relative w-full h-[500px] md:h-[600px] bg-gray-900">
        {settings.categories_hero_image_url ? (
          <img src={`${settings.categories_hero_image_url?.startsWith('http') ? settings.categories_hero_image_url : process.env.NEXT_PUBLIC_API_URL + settings.categories_hero_image_url}`} alt="Product Categories Hero" className="w-full h-full object-cover opacity-90" />
        ) : (
          <div className="w-full h-full bg-gray-300"></div>
        )}
        {/* Overlay to ensure header readability if needed, though header is solid red */}
        <div className="absolute inset-0 bg-black/10"></div>
      </section>

      {/* 2. Categories Tabs & Grid */}
      <CategoriesTabs categories={dbCategories} />

      <section className="pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {dbCategories.map((cat: any) => {
          const groupProducts = dbProducts.filter((p: any) => p.category_id === cat.id);
          if (groupProducts.length === 0) return null; // hide empty categories
          return (
            <div key={cat.id} id={`category-${cat.name.replace(/\s+/g, '-')}`} className="mb-16 scroll-mt-24">
              <h2 className="text-3xl font-bold text-gray-900 border-b border-gray-200 pb-2 mb-8">{cat.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                {groupProducts.map((prod: any) => (
                  <Link href={`/products/${prod.slug || '#'}`} key={prod.id} className="flex flex-col group cursor-pointer">
                    <div className="w-full aspect-[4/5] bg-gray-100 rounded-3xl overflow-hidden mb-4 shadow-sm group-hover:shadow-lg transition-shadow border border-gray-200">
                      {prod.cover_image ? (
                        <img src={`${prod.cover_image?.startsWith('http') ? prod.cover_image : process.env.NEXT_PUBLIC_API_URL + prod.cover_image}`} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full bg-gray-200"></div>
                      )}
                    </div>
                    <h4 className="text-meewa-red font-bold text-lg leading-tight">{cat.name}</h4>
                    <h3 className="text-gray-900 font-bold text-2xl leading-tight">{prod.name}</h3>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* 3. Why Our Products? */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-12">
          <h2 className="text-5xl font-bold text-meewa-red mb-3">{settings.categories_why_title || "Why Our Products?"}</h2>
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
        <h2 className="text-5xl font-bold text-meewa-red mb-8">{settings.categories_custom_banner_title || "Custom Packaging Banner"}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {bannerImages.map((banner: any, idx: number) => (
            <div key={idx} className="w-full aspect-[16/9] bg-gray-100 rounded-3xl overflow-hidden shadow-md">
              {banner.image_url ? (
                <img src={`${banner.image_url?.startsWith('http') ? banner.image_url : process.env.NEXT_PUBLIC_API_URL + banner.image_url}`} alt="Custom Banner" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-200"></div>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
