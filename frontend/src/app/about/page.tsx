import { fetchServerSettings } from '@/lib/fetchSettings';
import { Metadata } from 'next';
import ContactFaqSection from '@/components/landing/ContactFaqSection';

export const metadata: Metadata = {
  title: 'About Us | MEEWA Industries',
  description: 'Learn more about MEEWA Industries, our values, and our commitment to quality export.',
};

export default async function AboutPage() {
  let settings: any = {};
  try {
    const res = await fetchServerSettings();
    settings = await res.json();
  } catch (e) {
    console.error("Could not fetch settings:", e);
  }

  // Fallback defaults if DB is empty
  const defaultStats = [
    { title: "360", subtitle: "Brand, print and digital thinking" },
    { title: "Fast", subtitle: "Production-ready execution" },
    { title: "Premium", subtitle: "Brand, print and digital thinking" }
  ];

  const defaultHowWeWork = [
    { title: "Brand Strategy", subtitle: "Discover" },
    { title: "AI Production", subtitle: "Develop" },
    { title: "Print & Packaging", subtitle: "Deliver" },
    { title: "Web Experience", subtitle: "Deploy" }
  ];

  const defaultFeatures = [
    { title: "Premium Print", description: "Luxury business cards, brochures and marketing collaterals finished with crisp detail.", icon: "" },
    { title: "Creative Branding", description: "Packaging, mockups and campaign visuals designed to feel polished, modern and memorable.", icon: "" },
    { title: "Large Format", description: "Signage, retail panels and exhibition graphics produced to stand out at every scale.", icon: "" },
    { title: "Packaging Care", description: "Premium materials, consistent color output and dependable delivery for every production run.", icon: "" }
  ];

  const stats = settings.about_stats?.length > 0 ? settings.about_stats : defaultStats;
  const howWeWorkList = settings.about_how_we_work_list?.length > 0 ? settings.about_how_we_work_list : defaultHowWeWork;
  const features = settings.about_features?.length > 0 ? settings.about_features : defaultFeatures;
  const clients = settings.about_clients || [];

  return (
    <div className="bg-white min-h-screen">
      
      {/* 1. Hero Section */}
      <section className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-xl">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight tracking-tight mb-6">
                {settings.about_hero_title || "Stories built to feel precise, cinematic, and commercially sharp."}
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                {settings.about_hero_subtitle || "Leading exporter of high-quality packaging materials for businesses worldwide."}
              </p>
            </div>
            <div className="h-[500px] rounded-3xl overflow-hidden relative shadow-lg">
              {settings.about_hero_media ? (
                settings.about_hero_media.endsWith('.mp4') ? (
                  <video src={`${process.env.NEXT_PUBLIC_API_URL}${settings.about_hero_media}`} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                ) : (
                  <img src={`${process.env.NEXT_PUBLIC_API_URL}${settings.about_hero_media}`} alt="Hero" className="w-full h-full object-cover" />
                )
              ) : (
                <div className="w-full h-full bg-gray-200"></div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Stats Grid */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat: any, idx: number) => (
              <div 
                key={idx} 
                className="group relative border border-gray-100 p-10 rounded-2xl bg-white hover:border-transparent hover:shadow-[0_20px_50px_-12px_rgba(206,32,39,0.15)] transition-all duration-500 overflow-hidden transform hover:-translate-y-2"
              >
                {/* Background gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                
                {/* Decorative background element */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-meewa-red/5 rounded-full blur-2xl group-hover:bg-meewa-red/20 transition-all duration-700 pointer-events-none"></div>

                <div className="relative z-10">
                  <h3 className="text-5xl font-extrabold text-gray-900 mb-4 group-hover:text-meewa-red transition-colors duration-500 tracking-tight">{stat.title}</h3>
                  
                  {/* Expanding divider line */}
                  <div className="w-12 h-1 bg-meewa-red mb-5 rounded-full group-hover:w-24 transition-all duration-500 ease-out opacity-70 group-hover:opacity-100"></div>
                  
                  <p className="text-gray-600 font-medium leading-relaxed group-hover:text-gray-900 transition-colors duration-500">{stat.subtitle}</p>
                </div>
                
                {/* Bottom colored border strip */}
                <div className="absolute bottom-0 left-0 w-0 h-1.5 bg-meewa-red group-hover:w-full transition-all duration-700 ease-in-out"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Vision & Mission */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-gray-200 p-10 rounded-3xl bg-white">
              {settings.about_vision_icon ? (
                <div className="w-12 h-12 bg-meewa-red rounded-lg mb-6 shadow-sm flex items-center justify-center p-2.5">
                  <img src={settings.about_vision_icon.startsWith('/') ? `${process.env.NEXT_PUBLIC_API_URL}${settings.about_vision_icon}` : settings.about_vision_icon} alt="Vision Icon" className="w-full h-full object-contain" />
                </div>
              ) : (
                <div className="w-12 h-12 bg-meewa-red rounded-lg mb-6 shadow-sm"></div>
              )}
              <h4 className="text-meewa-red font-bold text-xl mb-1">{settings.about_vision_subtitle || "See beyond the brief"}</h4>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">{settings.about_vision_title || "Our Vision"}</h3>
              <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-wrap">
                {settings.about_vision_desc || "To become a global leader in sustainable packaging solutions through innovation, quality, and customer-focused manufacturing.\n\nWe aim to empower businesses worldwide with eco-friendly, high-performance packaging materials that drive growth and environmental responsibility."}
              </p>
            </div>
            
            <div className="border border-gray-200 p-10 rounded-3xl bg-white">
              {settings.about_mission_icon ? (
                <div className="w-12 h-12 bg-meewa-red rounded-lg mb-6 shadow-sm flex items-center justify-center p-2.5">
                  <img src={settings.about_mission_icon.startsWith('/') ? `${process.env.NEXT_PUBLIC_API_URL}${settings.about_mission_icon}` : settings.about_mission_icon} alt="Mission Icon" className="w-full h-full object-contain" />
                </div>
              ) : (
                <div className="w-12 h-12 bg-meewa-red rounded-lg mb-6 shadow-sm"></div>
              )}
              <h4 className="text-meewa-red font-bold text-xl mb-1">{settings.about_mission_subtitle || "Deliver with precision"}</h4>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">{settings.about_mission_title || "Our Mission"}</h3>
              <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-wrap">
                {settings.about_mission_desc || "To deliver high-quality packaging materials and custom manufacturing solutions that help businesses grow.\n\nWe are committed to innovation, ethical practices, sustainable packaging, and exceptional customer satisfaction to build long-term partnerships worldwide."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Our Clients */}
      {clients.length > 0 && (
        <section className="py-20 bg-gray-50 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center">
            <h2 className="text-4xl font-bold text-meewa-red">Our Clients</h2>
          </div>
          
          <div className="flex flex-col gap-8 relative w-full group">
            {/* Clockwise row (Scrolling Left) */}
            <div className="flex w-fit animate-marquee hover:[animation-play-state:paused] whitespace-nowrap space-x-10 px-5">
              {[...clients, ...clients, ...clients].map((client: any, idx: number) => (
                <div key={`cw-${idx}`} className="w-48 h-32 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center p-6 shrink-0">
                  <img src={`${process.env.NEXT_PUBLIC_API_URL}${client.logo_url}`} className="max-w-full max-h-full object-contain transition-all duration-300" alt="Client Logo" />
                </div>
              ))}
            </div>

            {/* Anti-clockwise row (Scrolling Right) - Reverse Marquee */}
            {clients.length > 4 && (
              <div className="flex w-fit animate-marquee-reverse hover:[animation-play-state:paused] whitespace-nowrap space-x-10 px-5">
                {[...clients, ...clients, ...clients].reverse().map((client: any, idx: number) => (
                  <div key={`acw-${idx}`} className="w-48 h-32 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center p-6 shrink-0">
                    <img src={`${process.env.NEXT_PUBLIC_API_URL}${client.logo_url}`} className="max-w-full max-h-full object-contain transition-all duration-300" alt="Client Logo" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* 5. How We Work */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="h-[600px] rounded-3xl overflow-hidden shadow-xl bg-gray-900 relative group">
              {settings.about_how_we_work_media ? (
                <img src={`${process.env.NEXT_PUBLIC_API_URL}${settings.about_how_we_work_media}`} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" alt="How We Work" />
              ) : (
                <div className="w-full h-full bg-gray-200"></div>
              )}
            </div>
            
            <div>
              <h4 className="text-meewa-red font-bold text-lg mb-4">How we work</h4>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {settings.about_how_we_work_title || "Production-minded design for every brand touch point."}
              </h2>
              <p className="text-xl text-gray-600 mb-12 leading-relaxed">
                {settings.about_how_we_work_desc || "We combine brand strategy, AI assisted production, web experiences and high quality print solutions so every campaign feels considered from first idea to final delivery."}
              </p>
              
              <div className="space-y-4">
                {howWeWorkList.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow bg-white">
                    <span className="text-xl font-bold text-gray-900">{item.title}</span>
                    <span className="text-gray-400 font-medium">({item.subtitle})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Capabilities Grid (Features) */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature: any, idx: number) => (
              <div key={idx} className="border border-gray-200 rounded-3xl p-8 hover:shadow-lg transition-shadow bg-white">
                {feature.icon ? (
                  <div className="w-12 h-12 bg-meewa-red rounded-xl mb-6 shadow-sm flex items-center justify-center p-2.5">
                    <img src={feature.icon.startsWith('/') ? `${process.env.NEXT_PUBLIC_API_URL}${feature.icon}` : feature.icon} alt={feature.title} className="w-full h-full object-contain" />
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-meewa-red rounded-xl mb-6 shadow-sm"></div>
                )}
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Contact / FAQs Section (Reused from Landing Page) */}
      <ContactFaqSection />

    </div>
  );
}
