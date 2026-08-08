"use client";
import { fetchClientSettings } from '@/lib/fetchClientSettings';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  let isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
  if (href === '/categories' && pathname.startsWith('/products')) {
    isActive = true;
  }
  
  return (
    <Link 
      href={href} 
      className={`relative px-4 py-2 transition-all duration-300 rounded-full group overflow-hidden ${isActive ? 'text-meewa-red font-bold shadow-sm' : 'text-white hover:text-white'}`}
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
  if (href === '/categories' && pathname.startsWith('/products')) {
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
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [leftLinks, setLeftLinks] = useState([{ label: "Home", href: "/" }, { label: "About Us", href: "/about" }]);
  const [rightLinks, setRightLinks] = useState([{ label: "Our Product", href: "/categories" }, { label: "Contact Us", href: "/contact" }]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetchClientSettings()
      .then(res => res.json())
      .then(data => {
        if (data.site_logo_url) {
          setLogoUrl(`${process.env.NEXT_PUBLIC_API_URL}${data.site_logo_url}`);
        }
        if (data.header_links && Array.isArray(data.header_links)) {
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
      <header className={`fixed w-full z-50 transition-all duration-300 pt-6 ${isScrolled ? 'top-[-10px] transform translate-y-2' : 'top-0'}`}>
        <div className="max-w-4xl mx-auto px-4 relative flex justify-center">
          {/* Desktop & Mobile Pill Background */}
          <div className="bg-meewa-red rounded-full flex items-center justify-between md:justify-center gap-4 md:gap-10 h-14 px-6 md:px-6 shadow-xl shadow-red-500/20 w-full md:w-fit animate-float">
            
            {/* Mobile Hamburger Button */}
            <button 
              className="md:hidden text-white p-2 focus:outline-none z-50"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* Left Navigation (Desktop) */}
            <nav className="hidden md:flex space-x-10 text-white text-sm font-medium items-center">
              {leftLinks.map((link, idx) => (
                <NavLink key={idx} href={link.href}>{link.label}</NavLink>
              ))}
            </nav>

            {/* Center Logo Area (Placeholder space for absolute circle) */}
            <div className="hidden md:block w-20"></div>

            {/* Right Navigation (Desktop) */}
            <nav className="hidden md:flex space-x-10 text-white text-sm font-medium items-center">
              {rightLinks.map((link, idx) => (
                <NavLink key={idx} href={link.href}>{link.label}</NavLink>
              ))}
            </nav>

            {/* Mobile Empty Spacer for balancing the hamburger so the logo stays centered */}
            <div className="md:hidden w-10"></div>
          </div>

          {/* Floating Circular Logo */}
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full w-20 h-20 md:w-24 md:h-24 flex flex-col items-center justify-center shadow-xl shadow-red-500/10 border-4 border-white overflow-hidden hover:scale-110 transition-transform duration-300 animate-float z-50" style={{ animationDelay: '0.5s' }}>
            {logoUrl ? (
              <img src={logoUrl} alt="MEEWA Logo" className="w-full h-full object-contain p-2" />
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
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-meewa-red shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden flex flex-col p-6 pt-12 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Close Button */}
        <button 
          className="absolute top-4 right-4 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

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
