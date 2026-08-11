"use client";
import { fetchClientSettings } from '@/lib/fetchClientSettings';

import { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';

const defaultFaqs = [
  { question: "What products do you manufacture?", answer: "Detailed answer for \"What products do you manufacture?\" will be added here. Our team is always ready to provide comprehensive support for your specific needs." },
  { question: "Do you offer custom printing?", answer: "Yes, we offer custom printing on many of our packaging products to help your brand stand out." },
  { question: "What is your minimum order quantity?", answer: "Our minimum order quantity varies by product. Please contact our sales team for detailed information." },
  { question: "Which countries do you export to?", answer: "We export globally to many countries across North America, Europe, Asia, and the Middle East." },
  { question: "Can I request product samples?", answer: "Yes, product samples are available upon request to ensure quality meets your standards before bulk ordering." }
];

export default function ContactFaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [settings, setSettings] = useState<any>({});
  const [faqs, setFaqs] = useState<any[]>(defaultFaqs);

  useEffect(() => {
    fetchClientSettings()
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        if (data.landing_faqs && data.landing_faqs.length > 0) {
          setFaqs(data.landing_faqs);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Left: Get In Touch */}
          <div className="w-full lg:w-5/12 bg-gray-100 rounded-3xl p-10 text-gray-900 shadow-xl border border-gray-200">
            <h2 className="text-4xl font-bold text-meewa-red mb-4">Get In Touch</h2>
            <p className="text-gray-600 text-sm mb-10">
              Get product details, pricing, samples, and export support. We'll respond within 24 hours.
            </p>

            <div className="space-y-4 mb-12">
              <div className="flex items-center p-4 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 flex-shrink-0 flex justify-center text-meewa-red">
                  <Phone size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Call Us</h4>
                  <p className="text-xs text-gray-600">{settings.contact_phone || "Speak directly with our export team."}</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 flex-shrink-0 flex justify-center text-meewa-red">
                  <Mail size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Email Us</h4>
                  <p className="text-xs text-gray-600">{settings.contact_email || "Send your product requirements anytime."}</p>
                </div>
              </div>

              <div className="flex items-center p-4 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 flex-shrink-0 flex justify-center text-meewa-red">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Office Address</h4>
                  <p className="text-xs text-gray-600">{settings.contact_address || "Your Company Address, Gujarat, India"}</p>
                </div>
              </div>

              <div className="flex items-center p-4 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 flex-shrink-0 flex justify-center text-green-600">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">WhatsApp Us</h4>
                  <p className="text-xs text-gray-600">{settings.contact_whatsapp || "Chat directly with our export team."}</p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500 mb-4 uppercase tracking-wider">Connect with us</p>
              <div className="flex space-x-5 text-gray-500">
                <a href="#" className="hover:text-meewa-red transition-colors" aria-label="LinkedIn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                </a>
                <a href="#" className="hover:text-meewa-red transition-colors" aria-label="Facebook">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </a>
                <a href="#" className="hover:text-meewa-red transition-colors" aria-label="Instagram">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </a>
                <a href="#" className="hover:text-meewa-red transition-colors" aria-label="YouTube">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 7.17c.1-1.37 1.2-2.47 2.57-2.57 2.13-.16 4.96-.27 6.93-.27s4.8.11 6.93.27c1.37.1 2.47 1.2 2.57 2.57.17 2.24.27 4.54.27 4.83 0 .29-.1 2.59-.27 4.83-.1 1.37-1.2 2.47-2.57 2.57-2.13.16-4.96.27-6.93.27s-4.8-.11-6.93-.27c-1.37-.1-2.47-1.2-2.57-2.57-.17-2.24-.27-4.54-.27-4.83 0-.29.1-2.59.27-4.83z"/><polygon points="9.5 15.02 15.5 12 9.5 8.98 9.5 15.02"/></svg>
                </a>
              </div>
            </div>
          </div>

          {/* Right: FAQs */}
          <div className="w-full lg:w-7/12">
            <h2 className="text-4xl font-bold text-meewa-red mb-10">FAQs</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-gray-300 rounded-xl overflow-hidden transition-all duration-200">
                  <button 
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between p-6 text-left focus:outline-none hover:bg-gray-50"
                  >
                    <span className="text-gray-800 font-medium">{index + 1}. {faq.question}</span>
                    <span className="text-gray-400 text-xl font-light">
                      {openIndex === index ? '−' : '+'}
                    </span>
                  </button>
                  {openIndex === index && (
                    <div className="p-6 pt-0 text-gray-600 text-sm whitespace-pre-wrap">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
