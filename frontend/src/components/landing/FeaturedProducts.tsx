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
    displayProducts = products.slice(0, 5);
  }

  return (
    <section className="pt-32 pb-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="max-w-2xl">
            <h2 className="text-[40px] md:text-[65px] font-medium text-meewa-red leading-none tracking-normal mb-4">Our Product</h2>
            <p className="text-gray-600 text-lg">
              Explore our wide range of food-grade disposable packaging solutions designed for restaurants, cafés, catering companies, and businesses worldwide.
            </p>
          </div>
          <div className="mt-6 md:mt-0">
            <Link href="/products" className="bg-meewa-red text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-red-700 transition-colors inline-block">
              View All Products
            </Link>
          </div>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {displayProducts.map((prod, idx) => (
            <Link href={`/products/${prod.slug}`} key={idx} className="group block">
              <div className="relative h-72 rounded-xl overflow-hidden shadow-sm bg-gray-100 border border-gray-200 mb-3">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url('${prod.cover_image?.startsWith('http') ? prod.cover_image : process.env.NEXT_PUBLIC_API_URL + (prod.cover_image || '')}')` }}
                ></div>
              </div>
              <h3 className="text-gray-900 font-semibold text-[1.1rem] px-1 group-hover:text-meewa-red transition-colors">{prod.name}</h3>
            </Link>
          ))}

          {/* CTA Card */}
          <div className="block">
            <div className="h-72 rounded-xl bg-[#FDF2F3] p-8 flex flex-col justify-center border border-red-100 shadow-sm mb-3">
              <h3 className="text-meewa-red text-2xl font-bold mb-4 leading-tight">Need something<br />specific?</h3>
              <p className="text-gray-800 text-sm mb-8">
                Share your sizes, artwork, and volumes — we quote within 48 hours with export-ready pricing.
              </p>
              <div>
                <Link href="/contact" className="bg-meewa-red text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-red-700 transition-colors inline-flex items-center">
                  Request a Quote
                  <svg className="w-4 h-4 ml-2 transform -rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </Link>
              </div>
            </div>
            {/* Invisible placeholder to maintain grid alignment with product text */}
            <h3 className="invisible font-semibold text-[1.1rem] px-1">Placeholder</h3>
          </div>

        </div>
      </div>
    </section>
  );
}
