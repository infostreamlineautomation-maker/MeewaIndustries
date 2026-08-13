import { fetchServerSettings } from '@/lib/fetchSettings';
import Image from 'next/image';

export default async function WhyChooseUs() {
  let settings: any = {};
  try {
    const res = await fetchServerSettings();
    settings = await res.json();
  } catch(e) {}

  const features = settings.landing_features && settings.landing_features.length > 0 ? settings.landing_features : [
    {
      title: "Food-Grade Quality",
      description: "Manufactured using safe and reliable materials suitable for food applications.",
      icon: "/icons/Shield.svg"
    },
    {
      title: "Competitive Pricing",
      description: "Factory-direct solutions for wholesalers, importers, and distributors.",
      icon: "/icons/Guarantee.svg"
    },
    {
      title: "Custom Manufacturing",
      description: "OEM and private label packaging according to your brand requirements.",
      icon: "/icons/Print.svg"
    },
    {
      title: "Reliable Export Service",
      description: "Professional support for international orders and shipping.",
      icon: "/icons/Star of Bethlehem.svg"
    },
    {
      title: "Consistent Supply",
      description: "Efficient production and quality checks for bulk requirements.",
      icon: "/icons/Clock Checked.svg"
    }
  ];

  return (
    <section className="pt-4 md:pt-4 pb-4 md:pb-4 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="mb-8 md:mb-12 max-w-3xl">
          <h2 className="text-[24px] sm:text-[28px] md:text-[40px] font-medium text-meewa-red leading-none tracking-normal mb-2 md:mb-6">Why Choose Us</h2>
          <p className="text-gray-600 text-[11px] md:text-xl leading-relaxed">
            We provide complete packaging solutions with a focus on quality, reliability, and customer satisfaction.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
          {features.map((feature: any, idx: number) => (
            <div 
              key={idx} 
              className="group relative bg-white rounded-lg md:rounded-xl p-3.5 md:p-8 border border-gray-300 overflow-hidden hover:border-meewa-red hover:shadow-lg transition-all duration-300 z-10"
            >
              {/* Glowing gradient background that fades in on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              
              {/* Giant faint watermark number */}
              <div className="absolute -bottom-6 -right-6 text-9xl font-black text-gray-50/80 group-hover:text-red-50/50 transition-colors duration-500 pointer-events-none select-none z-0">
                0{idx + 1}
              </div>

              <div className="relative z-10">
                <div className="w-8 h-8 md:w-16 md:h-16 bg-[#FDF2F3] text-meewa-red rounded-md md:rounded-2xl flex items-center justify-center mb-3 md:mb-8 shadow-sm group-hover:scale-110 group-hover:bg-meewa-red group-hover:text-white transition-all duration-500 overflow-hidden p-1.5 md:p-3">
                  <img src={feature.icon.startsWith('/') ? `${feature.icon?.startsWith('http') ? feature.icon : process.env.NEXT_PUBLIC_API_URL + feature.icon}` : feature.icon} alt={feature.title} className="w-full h-full object-contain filter transition-all duration-500 group-hover:brightness-0 group-hover:invert" />
                </div>
                
                <h3 className="text-[12.5px] md:text-2xl font-semibold md:font-bold text-gray-900 mb-1.5 md:mb-4 group-hover:text-meewa-red transition-colors duration-300 leading-tight">{feature.title}</h3>
                
                <p className="text-gray-600 leading-snug md:leading-relaxed text-[10px] md:text-base md:font-medium">
                  {feature.description}
                </p>
              </div>
              
              {/* Interactive bottom bar indicator */}
              <div className="absolute bottom-0 left-0 w-0 h-1 bg-meewa-red group-hover:w-full transition-all duration-500 ease-out"></div>
            </div>
          ))}
        </div>
        
        {/* Absolute Map Background matching the design */}
        <div className="absolute right-0 bottom-[-10%] w-[856px] h-[473px] pointer-events-none z-0 hidden lg:block opacity-30">
          <img 
            src="/images/locationassest.jpg" 
            alt="Global Reach Map" 
            className="w-full h-full object-contain mix-blend-multiply"
          />
        </div>
      </div>
    </section>
  );
}
