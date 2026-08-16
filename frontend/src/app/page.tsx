import { fetchServerSettings } from '@/lib/fetchSettings';
import HeroSection from '@/components/landing/HeroSection';
import FeaturedProducts from '@/components/landing/FeaturedProducts';
import WhyChooseUs from '@/components/landing/WhyChooseUs';
import ExportProcess from '@/components/landing/ExportProcess';
import IndustriesWeServe from '@/components/landing/IndustriesWeServe';
import AboutCompany from '@/components/landing/AboutCompany';
import ContactFaqSection from '@/components/landing/ContactFaqSection';

export default async function Home() {
  let settings: any = {};
  try {
    const res = await fetchServerSettings();
    if (res.ok) {
      settings = await res.json();
    }
  } catch (e) {
    console.error("Could not fetch settings:", e);
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {settings.hide_landing_hero !== "true" && <HeroSection />}
      {settings.hide_landing_featured !== "true" && <FeaturedProducts />}
      {settings.hide_landing_why !== "true" && <WhyChooseUs />}
      {settings.hide_landing_export !== "true" && <ExportProcess />}
      {settings.hide_landing_industries !== "true" && <IndustriesWeServe />}
      {settings.hide_landing_about !== "true" && <AboutCompany />}
      {settings.hide_landing_contact !== "true" && <ContactFaqSection />}
    </div>
  );
}
