import { fetchServerSettings } from '@/lib/fetchSettings';
import Image from 'next/image';

export default async function ExportProcess() {
  let settings: any = {};
  try {
    const res = await fetchServerSettings();
    settings = await res.json();
  } catch(e) {}

  const steps = settings.landing_export_steps && settings.landing_export_steps.length > 0 
    ? settings.landing_export_steps 
    : [
      { num: "01", title: "Inquiry", desc: "Share your product requirements and order details." },
      { num: "02", title: "Quotation", desc: "Receive pricing based on your quantity and specifications." },
      { num: "03", title: "Sample Approval", desc: "Review samples before bulk production." },
      { num: "04", title: "Production", desc: "Manufacturing begins with quality monitoring." },
      { num: "05", title: "Quality Check", desc: "Products are inspected before shipment." },
      { num: "06", title: "Global Shipping", desc: "Orders are packed and delivered worldwide." },
    ];

  return (
    <section className="pt-4 md:pt-4 pb-4 md:pb-4 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 md:mb-12">
        <h2 className="text-[24px] sm:text-[28px] md:text-[40px] font-medium text-meewa-red leading-none tracking-normal mb-2 md:mb-4">
          {settings.export_title || "Export Process"}
        </h2>
        <p className="text-gray-600 text-[11px] md:text-lg">
          {settings.export_subtitle || "We make international sourcing easy with a transparent export process."}
        </p>
      </div>

      {/* Floating Card Layout */}
      <div className="max-w-[1262px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row rounded-[10px] overflow-hidden lg:h-[550px]">
          
          {/* Left Side: Red Background with Steps */}
          <div className="bg-meewa-red text-white w-full lg:w-[656px] p-6 md:p-12 lg:p-12 flex flex-col justify-center rounded-xl md:rounded-[10px] lg:rounded-none">
          <div className="space-y-4 md:space-y-6">
            {steps.map((step: any, idx: number) => (
              <div key={idx} className="flex flex-row items-start space-x-3 md:space-x-6 group">
                <div className="text-[28px] md:text-4xl font-light opacity-90 transition-opacity mt-[-4px]">
                  {step.num}
                  <span className="text-white ml-0 text-sm md:text-xl">.</span>
                </div>
                <div className="mt-0 flex-1">
                  <h3 className="text-[14px] md:text-xl font-medium md:font-bold mb-0.5 md:mb-1 leading-tight">{step.title}</h3>
                  <p className="text-white/90 text-[11px] md:text-sm leading-tight">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Image/Video */}
        <div className="hidden lg:flex w-full lg:w-[606px] min-h-[300px] lg:min-h-full relative bg-white items-center justify-center">
          {settings.export_process_media_url ? (
            settings.export_process_media_url.endsWith('.mp4') ? (
              <video 
                src={`${settings.export_process_media_url?.startsWith('http') ? settings.export_process_media_url : process.env.NEXT_PUBLIC_API_URL + settings.export_process_media_url}`}
                autoPlay 
                loop 
                muted 
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <img 
                src={`${settings.export_process_media_url?.startsWith('http') ? settings.export_process_media_url : process.env.NEXT_PUBLIC_API_URL + settings.export_process_media_url}`}
                alt="Export Process" 
                className="absolute inset-0 w-full h-full object-cover"
              />
            )
          ) : (
            <div className="text-gray-400 text-center p-8 flex flex-col items-center">
              <svg className="w-16 h-16 mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <p className="text-sm font-medium">No media uploaded yet.</p>
              <p className="text-xs mt-1">Upload an image or video in Admin Settings.</p>
            </div>
          )}
          </div>

        </div>
      </div>
    </section>
  );
}
