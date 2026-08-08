import Link from 'next/link';

export default async function ProductCategories() {
  let categories: any[] = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, { next: { revalidate: 10 } });
    if (res.ok) {
      categories = await res.json();
    }
  } catch (e) {
    console.error("Could not fetch categories:", e);
  }

  // Only show the first 6 categories on the landing page
  const displayCategories = categories.slice(0, 6);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-bold text-meewa-red mb-4">Product Categories</h2>
            <p className="text-gray-600 text-lg">
              Explore our wide range of food-grade disposable packaging solutions designed for restaurants, cafés, catering companies, and businesses worldwide.
            </p>
          </div>
          <div className="mt-6 md:mt-0">
            <Link href="/categories" className="bg-meewa-red text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-red-700 transition-colors inline-block">
              View All Products
            </Link>
          </div>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {displayCategories.map((cat, idx) => (
            <Link href={`/categories#category-${cat.name.replace(/\s+/g, '-')}`} key={idx} className="relative h-80 rounded-xl overflow-hidden group shadow-sm bg-gray-100 block">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url('${cat.cover_image?.startsWith('http') ? cat.cover_image : process.env.NEXT_PUBLIC_API_URL + (cat.cover_image || '')}')` }}
              ></div>
              
              {/* Bottom Dark Label */}
              <div className="absolute bottom-0 inset-x-0 h-16 bg-meewa-dark/90 flex items-center px-6">
                <h3 className="text-white font-medium text-xl">{cat.name}</h3>
              </div>
            </Link>
          ))}

          {/* CTA Card */}
          <div className="h-80 rounded-xl bg-[#FDF2F3] p-8 flex flex-col justify-center border border-red-100 shadow-sm">
            <h3 className="text-meewa-red text-2xl font-bold mb-4 leading-tight">Need something<br/>specific?</h3>
            <p className="text-gray-800 text-sm mb-8">
              Share your sizes, artwork, and volumes — we quote within 48 hours with export-ready pricing.
            </p>
            <div>
              <Link href="/quote" className="bg-meewa-red text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-red-700 transition-colors inline-flex items-center">
                Request a Quote
                <svg className="w-4 h-4 ml-2 transform -rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
