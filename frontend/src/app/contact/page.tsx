import { fetchServerSettings } from '@/lib/fetchSettings';
import { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';

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
        <h1 className="text-5xl font-bold text-meewa-red md:w-1/3 tracking-tight">{settings.contact_title || "Contact Us"}</h1>
        <p className="text-lg text-gray-500 md:w-2/3 md:pl-4">
          {settings.contact_subtitle || "If you have any questions, please feel free to get in touch with us via phone, text, email, the form below, or even on social media!"}
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Card: Form */}
          <div className="bg-[#F8F9FA] rounded-[2rem] p-8 md:p-12">
            <ContactForm />
          </div>

          {/* Right Card: Contact Info */}
          <div className="bg-[#F8F9FA] rounded-[2rem] p-8 md:p-12 flex flex-col">
            
            <div className="space-y-4 flex-grow">
              
              {/* Call Us Box */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center shadow-sm">
                <div className="w-10 h-10 bg-gray-50 flex items-center justify-center rounded-lg mr-4 flex-shrink-0 text-xl">📞</div>
                <div>
                  <h4 className="text-gray-900 font-semibold text-sm">Call Us</h4>
                  <p className="text-gray-600 text-sm mt-0.5">{settings.contact_phone || "Speak directly with our export team."}</p>
                </div>
              </div>

              {/* Email Us Box */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center shadow-sm">
                <div className="w-10 h-10 bg-gray-50 flex items-center justify-center rounded-lg mr-4 flex-shrink-0 text-xl">✉️</div>
                <div>
                  <h4 className="text-gray-900 font-semibold text-sm">Email Us</h4>
                  <p className="text-gray-600 text-sm mt-0.5">{settings.contact_email || "Send your product requirements anytime."}</p>
                </div>
              </div>

              {/* Office Address Box */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center shadow-sm">
                <div className="w-10 h-10 bg-gray-50 flex items-center justify-center rounded-lg mr-4 flex-shrink-0 text-xl">📍</div>
                <div>
                  <h4 className="text-gray-900 font-semibold text-sm">Office Address</h4>
                  <p className="text-gray-600 text-sm mt-0.5">{settings.contact_address || "Your Company Address, Gujarat, India"}</p>
                </div>
              </div>

              {/* WhatsApp Box (Replacing duplicate Call Us) */}
              {settings.contact_whatsapp && (
                <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center shadow-sm">
                  <div className="w-10 h-10 bg-gray-50 flex items-center justify-center rounded-lg mr-4 flex-shrink-0 text-xl text-green-500">💬</div>
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
                {/* Placeholder social icons matching the clean style */}
                <a href="#" className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-meewa-red hover:text-white hover:border-meewa-red transition-all">
                  in
                </a>
                <a href="#" className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-meewa-red hover:text-white hover:border-meewa-red transition-all">
                  f
                </a>
                <a href="#" className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-meewa-red hover:text-white hover:border-meewa-red transition-all">
                  ig
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* Map Section */}
        <div className="mt-12 rounded-[2rem] overflow-hidden shadow-sm border border-gray-200 h-[400px] w-full">
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
