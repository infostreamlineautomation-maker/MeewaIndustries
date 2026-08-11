import { fetchServerSettings } from '@/lib/fetchSettings';
import Link from 'next/link';
import AboutMedia from './AboutMedia';

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
        <div className="relative w-full h-[300px] md:h-[500px] rounded-2xl overflow-hidden shadow-lg bg-gray-100">
          
          {settings.about_media_url ? (
            <AboutMedia mediaUrl={settings.about_media_url} />
          ) : (
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30"></div>
          )}

          {/* Learn More Button */}
          <div className="absolute bottom-4 right-4 md:bottom-6 md:right-8">
            <Link href="/about" className="bg-meewa-red text-white px-6 py-3 md:px-8 md:py-4 rounded-lg font-bold hover:bg-red-700 transition-colors inline-flex items-center shadow-lg text-sm md:text-base">
              Learn More
              <svg className="w-4 h-4 md:w-5 md:h-5 ml-2 transform -rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
