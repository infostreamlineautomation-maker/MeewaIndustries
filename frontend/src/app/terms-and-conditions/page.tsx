import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms and Conditions | MEEWA Industries',
};

export default function TermsPage() {
  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* Header Banner */}
      <div className="bg-meewa-dark py-20 text-white relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none flex items-center justify-center">
          <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-meewa-red via-transparent to-transparent opacity-50"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms and Conditions</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Please read these terms and conditions carefully.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl p-10 border border-gray-100">
          <div className="prose prose-lg text-gray-600 max-w-none prose-headings:text-meewa-dark prose-a:text-meewa-red">
            <p><strong>Last updated:</strong> {new Date().toLocaleDateString()}</p>
            <p>Please read these terms and conditions carefully before using our website or placing an order.</p>
            <h2>1. B2B Transactions</h2>
            <p>All transactions on this site are strictly B2B (Business to Business). Minimum Order Quantities (MOQ) apply to all products.</p>
            <h2>2. Shipping and Delivery</h2>
            <p>FOB or CIF terms will be agreed upon per order. Delivery timelines depend on product availability and shipping destinations.</p>
            <h2>3. Quality Assurance</h2>
            <p>We guarantee that our products meet the specifications outlined in the proforma invoice.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
