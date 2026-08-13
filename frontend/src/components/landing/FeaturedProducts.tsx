import Link from 'next/link';

export default async function FeaturedProducts() {
  let products: any[] = [];
  let featuredProductIds: number[] = [];

  try {
    const [productsRes, settingsRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, { next: { revalidate: 10 } }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings`, { next: { revalidate: 10 } })
    ]);

    if (productsRes.ok) {
      products = await productsRes.json();
    }
    if (settingsRes.ok) {
      const settings = await settingsRes.json();
      featuredProductIds = settings.landing_featured_products || [];
    }
  } catch (e) {
    console.error("Could not fetch data for FeaturedProducts:", e);
  }

  // Filter and order based on settings, or fallback to first 5 products
  let displayProducts = [];
  if (featuredProductIds.length > 0) {
    displayProducts = featuredProductIds
      .map(id => products.find(p => p.id === id))
      .filter(p => p !== undefined);
  } else {
    displayProducts = products.slice(0, 6);
  }

  return (
    <section className="pt-32 pb-4 md:pb-4 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Section */}
        <div className="mb-6 md:mb-12">
          <div className="flex flex-row items-center justify-between mb-3 md:mb-4">
            <h2 className="text-[24px] sm:text-[28px] md:text-[40px] font-medium text-meewa-red leading-none tracking-normal">Our Products</h2>
            <Link href="/products" className="bg-meewa-red text-white px-3 py-1.5 md:px-6 md:py-2 rounded-full text-[10px] md:text-sm font-medium hover:bg-red-700 transition-colors inline-block whitespace-nowrap ml-4">
              View All Products
            </Link>
          </div>
          <p className="text-gray-600 text-[11px] md:text-lg max-w-2xl leading-relaxed md:leading-relaxed">
            Explore our wide range of food-grade disposable packaging solutions designed for restaurants, cafés, catering companies, and businesses worldwide.
          </p>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-6 md:gap-6 mb-8 lg:mb-0">

          {displayProducts.map((prod, idx) => (
            <Link href={`/products/${prod.slug}`} key={idx} className={`group block ${idx === 5 ? 'lg:hidden' : ''}`}>
              <div className="relative aspect-square md:aspect-auto md:h-72 rounded-lg md:rounded-xl overflow-hidden shadow-sm bg-gray-100 border border-gray-200 mb-2 md:mb-3">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url('${prod.cover_image?.startsWith('http') ? prod.cover_image : process.env.NEXT_PUBLIC_API_URL + (prod.cover_image || '')}')` }}
                ></div>
              </div>
              <h3 className="text-gray-900 font-medium md:font-bold md:text-lg px-0.5 md:px-1 leading-tight group-hover:text-meewa-red transition-colors">{prod.name}</h3>
            </Link>
          ))}

          {/* Desktop CTA Card - Integrated into grid (hidden on mobile) */}
          <div className="hidden lg:flex w-full md:h-72">
            <div className="w-full h-full rounded-xl bg-[#FDF2F3] p-8 flex flex-col justify-center border border-red-100 shadow-sm">
              <h3 className="text-meewa-red text-[22px] font-medium mb-3 leading-snug pr-4">Need something specific?</h3>
              <p className="text-gray-800 text-sm mb-6 leading-relaxed">
                Share your sizes, artwork, and volumes — we quote within 48 hours with export-ready pricing.
              </p>
              <div>
                <Link href="/contact" className="bg-meewa-red text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-red-700 transition-colors inline-flex items-center">
                  Request a Quote
                  <svg className="w-4 h-4 ml-1.5 transform -rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* CTA Card - Full Width Below Products (hidden on desktop) */}
        <div className="w-full lg:hidden">
          <div className="w-full rounded-xl bg-[#FDF2F3] p-6 flex flex-col justify-center border border-red-100 shadow-sm">
            <h3 className="text-meewa-red text-[20px] font-medium mb-2 leading-tight">Need something specific?</h3>
            <p className="text-gray-800 text-[11.5px] mb-6 max-w-3xl leading-relaxed">
              Share your sizes, artwork, and volumes — we quote within 48 hours with export-ready pricing.
            </p>
            <div>
              <Link href="/contact" className="bg-meewa-red text-white px-5 py-2.5 rounded-full text-[11px] font-medium hover:bg-red-700 transition-colors inline-flex items-center">
                Request a Quote
                <svg className="w-3.5 h-3.5 ml-1.5 transform -rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
