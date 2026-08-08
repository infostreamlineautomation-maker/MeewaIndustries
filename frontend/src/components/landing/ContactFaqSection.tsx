"use client";
import { fetchClientSettings } from '@/lib/fetchClientSettings';

import { useState, useEffect } from 'react';

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
          <div className="w-full lg:w-5/12 bg-meewa-dark rounded-3xl p-10 text-white shadow-xl">
            <h2 className="text-4xl font-bold text-meewa-red mb-4">Get In Touch</h2>
            <p className="text-gray-400 text-sm mb-10">
              Get product details, pricing, samples, and export support. We'll respond within 24 hours.
            </p>

            <div className="space-y-4 mb-12">
              <div className="flex items-center p-4 border border-gray-800 rounded-xl bg-gray-900/50">
                <div className="w-10 flex-shrink-0 flex justify-center text-gray-400">📞</div>
                <div>
                  <h4 className="text-sm font-semibold">Call Us</h4>
                  <p className="text-xs text-gray-400">{settings.contact_phone || "Speak directly with our export team."}</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 border border-gray-800 rounded-xl bg-gray-900/50">
                <div className="w-10 flex-shrink-0 flex justify-center text-gray-400">✉️</div>
                <div>
                  <h4 className="text-sm font-semibold">Email Us</h4>
                  <p className="text-xs text-gray-400">{settings.contact_email || "Send your product requirements anytime."}</p>
                </div>
              </div>

              <div className="flex items-center p-4 border border-gray-800 rounded-xl bg-gray-900/50">
                <div className="w-10 flex-shrink-0 flex justify-center text-meewa-red">📍</div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Office Address</h4>
                  <p className="text-xs text-gray-400">{settings.contact_address || "Your Company Address, Gujarat, India"}</p>
                </div>
              </div>

              <div className="flex items-center p-4 border border-gray-800 rounded-xl bg-gray-900/50">
                <div className="w-10 flex-shrink-0 flex justify-center text-green-500">💬</div>
                <div>
                  <h4 className="text-sm font-semibold">WhatsApp Us</h4>
                  <p className="text-xs text-gray-400">{settings.contact_whatsapp || "Chat directly with our export team."}</p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-4">Connect with us</p>
              <div className="flex space-x-4 text-gray-400">
                <a href="#" className="hover:text-white">in</a>
                <a href="#" className="hover:text-white">f</a>
                <a href="#" className="hover:text-white">ig</a>
                <a href="#" className="hover:text-white">yt</a>
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
