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
    <section className="py-12 bg-white relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-12">
          {(!settings.about_title || settings.about_title.trim() === '') ? null : (
            <h2 className="text-[40px] md:text-[65px] font-medium text-meewa-red leading-none tracking-normal mb-4">
              {settings.about_title}
            </h2>
          )}
          {/* Fallback title if both are empty? Let's just always render About Company if empty */}
          {(!settings.about_title || settings.about_title.trim() === '') && (
            <h2 className="text-[40px] md:text-[65px] font-medium text-meewa-red leading-none tracking-normal mb-4">
              About Company
            </h2>
          )}
          <p className="text-gray-600 text-lg">
            {settings.about_subtitle || "Your Trusted Disposable Food Packaging Export Partner"}
          </p>
        </div>

        {/* Video / Map Display */}
        <div className="relative w-full h-[400px] md:h-[600px] rounded-2xl overflow-hidden shadow-lg bg-gray-100">
          
          {settings.about_media_url ? (
            <AboutMedia mediaUrl={settings.about_media_url} />
          ) : (
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30"></div>
          )}

        </div>

      </div>
    </section>
  );
}
