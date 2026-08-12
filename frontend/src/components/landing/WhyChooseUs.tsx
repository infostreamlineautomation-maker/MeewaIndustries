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
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-meewa-red/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-gray-200/50 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="mb-12 max-w-3xl">
          <span className="text-meewa-red font-semibold tracking-wider uppercase text-sm mb-2 block">Our Advantages</span>
          <h2 className="text-5xl font-extrabold text-meewa-red mb-6 tracking-tight">Why Choose Us</h2>
          <p className="text-gray-600 text-xl leading-relaxed">
            We provide complete packaging solutions with a focus on quality, reliability, and customer satisfaction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature: any, idx: number) => (
            <div 
              key={idx} 
              className="group relative bg-white rounded-md p-6 md:p-8 border border-gray-300 overflow-hidden hover:border-meewa-red hover:shadow-lg transition-all duration-300 z-10"
            >
              {/* Glowing gradient background that fades in on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              
              {/* Giant faint watermark number */}
              <div className="absolute -bottom-6 -right-6 text-9xl font-black text-gray-50/80 group-hover:text-red-50/50 transition-colors duration-500 pointer-events-none select-none z-0">
                0{idx + 1}
              </div>

              <div className="relative z-10">
                <div className="w-16 h-16 bg-red-50 text-meewa-red rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 group-hover:bg-meewa-red group-hover:text-white transition-all duration-500 overflow-hidden p-3">
                  <img src={feature.icon.startsWith('/') ? `${feature.icon?.startsWith('http') ? feature.icon : process.env.NEXT_PUBLIC_API_URL + feature.icon}` : feature.icon} alt={feature.title} className="w-full h-full object-contain filter transition-all duration-500 group-hover:brightness-0 group-hover:invert" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-meewa-red transition-colors duration-300">{feature.title}</h3>
                
                <p className="text-gray-600 leading-relaxed font-medium">
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
