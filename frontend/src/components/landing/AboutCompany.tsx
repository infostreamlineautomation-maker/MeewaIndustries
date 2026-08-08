import { fetchServerSettings } from '@/lib/fetchSettings';
import Link from 'next/link';

export default async function AboutCompany() {
  let settings: any = {};
  try {
    const res = await fetchServerSettings();
    settings = await res.json();
  } catch(e) {}

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-meewa-red mb-4">
            {settings.about_title || "About Company"}
          </h2>
          <p className="text-gray-600 text-lg">
            {settings.about_subtitle || "Your Trusted Disposable Food Packaging Export Partner"}
          </p>
        </div>

        {/* Video / Map Display */}
        <div className="relative w-full h-[500px] rounded-2xl overflow-hidden shadow-lg bg-gray-100">
          
          {settings.about_media_url ? (
            <div className="absolute inset-0">
              {settings.about_media_url.endsWith('.mp4') ? (
                <video src={`${process.env.NEXT_PUBLIC_API_URL}${settings.about_media_url}`} autoPlay loop muted playsInline className="w-full h-full object-cover" />
              ) : (
                <img src={`${process.env.NEXT_PUBLIC_API_URL}${settings.about_media_url}`} alt="About Background" className="w-full h-full object-cover" />
              )}
            </div>
          ) : (
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30"></div>
          )}

          {/* Learn More Button */}
          <div className="absolute bottom-6 right-8">
            <Link href="/about" className="bg-meewa-red text-white px-8 py-4 rounded-lg font-bold hover:bg-red-700 transition-colors inline-flex items-center shadow-lg">
              Learn More
              <svg className="w-5 h-5 ml-2 transform -rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
