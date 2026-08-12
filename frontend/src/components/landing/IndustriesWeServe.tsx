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
    <section className="py-12 bg-meewa-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h2 className="text-[40px] md:text-[65px] font-medium text-meewa-red leading-none tracking-normal mb-4">
            {settings.industries_title || "Industries We Serve"}
          </h2>
          <p className="text-gray-600 text-lg">
            Our disposable packaging products support businesses across multiple industries worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Collage (CSS Grid approximation of the design's masonry) */}
          <div className="grid grid-cols-3 gap-2 max-w-2xl mx-auto lg:mx-0">
            {/* Col 1 */}
            <div className="flex flex-col gap-2">
              <div className="bg-gray-200 w-full aspect-square relative overflow-hidden shadow-sm">
                {settings.industries_image_1 ? (
                  <img src={`${settings.industries_image_1?.startsWith('http') ? settings.industries_image_1 : process.env.NEXT_PUBLIC_API_URL + settings.industries_image_1}`} alt="Cafe/Restaurant" className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs text-center p-2">Cafe/Restaurant</div>
                )}
              </div>
              <div className="bg-gray-300 w-full aspect-square relative overflow-hidden shadow-sm">
                {settings.industries_image_2 ? (
                  <img src={`${settings.industries_image_2?.startsWith('http') ? settings.industries_image_2 : process.env.NEXT_PUBLIC_API_URL + settings.industries_image_2}`} alt="Warehouse" className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-xs text-center p-2">Warehouse</div>
                )}
              </div>
            </div>
            
            {/* Col 2 */}
            <div className="h-full">
              <div className="bg-gray-300 w-full h-full relative overflow-hidden shadow-sm">
                {settings.industries_image_3 ? (
                  <img src={`${settings.industries_image_3?.startsWith('http') ? settings.industries_image_3 : process.env.NEXT_PUBLIC_API_URL + settings.industries_image_3}`} alt="Hotel" className="w-full h-full object-cover absolute inset-0" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-xs text-center p-2">Hotel</div>
                )}
              </div>
            </div>

            {/* Col 3 */}
            <div className="flex flex-col gap-2">
              <div className="bg-gray-200 w-full aspect-[4/3] relative overflow-hidden shadow-sm">
                {settings.industries_image_4 ? (
                  <img src={`${settings.industries_image_4?.startsWith('http') ? settings.industries_image_4 : process.env.NEXT_PUBLIC_API_URL + settings.industries_image_4}`} alt="Supermarket" className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs text-center p-2">Supermarket</div>
                )}
              </div>
              <div className="bg-gray-300 w-full flex-grow relative overflow-hidden shadow-sm">
                {settings.industries_image_5 ? (
                  <img src={`${settings.industries_image_5?.startsWith('http') ? settings.industries_image_5 : process.env.NEXT_PUBLIC_API_URL + settings.industries_image_5}`} alt="Coffee Chain" className="w-full h-full object-cover absolute inset-0" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-xs text-center p-2">Coffee Chain</div>
                )}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-black mb-4 leading-tight whitespace-pre-line">
              {settings.industries_subtitle || "Food Packaging Solutions\nfor Every Industry"}
            </h3>
            <p className="text-lg text-black mb-4">We Serve:</p>
            <ul className="flex flex-col gap-1.5 text-black text-[15px] md:text-base">
              {industries.map((industry: string, idx: number) => (
                <li key={idx} className="flex items-center space-x-3">
                  <span className="w-1 h-1 bg-black rounded-full flex-shrink-0"></span>
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
