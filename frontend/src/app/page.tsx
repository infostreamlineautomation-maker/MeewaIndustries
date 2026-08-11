import HeroSection from '@/components/landing/HeroSection';
import FeaturedProducts from '@/components/landing/FeaturedProducts';
import WhyChooseUs from '@/components/landing/WhyChooseUs';
import ExportProcess from '@/components/landing/ExportProcess';
import IndustriesWeServe from '@/components/landing/IndustriesWeServe';
import AboutCompany from '@/components/landing/AboutCompany';
import ContactFaqSection from '@/components/landing/ContactFaqSection';

export default function Home() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <HeroSection />
      <FeaturedProducts />
      <WhyChooseUs />
      <ExportProcess />
      <IndustriesWeServe />
      <AboutCompany />
      <ContactFaqSection />
    </div>
  );
}
