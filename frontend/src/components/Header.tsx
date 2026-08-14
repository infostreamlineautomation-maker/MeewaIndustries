"use client";
import { fetchClientSettings } from '@/lib/fetchClientSettings';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  let isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
  if (href === '/products' && pathname.startsWith('/products')) {
    isActive = true;
  }
  
  return (
    <Link 
      href={href} 
      className={`relative z-10 px-4 py-2 whitespace-nowrap transition-all duration-300 rounded-full group overflow-hidden ${isActive ? 'text-meewa-red font-bold shadow-sm' : 'text-white hover:text-white'}`}
    >
      {/* Active Tab Background */}
      <span className={`absolute inset-0 bg-white rounded-full -z-10 transition-transform duration-300 ease-out origin-center ${isActive ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}></span>
      
      {/* Hover Background (Subtle White) for inactive tabs */}
      {!isActive && (
        <span className="absolute inset-0 bg-white/10 rounded-full -z-10 scale-0 group-hover:scale-100 transition-transform duration-300 ease-out origin-center"></span>
      )}
      
      <span className="relative z-10">{children}</span>
    </Link>
  );
}

function MobileNavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  const pathname = usePathname();
  let isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
  if (href === '/products' && pathname.startsWith('/products')) {
    isActive = true;
  }
  
  return (
    <Link 
      href={href} 
      onClick={onClick}
      className={`relative text-xl font-bold transition-all px-4 py-2 rounded-xl ${isActive ? 'bg-white text-meewa-red' : 'text-white hover:bg-white/10'}`}
    >
      {children}
    </Link>
  );
}

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [footerLogoUrl, setFooterLogoUrl] = useState<string | null>(null);
  const [mobileLogoUrl, setMobileLogoUrl] = useState<string | null>(null);
  const [hamburgerLogoUrl, setHamburgerLogoUrl] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [leftLinks, setLeftLinks] = useState([{ label: "Home", href: "/" }, { label: "About Us", href: "/about" }]);
  const [rightLinks, setRightLinks] = useState([{ label: "Our Product", href: "/products" }, { label: "Contact Us", href: "/contact" }]);

  const pathname = usePathname();
  const isProductDetailPage = pathname.match(/^\/products\/[^/]+$/);

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Hide header while scrolling
      setIsScrolling(true);
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 250); // Show header 250ms after scrolling stops
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  useEffect(() => {
    fetchClientSettings()
      .then(res => res.json())
      .then(data => {
        if (data.site_logo_url) {
          setLogoUrl(`${data.site_logo_url?.startsWith('http') ? data.site_logo_url : process.env.NEXT_PUBLIC_API_URL + data.site_logo_url}`);
        }
        if (data.footer_logo_url) {
          setFooterLogoUrl(`${data.footer_logo_url?.startsWith('http') ? data.footer_logo_url : process.env.NEXT_PUBLIC_API_URL + data.footer_logo_url}`);
        }
        if (data.mobile_logo_url) {
          setMobileLogoUrl(`${data.mobile_logo_url?.startsWith('http') ? data.mobile_logo_url : process.env.NEXT_PUBLIC_API_URL + data.mobile_logo_url}`);
        }
        if (data.hamburger_logo_url) {
          setHamburgerLogoUrl(`${data.hamburger_logo_url?.startsWith('http') ? data.hamburger_logo_url : process.env.NEXT_PUBLIC_API_URL + data.hamburger_logo_url}`);
        }
        if (data.header_links && Array.isArray(data.header_links) && data.header_links.length > 0) {
          const links = data.header_links;
          const mid = Math.ceil(links.length / 2);
          setLeftLinks(links.slice(0, mid));
          setRightLinks(links.slice(mid));
        }
      })
      .catch(err => console.error("Error fetching settings:", err));
  }, []);

  return (
    <>
      <header className={`${isProductDetailPage ? 'fixed md:absolute' : 'fixed'} w-full z-50 pt-4 md:pt-8 top-0 left-0 transition-transform duration-300 ease-in-out pointer-events-none ${(isScrolling && !isMobileMenuOpen && window.scrollY > 50) ? '-translate-y-[150%] md:translate-y-0' : 'translate-y-0'}`}>
        <div className="max-w-4xl mx-auto px-4 relative flex justify-center">
          {/* Pill Background (Mobile & Desktop) */}
          <div className="bg-meewa-red rounded-full flex items-center justify-between md:justify-center gap-4 md:gap-10 h-14 px-4 md:px-6 shadow-xl shadow-red-500/20 w-[92%] md:w-fit mx-auto pointer-events-auto relative">
            
            {/* Left Spacer (Mobile) */}
            <div className="md:hidden w-8"></div>

            {/* Left Navigation (Desktop) */}
            <div className="hidden md:flex w-[240px] lg:w-[280px] justify-end">
              <nav className="flex space-x-4 lg:space-x-8 text-white text-sm font-medium items-center">
                {leftLinks.map((link, idx) => (
                  <NavLink key={idx} href={link.href}>{link.label}</NavLink>
                ))}
              </nav>
            </div>

            {/* Center Logo Area (Placeholder space for absolute circle) */}
            <div className="hidden md:block w-24 flex-shrink-0"></div>

            {/* Right Navigation (Desktop) */}
            <div className="hidden md:flex w-[240px] lg:w-[300px] justify-start">
              <nav className="flex space-x-4 lg:space-x-8 text-white text-sm font-medium items-center">
                {rightLinks.map((link, idx) => (
                  <NavLink key={idx} href={link.href}>{link.label}</NavLink>
                ))}
              </nav>
            </div>

            {/* Mobile Hamburger Button */}
            <button 
              className="md:hidden text-white p-2 focus:outline-none z-50"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 6h18M3 10h18M3 14h18M3 18h18" />
                )}
              </svg>
            </button>
          </div>

          {/* Floating Circular Logo (Mobile & Desktop) */}
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className={`flex absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full w-[70px] h-[70px] md:w-24 md:h-24 flex-col items-center justify-center shadow-xl shadow-red-500/10 border-[3px] md:border-4 border-white overflow-hidden hover:scale-110 transition-all duration-300 z-50 pointer-events-auto ${isMobileMenuOpen && !isProductDetailPage ? 'md:opacity-100 opacity-0 pointer-events-none md:pointer-events-auto translate-y-[-100px] md:translate-y-[-50%]' : 'opacity-100 -translate-y-1/2'}`}>
            {logoUrl ? (
              <img src={logoUrl} alt="MEEWA Logo" className="w-full h-full object-contain p-1.5 md:p-2" />
            ) : (
              <div className="text-meewa-red flex flex-col items-center justify-center h-full">
                <span className="text-sm font-bold tracking-widest"></span>
              </div>
            )}
          </Link>
        </div>
      </header>

      {/* Mobile Menu Sidebar Overlay */}
      <div 
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setIsMobileMenuOpen(false)}
      ></div>
      
      {/* Sidebar Content */}
      <div className={`fixed inset-y-0 right-0 z-50 w-64 bg-meewa-red/95 backdrop-blur-md shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden flex flex-col p-6 pt-10 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Horizontal Logo in Sidebar */}
        <div className="mb-8">
          {(hamburgerLogoUrl || footerLogoUrl || logoUrl) ? (
            <img src={(hamburgerLogoUrl || footerLogoUrl || logoUrl)!} alt="MEEWA Logo" className="h-10 object-contain" />
          ) : null}
        </div>



        <div className="flex flex-col space-y-4 mt-12">
          {[...leftLinks, ...rightLinks].map((link, idx) => (
            <MobileNavLink key={idx} href={link.href} onClick={() => setIsMobileMenuOpen(false)}>
              {link.label}
            </MobileNavLink>
          ))}
        </div>
      </div>
    </>
  );
}
