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

  const showHero = settings.about_show_hero !== false;
  const showVisionMission = settings.about_show_vision_mission !== false;
  const showClients = settings.about_show_clients !== false;
  const showHowWeWork = settings.about_show_how_we_work !== false;
  const showFeatures = settings.about_show_features !== false;
  const showFaqs = settings.about_show_faqs !== false;

  return (
    <div className="bg-white min-h-screen">
      
      {/* 1. Hero Section */}
      {showHero && (
        <section className="pt-24 md:pt-40 pb-8 md:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-16 items-stretch">
            
            {/* Left Column */}
            <div className="flex flex-col justify-center max-w-xl w-full">
              <h1 className="text-[28px] leading-[1.2] md:text-4xl lg:text-6xl font-bold text-gray-900 mb-6 lg:mb-6">
                {settings.about_hero_title || "Stories built to feel precise, cinematic, and commercially sharp."}
              </h1>

              {/* Mobile Image (Hidden on Desktop) */}
              <div className="block lg:hidden w-full aspect-[4/3] rounded-[10px] overflow-hidden relative mb-6">
                {settings.about_hero_media ? (
                  settings.about_hero_media.endsWith('.mp4') ? (
                    <video src={`${settings.about_hero_media?.startsWith('http') ? settings.about_hero_media : process.env.NEXT_PUBLIC_API_URL + settings.about_hero_media}`} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <img src={`${settings.about_hero_media?.startsWith('http') ? settings.about_hero_media : process.env.NEXT_PUBLIC_API_URL + settings.about_hero_media}`} alt="Hero" className="absolute inset-0 w-full h-full object-cover" />
                  )
                ) : (
                  <div className="absolute inset-0 bg-gray-200"></div>
                )}
              </div>

              <p className="text-sm md:text-xl text-gray-600 leading-relaxed mb-6 lg:mb-10 whitespace-pre-line">
                {(settings.about_hero_subtitle || "Leading exporter of high-quality packaging materials for businesses worldwide.\n\nDelivering innovative, sustainable, and customized packaging solutions with trusted quality.").replace(/\. /g, '.\n\n')}
              </p>

              {/* Embedded Stats Grid */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 pb-4 lg:pb-0">
                {stats.map((stat: any, idx: number) => (
                  <div 
                    key={idx} 
                    className="h-auto min-h-[100px] border border-[#595959]/50 lg:border-gray-200 rounded-[10px] lg:rounded-lg p-2 sm:p-3 lg:p-4 bg-white hover:border-meewa-red/30 transition-colors flex flex-col justify-center lg:justify-start"
                  >
                    {/* Small icon placeholder (Desktop Only) */}
                    <div className="hidden lg:block mb-2 text-meewa-red">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                    </div>
                    <h3 className="text-sm sm:text-base lg:text-base font-bold text-gray-900 mb-1">{stat.title}</h3>
                    <p className="text-[10px] sm:text-xs text-gray-500 leading-tight">{stat.subtitle}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column (Video) - Desktop Only */}
            <div className="hidden lg:block h-[400px] lg:h-auto min-h-[500px] rounded-xl overflow-hidden relative shadow-lg">
              {settings.about_hero_media ? (
                settings.about_hero_media.endsWith('.mp4') ? (
                  <video src={`${settings.about_hero_media?.startsWith('http') ? settings.about_hero_media : process.env.NEXT_PUBLIC_API_URL + settings.about_hero_media}`} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <img src={`${settings.about_hero_media?.startsWith('http') ? settings.about_hero_media : process.env.NEXT_PUBLIC_API_URL + settings.about_hero_media}`} alt="Hero" className="absolute inset-0 w-full h-full object-cover" />
                )
              ) : (
                <div className="absolute inset-0 bg-gray-200"></div>
              )}

              {/* Text Overlay on Video */}
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <div className="text-white/80 text-sm font-medium mb-1">{settings.about_hero_video_subtitle || "Studio to delivery"}</div>
                <h3 className="text-white text-xl md:text-2xl font-bold leading-tight">
                  {settings.about_hero_video_title || "Design, production and print aligned end to end."}
                </h3>
              </div>
            </div>

          </div>
        </div>
      </section>
      )}

      {/* 3. Vision & Mission */}
      {showVisionMission && (
        <section className="pt-2 pb-4 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-8">
            <div className="border border-gray-200 p-3 md:p-10 rounded-[10px] md:rounded-3xl bg-white">
              {settings.about_vision_icon ? (
                <div className="w-8 h-8 md:w-12 md:h-12 bg-meewa-red rounded-md md:rounded-lg mb-2 md:mb-6 shadow-sm flex items-center justify-center p-1.5 md:p-2.5">
                  <img src={settings.about_vision_icon.startsWith('/') ? `${settings.about_vision_icon?.startsWith('http') ? settings.about_vision_icon : process.env.NEXT_PUBLIC_API_URL + settings.about_vision_icon}` : settings.about_vision_icon} alt="Vision Icon" className="w-full h-full object-contain" />
                </div>
              ) : (
                <div className="w-8 h-8 md:w-12 md:h-12 bg-meewa-red rounded-md md:rounded-lg mb-2 md:mb-6 shadow-sm flex items-center justify-center p-1.5 md:p-2.5">
                  <svg className="w-full h-full text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                </div>
              )}
              <h4 className="text-meewa-red font-bold text-[8px] sm:text-[10px] md:text-xl mb-1 leading-tight">{settings.about_vision_subtitle || "See beyond the brief"}</h4>
              <h3 className="text-[11px] sm:text-xs md:text-3xl font-bold text-gray-900 mb-1.5 md:mb-6 leading-tight">{settings.about_vision_title || "Our Vision"}</h3>
              <p className="text-gray-800 md:text-gray-600 text-[8px] sm:text-[10px] md:text-lg leading-tight md:leading-relaxed whitespace-pre-wrap">
                {settings.about_vision_desc || "To become a global leader in sustainable packaging solutions through innovation, quality, and customer-focused manufacturing.\n\nWe aim to empower businesses worldwide with eco-friendly, high-performance packaging materials that drive growth and environmental responsibility."}
              </p>
            </div>
            
            <div className="border border-gray-200 p-3 md:p-10 rounded-[10px] md:rounded-3xl bg-white">
              {settings.about_mission_icon ? (
                <div className="w-8 h-8 md:w-12 md:h-12 bg-meewa-red rounded-md md:rounded-lg mb-2 md:mb-6 shadow-sm flex items-center justify-center p-1.5 md:p-2.5">
                  <img src={settings.about_mission_icon.startsWith('/') ? `${settings.about_mission_icon?.startsWith('http') ? settings.about_mission_icon : process.env.NEXT_PUBLIC_API_URL + settings.about_mission_icon}` : settings.about_mission_icon} alt="Mission Icon" className="w-full h-full object-contain" />
                </div>
              ) : (
                <div className="w-8 h-8 md:w-12 md:h-12 bg-meewa-red rounded-md md:rounded-lg mb-2 md:mb-6 shadow-sm flex items-center justify-center p-1.5 md:p-2.5">
                  <svg className="w-full h-full text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                </div>
              )}
              <h4 className="text-meewa-red font-bold text-[8px] sm:text-[10px] md:text-xl mb-1 leading-tight">{settings.about_mission_subtitle || "Deliver with precision"}</h4>
              <h3 className="text-[11px] sm:text-xs md:text-3xl font-bold text-gray-900 mb-1.5 md:mb-6 leading-tight">{settings.about_mission_title || "Our Mission"}</h3>
              <p className="text-gray-800 md:text-gray-600 text-[8px] sm:text-[10px] md:text-lg leading-tight md:leading-relaxed whitespace-pre-wrap">
                {settings.about_mission_desc || "To deliver high-quality packaging materials and custom manufacturing solutions that help businesses grow.\n\nWe are committed to innovation, ethical practices, sustainable packaging, and exceptional customer satisfaction to build long-term partnerships worldwide."}
              </p>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* 4. Our Clients */}
      {showClients && clients.length > 0 && (
        <section className="py-4 md:py-12 bg-gray-50 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 md:mb-10 text-center">
            <h2 className="text-[28px] sm:text-[32px] md:text-[40px] font-medium text-meewa-red leading-none tracking-normal">Our Clients</h2>
          </div>
          
          <div className="flex flex-col gap-4 md:gap-8 relative w-full group">
            {/* Clockwise row (Scrolling Left) */}
            <div className="flex w-fit animate-marquee hover:[animation-play-state:paused] whitespace-nowrap space-x-4 md:space-x-10 px-4 md:px-5">
              {[...clients, ...clients, ...clients].map((client: any, idx: number) => (
                <div key={`cw-${idx}`} className="w-[110px] h-[100px] md:w-48 md:h-32 bg-white rounded-[10px] md:rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center p-3 md:p-6 shrink-0">
                  <img src={`${client.logo_url?.startsWith('http') ? client.logo_url : process.env.NEXT_PUBLIC_API_URL + client.logo_url}`} className="max-w-full max-h-full object-contain transition-all duration-300" alt="Client Logo" />
                </div>
              ))}
            </div>

            {/* Anti-clockwise row (Scrolling Right) - Reverse Marquee */}
            {clients.length > 4 && (
              <div className="flex w-fit animate-marquee-reverse hover:[animation-play-state:paused] whitespace-nowrap space-x-4 md:space-x-10 px-4 md:px-5">
                {[...clients, ...clients, ...clients].reverse().map((client: any, idx: number) => (
                  <div key={`acw-${idx}`} className="w-[110px] h-[100px] md:w-48 md:h-32 bg-white rounded-[10px] md:rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center p-3 md:p-6 shrink-0">
                    <img src={`${client.logo_url?.startsWith('http') ? client.logo_url : process.env.NEXT_PUBLIC_API_URL + client.logo_url}`} className="max-w-full max-h-full object-contain transition-all duration-300" alt="Client Logo" />
                  </div>
                ))}
              </div>
            )}

          </div>
        </section>
      )}

      {/* 5. How We Work */}
      {showHowWeWork && (
        <section className="py-4 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 lg:gap-16 items-stretch">
            
            {/* Mobile Title (Hidden on Desktop) */}
            <h3 className="block lg:hidden text-lg md:text-2xl font-bold text-gray-900 mb-1 leading-tight">
              {settings.about_how_we_work_title || "Production-minded design for every brand touch point."}
            </h3>

            {/* Left: Video */}
            <div className="h-[250px] sm:h-[300px] md:h-[400px] lg:h-auto min-h-[250px] lg:min-h-[400px] rounded-[10px] lg:rounded-xl overflow-hidden shadow-lg bg-gray-900 relative group mb-2 lg:mb-0">
              {settings.about_how_we_work_media ? (
                <img src={`${settings.about_how_we_work_media?.startsWith('http') ? settings.about_how_we_work_media : process.env.NEXT_PUBLIC_API_URL + settings.about_how_we_work_media}`} className="absolute inset-0 w-full h-full object-cover opacity-100 lg:opacity-80 group-hover:opacity-100 transition-opacity duration-500" alt="How We Work" />
              ) : (
                <div className="absolute inset-0 bg-gray-200"></div>
              )}
              {/* Text Overlay on Video (Desktop Only) */}
              <div className="hidden lg:block absolute inset-x-0 bottom-0 p-5 md:p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <div className="text-white/80 text-xs md:text-sm font-medium mb-1">{settings.about_how_we_work_video_subtitle || "Print Excellence"}</div>
                <h3 className="text-white text-lg md:text-2xl font-bold leading-tight">
                  {settings.about_how_we_work_video_title || "Crafted visuals, flawless finishes and production quality built for modern brands."}
                </h3>
              </div>
            </div>
            
            {/* Right: Text + Grid */}
            <div className="flex flex-col justify-center">
              <h2 className="hidden lg:block text-[28px] sm:text-[32px] md:text-[40px] font-medium text-meewa-red leading-none mb-3 tracking-normal">How we work</h2>
              <h3 className="hidden lg:block text-lg md:text-2xl lg:text-3xl font-medium text-gray-800 mb-4 md:mb-6 leading-relaxed">
                {settings.about_how_we_work_title || "Production-minded design for every brand touch point."}
              </h3>
              <p className="text-[11px] sm:text-[13px] md:text-lg text-gray-600 mb-4 lg:mb-10 leading-relaxed">
                {settings.about_how_we_work_desc || "We combine brand strategy, AI assisted production, web experiences and high quality print solutions so every campaign feels considered from first idea to final delivery."}
              </p>
              
              <div className="grid grid-cols-2 gap-2 sm:gap-4 mt-auto">
                {howWeWorkList.map((item: any, idx: number) => (
                  <div key={idx} className="border border-gray-200 rounded-[5px] md:rounded-lg p-2.5 sm:p-4 bg-white flex items-center justify-start hover:border-meewa-red/30 transition-colors">
                    <span className="text-[10px] sm:text-xs md:text-base font-medium text-gray-900">{item.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* 6. Capabilities Grid (Features) */}
      {showFeatures && (
        <section className="pt-2 pb-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {features.map((feature: any, idx: number) => (
              <div key={idx} className="border border-gray-200 rounded-[5px] md:rounded-xl p-3 sm:p-5 md:p-6 bg-white hover:shadow-md transition-shadow">
                {feature.icon ? (
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-meewa-red rounded-[5px] md:rounded-lg mb-2 md:mb-4 shadow-sm flex items-center justify-center p-1.5 md:p-2">
                    <img src={feature.icon.startsWith('/') ? `${feature.icon?.startsWith('http') ? feature.icon : process.env.NEXT_PUBLIC_API_URL + feature.icon}` : feature.icon} alt={feature.title} className="w-full h-full object-contain" />
                  </div>
                ) : (
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-meewa-red rounded-[5px] md:rounded-lg mb-2 md:mb-4 shadow-sm flex items-center justify-center p-1.5 md:p-2">
                    {/* Fallback Icon */}
                    <svg className="w-full h-full text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                  </div>
                )}
                <h3 className="text-[10px] sm:text-xs md:text-base font-bold text-gray-900 mb-1 md:mb-2 leading-tight">{feature.title}</h3>
                <p className="text-gray-500 leading-tight md:leading-relaxed text-[8px] sm:text-[10px] md:text-xs">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* 7. Contact / FAQs Section (Reused from Landing Page) */}
      {showFaqs && (
        <ContactFaqSection />
      )}

    </div>
  );
}
