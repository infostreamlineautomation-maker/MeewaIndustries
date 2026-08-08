import { fetchServerSettings } from '@/lib/fetchSettings';
import Link from 'next/link';

export default async function Footer() {
  let settings: any = {};
  try {
    const res = await fetchServerSettings();
    settings = await res.json();
  } catch(e) {}

  return (
    <footer className="bg-meewa-red text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 border-b border-red-400 pb-12">
          
          {/* Left Column (Brand & CTA) */}
          <div className="md:col-span-6 pr-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center p-1 overflow-hidden">
                {settings.site_logo_url ? (
                  <img src={`${process.env.NEXT_PUBLIC_API_URL}${settings.site_logo_url}`} alt="MEEWA Logo" className="w-full h-full object-contain" />
                ) : (
                  <div className="text-meewa-red flex flex-col items-center justify-center h-full">
                    <span className="text-[10px] font-bold tracking-widest">MEEWA</span>
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-2xl font-bold tracking-widest leading-none">{settings.site_title || "MEEWA"}</h3>
                <p className="text-[10px] tracking-[0.2em] uppercase leading-none mt-1 text-gray-200">Beyond the horizon</p>
              </div>
            </div>
            
            <h2 className="text-3xl font-bold mb-4">{settings.footer_title || "Ready to source premium food packaging?"}</h2>
            <p className="text-red-100 text-sm mb-8 max-w-md whitespace-pre-wrap">
              {settings.footer_subtitle || "Get in touch with our experts for customized manufacturing and global export solutions."}
            </p>
            
            <Link href="/contact" className="bg-white text-meewa-red px-6 py-3 rounded-md font-semibold text-sm hover:bg-gray-100 transition-colors inline-block">
              Request a Free Quote
            </Link>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm text-red-100">
              {settings.footer_links && Array.isArray(settings.footer_links) ? (
                settings.footer_links.map((link: any, idx: number) => (
                  <li key={idx}><Link href={link.href} className="hover:text-white transition-colors">{link.label}</Link></li>
                ))
              ) : (
                <>
                  <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                  <li><Link href="/categories" className="hover:text-white transition-colors">Our Products</Link></li>
                  <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                  <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                </>
              )}
            </ul>
          </div>

          {/* Follow Us */}
          <div className="md:col-span-3">
            <h4 className="text-lg font-semibold mb-6">Follow Us</h4>
            <ul className="space-y-4 text-sm text-red-100">
              {settings.footer_socials && Array.isArray(settings.footer_socials) ? (
                settings.footer_socials.map((link: any, idx: number) => (
                  <li key={idx}><a href={link.href} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">{link.label}</a></li>
                ))
              ) : (
                <>
                  <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">YouTube</a></li>
                </>
              )}
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-red-200">
          <div className="flex space-x-6 mb-4 md:mb-0">
            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <Link href="/sitemap" className="hover:text-white">Sitemap</Link>
            <Link href="/cookies" className="hover:text-white">Cookies</Link>
          </div>
          <div>
            {settings.footer_text || `© ${new Date().getFullYear()} Meewa. All Rights Reserved.`}
          </div>
        </div>
      </div>
    </footer>
  );
}
