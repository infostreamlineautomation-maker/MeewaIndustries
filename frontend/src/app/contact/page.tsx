import { fetchServerSettings } from '@/lib/fetchSettings';
import { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us | MEEWA Industries',
  description: 'Get in touch with MEEWA Industries for your B2B export requirements.',
};

export default async function ContactPage() {
  let settings: any = {};
  try {
    const res = await fetchServerSettings();
    settings = await res.json();
  } catch(e) {}

  return (
    <div className="bg-white min-h-screen pb-24 font-sans">
      
      {/* Header Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 pb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <h1 className="text-4xl md:text-5xl font-bold text-meewa-red md:w-1/3 tracking-tight">{settings.contact_title || "Contact Us"}</h1>
        <p className="text-lg text-gray-500 md:w-2/3 md:pl-4">
          {settings.contact_subtitle || "If you have any questions, please feel free to get in touch with us via phone, text, email, the form below, or even on social media!"}
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Card: Form */}
          <div className="bg-[#F8F9FA] rounded-[2rem] p-6 md:p-12">
            <ContactForm />
          </div>

          {/* Right Card: Contact Info */}
          <div className="bg-[#F8F9FA] rounded-[2rem] p-6 md:p-12 flex flex-col">
            
            <div className="space-y-4 flex-grow">
              
              {/* Call Us Box */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center shadow-sm">
                <div className="w-10 h-10 bg-red-50 flex items-center justify-center rounded-lg mr-4 flex-shrink-0 text-meewa-red">
                  <Phone size={20} />
                </div>
                <div>
                  <h4 className="text-gray-900 font-semibold text-sm">Call Us</h4>
                  <p className="text-gray-600 text-sm mt-0.5">{settings.contact_phone || "Speak directly with our export team."}</p>
                </div>
              </div>

              {/* Email Us Box */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center shadow-sm">
                <div className="w-10 h-10 bg-red-50 flex items-center justify-center rounded-lg mr-4 flex-shrink-0 text-meewa-red">
                  <Mail size={20} />
                </div>
                <div>
                  <h4 className="text-gray-900 font-semibold text-sm">Email Us</h4>
                  <p className="text-gray-600 text-sm mt-0.5">{settings.contact_email || "Send your product requirements anytime."}</p>
                </div>
              </div>

              {/* Office Address Box */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center shadow-sm">
                <div className="w-10 h-10 bg-red-50 flex items-center justify-center rounded-lg mr-4 flex-shrink-0 text-meewa-red">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="text-gray-900 font-semibold text-sm">Office Address</h4>
                  <p className="text-gray-600 text-sm mt-0.5">{settings.contact_address || "Your Company Address, Gujarat, India"}</p>
                </div>
              </div>

              {/* WhatsApp Box */}
              {settings.contact_whatsapp && (
                <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center shadow-sm">
                  <div className="w-10 h-10 bg-green-50 flex items-center justify-center rounded-lg mr-4 flex-shrink-0 text-green-500">
                    <MessageCircle size={20} />
                  </div>
                  <div>
                    <h4 className="text-gray-900 font-semibold text-sm">WhatsApp</h4>
                    <p className="text-gray-600 text-sm mt-0.5">{settings.contact_whatsapp}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Connect With Us Line */}
            <div className="mt-10">
              <div className="flex items-center space-x-4 mb-6">
                <div className="h-px bg-gray-300 flex-grow"></div>
                <span className="text-sm text-gray-500 font-medium">Connect with us</span>
                <div className="h-px bg-gray-300 flex-grow"></div>
              </div>
              <div className="flex justify-center space-x-4">
                <a href="#" className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-meewa-red hover:text-white hover:border-meewa-red transition-all" aria-label="LinkedIn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-meewa-red hover:text-white hover:border-meewa-red transition-all" aria-label="Facebook">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-meewa-red hover:text-white hover:border-meewa-red transition-all" aria-label="Instagram">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-meewa-red hover:text-white hover:border-meewa-red transition-all" aria-label="YouTube">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 7.17c.1-1.37 1.2-2.47 2.57-2.57 2.13-.16 4.96-.27 6.93-.27s4.8.11 6.93.27c1.37.1 2.47 1.2 2.57 2.57.17 2.24.27 4.54.27 4.83 0 .29-.1 2.59-.27 4.83-.1 1.37-1.2 2.47-2.57 2.57-2.13.16-4.96.27-6.93.27s-4.8-.11-6.93-.27c-1.37-.1-2.47-1.2-2.57-2.57-.17-2.24-.27-4.54-.27-4.83 0-.29.1-2.59.27-4.83z"/><polygon points="9.5 15.02 15.5 12 9.5 8.98 9.5 15.02"/></svg>
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* Map Section */}
        <div className="mt-12 rounded-[2rem] overflow-hidden shadow-sm border border-gray-200 h-[300px] md:h-[400px] w-full">
          <iframe 
            src={
              settings.contact_map_url 
                ? (settings.contact_map_url.match(/src="([^"]+)"/) ? settings.contact_map_url.match(/src="([^"]+)"/)[1] : settings.contact_map_url) 
                : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d118105.7481180775!2d70.72023927429188!3d22.27363079089065!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3959c98ac71cbd81%3A0x41ed57a097361d1e!2sRajkot%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
            }
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen={false} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

      </div>
    </div>
  );
}
