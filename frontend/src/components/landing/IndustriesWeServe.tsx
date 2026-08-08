import { fetchServerSettings } from '@/lib/fetchSettings';
import Image from 'next/image';

export default async function IndustriesWeServe() {
  let settings: any = {};
  try {
    const res = await fetchServerSettings();
    settings = await res.json();
  } catch(e) {}

  const industries = settings.landing_industries && settings.landing_industries.length > 0 
    ? settings.landing_industries 
    : [
      "Importers & Distributors",
      "Wholesale Suppliers",
      "Restaurants",
      "Cafés & Coffee Chains",
      "Hotels",
      "Catering Companies",
      "Food Delivery Brands",
      "Supermarkets",
      "Hospitality Businesses",
    ];

  return (
    <section className="py-24 bg-meewa-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-meewa-red mb-4">
            {settings.industries_title || "Industries We Serve"}
          </h2>
          <p className="text-gray-600 text-lg">
            Our disposable packaging products support businesses across multiple industries worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Collage (CSS Grid approximation of the design's masonry) */}
          <div className="grid grid-cols-2 gap-4 h-[600px]">
            <div className="space-y-4 h-full flex flex-col">
              <div className="bg-gray-200 rounded-lg h-2/5 w-full relative overflow-hidden shadow-sm">
                {settings.industries_image_1 ? (
                  <img src={`${settings.industries_image_1?.startsWith('http') ? settings.industries_image_1 : process.env.NEXT_PUBLIC_API_URL + settings.industries_image_1}`} alt="Restaurant" className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">Restaurant Image</div>
                )}
              </div>
              <div className="bg-gray-300 rounded-lg h-3/5 w-full relative overflow-hidden shadow-sm">
                {settings.industries_image_2 ? (
                  <img src={`${settings.industries_image_2?.startsWith('http') ? settings.industries_image_2 : process.env.NEXT_PUBLIC_API_URL + settings.industries_image_2}`} alt="Supermarket" className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">Supermarket Image</div>
                )}
              </div>
            </div>
            <div className="space-y-4 h-full flex flex-col pt-8">
              <div className="bg-gray-300 rounded-lg h-1/2 w-full relative overflow-hidden shadow-sm">
                {settings.industries_image_3 ? (
                  <img src={`${settings.industries_image_3?.startsWith('http') ? settings.industries_image_3 : process.env.NEXT_PUBLIC_API_URL + settings.industries_image_3}`} alt="Hotel" className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">Hotel Image</div>
                )}
              </div>
              <div className="bg-gray-200 rounded-lg h-1/2 w-full relative overflow-hidden shadow-sm">
                {settings.industries_image_4 ? (
                  <img src={`${settings.industries_image_4?.startsWith('http') ? settings.industries_image_4 : process.env.NEXT_PUBLIC_API_URL + settings.industries_image_4}`} alt="Coffee Chain" className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">Coffee Chain Image</div>
                )}
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-6 leading-tight whitespace-pre-line">
              {settings.industries_subtitle || "Food Packaging Solutions\nfor Every Industry"}
            </h3>
            <p className="text-xl font-medium text-gray-800 mb-6">We Serve:</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-gray-600">
              {industries.map((industry: string, idx: number) => (
                <li key={idx} className="flex items-center space-x-3">
                  <span className="w-1.5 h-1.5 bg-meewa-red rounded-full flex-shrink-0"></span>
                  <span>{industry}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}
