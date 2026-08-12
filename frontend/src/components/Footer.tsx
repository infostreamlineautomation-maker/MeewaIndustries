import { fetchServerSettings } from '@/lib/fetchSettings';
import Link from 'next/link';

const SocialIcon = ({ type }: { type: string }) => {
  const t = type.toLowerCase();
  if (t === 'linkedin') return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#0077b5">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
  if (t === 'facebook') return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#1877f2">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
  if (t === 'instagram') return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="url(#ig-grad)">
      <defs>
        <radialGradient id="ig-grad" r="150%" cx="30%" cy="107%">
          <stop stopColor="#fdf497" offset="0" />
          <stop stopColor="#fdf497" offset="0.05" />
          <stop stopColor="#fd5949" offset="0.45" />
          <stop stopColor="#d6249f" offset="0.6" />
          <stop stopColor="#285AEB" offset="0.9" />
        </radialGradient>
      </defs>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  );
  if (t === 'youtube') return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#ff0000">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
  if (t === 'x' || t === 'twitter') return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#000000">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
  // Default to black outlined circle if not recognized
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" style={{color: '#333'}}>
       <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
    </svg>
  );
}

export default async function Footer() {
  let settings: any = {};
  try {
    const res = await fetchServerSettings();
    settings = await res.json();
  } catch(e) {}

  return (
    <footer className="bg-meewa-red text-white flex flex-col font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-16 pb-16 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left Column (Brand & CTA) */}
          <div className="md:col-span-7">
            <div className="mb-6 md:mb-8">
              {settings.footer_logo_url ? (
                <img src={`${settings.footer_logo_url?.startsWith('http') ? settings.footer_logo_url : process.env.NEXT_PUBLIC_API_URL + settings.footer_logo_url}`} alt="MEEWA Logo" className="h-8 md:h-14 object-contain" />
              ) : settings.site_logo_url ? (
                <img src={`${settings.site_logo_url?.startsWith('http') ? settings.site_logo_url : process.env.NEXT_PUBLIC_API_URL + settings.site_logo_url}`} alt="MEEWA Logo" className="h-8 md:h-14 object-contain" />
              ) : (
                <div className="flex flex-col">
                  <span className="text-3xl font-bold tracking-widest leading-none text-white">{settings.site_title || "MEEWA"}</span>
                  <span className="text-xs tracking-[0.2em] uppercase leading-none mt-1 text-red-200">Beyond the horizon</span>
                </div>
              )}
            </div>
            
            <h2 className="text-[17px] md:text-5xl font-bold mb-3 md:mb-6 leading-tight pr-0 md:pr-12">
              {settings.footer_title || "Packaging the Future with Sustainable Food Packaging Solutions"}
            </h2>
            <p className="text-red-100 text-[11px] md:text-base mb-5 md:mb-8 max-w-xl pr-0 md:pr-12 leading-relaxed">
              {settings.footer_subtitle || "Trusted by importers, wholesalers, distributors, and food service businesses worldwide for premium paper packaging, custom manufacturing, and eco-friendly solutions."}
            </p>
            
            <Link href="/contact" className="bg-[#e5e7eb] text-gray-800 px-4 py-2 md:px-6 md:py-2.5 rounded-md font-semibold text-[11px] md:text-sm hover:bg-gray-300 transition-colors inline-block">
              Request a Free Quote
            </Link>
          </div>

          {/* Mobile Side-by-Side Wrapper */}
          <div className="grid grid-cols-2 gap-6 md:gap-12 lg:gap-16 md:col-span-5">
            {/* Quick Links */}
            <div>
              <h4 className="text-[14px] md:text-xl font-medium mb-4 md:mb-6">Company</h4>
              <ul className="space-y-2 md:space-y-4 text-[11px] md:text-[15px] text-white/90">
                {settings.footer_links && Array.isArray(settings.footer_links) ? (
                  settings.footer_links.map((link: any, idx: number) => (
                    <li key={idx}><Link href={link.href} className="hover:text-white transition-colors block">{link.label}</Link></li>
                  ))
                ) : (
                  <>
                    <li><Link href="/" className="hover:text-white transition-colors block">Home</Link></li>
                    <li><Link href="/products" className="hover:text-white transition-colors block">Our Products</Link></li>
                    <li><Link href="/about" className="hover:text-white transition-colors block">About Us</Link></li>
                    <li><Link href="/contact" className="hover:text-white transition-colors block">Contact Us</Link></li>
                  </>
                )}
              </ul>
            </div>

            {/* Contact Us */}
            <div>
              <h4 className="text-[14px] md:text-xl font-medium mb-4 md:mb-6">Contact Us</h4>
              <ul className="space-y-2 md:space-y-3 text-[11px] md:text-[15px] text-white/90">
                {settings.footer_phone && <li>{settings.footer_phone}</li>}
                {settings.footer_email && <li><a href={`mailto:${settings.footer_email}`} className="hover:underline">{settings.footer_email}</a></li>}
                {settings.footer_address && <li className="leading-snug">{settings.footer_address}</li>}
              </ul>
            
              <div className="flex gap-2.5 md:gap-4 mt-4 md:mt-8">
                {settings.footer_socials && Array.isArray(settings.footer_socials) ? (
                  settings.footer_socials.map((link: any, idx: number) => (
                    <a key={idx} href={link.href} target="_blank" rel="noopener noreferrer" className="w-5 h-5 md:w-10 md:h-10 flex items-center justify-center md:border md:border-white/50 md:rounded hover:opacity-80 md:hover:bg-white/10 transition-all cursor-pointer group">
                      <div className="bg-white rounded-[4px] md:rounded-sm w-full h-full md:w-7 md:h-7 flex items-center justify-center overflow-hidden">
                         <SocialIcon type={link.label} />
                      </div>
                    </a>
                  ))
                ) : (
                  <>
                    <div className="w-5 h-5 md:w-10 md:h-10 flex items-center justify-center md:border md:border-white/50 md:rounded hover:opacity-80 md:hover:bg-white/10 transition-all cursor-pointer group">
                      <div className="bg-white rounded-[4px] md:rounded-sm w-full h-full md:w-7 md:h-7 flex items-center justify-center overflow-hidden"><SocialIcon type="Instagram" /></div>
                    </div>
                    <div className="w-5 h-5 md:w-10 md:h-10 flex items-center justify-center md:border md:border-white/50 md:rounded hover:opacity-80 md:hover:bg-white/10 transition-all cursor-pointer group">
                      <div className="bg-white rounded-[4px] md:rounded-sm w-full h-full md:w-7 md:h-7 flex items-center justify-center overflow-hidden"><SocialIcon type="Facebook" /></div>
                    </div>
                    <div className="w-5 h-5 md:w-10 md:h-10 flex items-center justify-center md:border md:border-white/50 md:rounded hover:opacity-80 md:hover:bg-white/10 transition-all cursor-pointer group">
                      <div className="bg-white rounded-[4px] md:rounded-sm w-full h-full md:w-7 md:h-7 flex items-center justify-center overflow-hidden"><SocialIcon type="LinkedIn" /></div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-white/10 w-full py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center text-[11px] md:text-[15px] font-medium text-white/90 text-center">
          <div className="flex space-x-4 md:space-x-6 mb-2 md:mb-0 md:absolute md:left-8">
            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/terms-and-conditions" className="hover:text-white">Terms</Link>
            <Link href="/sitemap" className="hover:text-white">Sitemap</Link>
            <Link href="/cookies-policy" className="hover:text-white">Cookies</Link>
          </div>
          <div className="mt-2 md:mt-0">
            {settings.footer_text || `© 2026 Meewa. All Rights Reserved.`}
          </div>
        </div>
      </div>
    </footer>
  );
}
