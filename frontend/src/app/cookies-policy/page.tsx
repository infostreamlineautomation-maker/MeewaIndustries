import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookies Policy | MEEWA Industries',
};

export default function CookiesPage() {
  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* Header Banner */}
      <div className="bg-meewa-dark py-20 text-white relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none flex items-center justify-center">
          <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-meewa-red via-transparent to-transparent opacity-50"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Cookies Policy</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            How we use cookies to improve your experience.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl p-10 border border-gray-100">
          <div className="prose prose-lg text-gray-600 max-w-none prose-headings:text-meewa-dark prose-a:text-meewa-red">
            <p><strong>Last updated:</strong> {new Date().toLocaleDateString()}</p>
            <h2>What are cookies?</h2>
            <p>Cookies are small text files stored on your device when you access our website. They help us improve your experience and understand how you interact with our content.</p>
            <h2>How we use cookies</h2>
            <ul>
              <li><strong>Essential Cookies:</strong> Required for the website to function properly.</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how visitors use the site.</li>
              <li><strong>Functional Cookies:</strong> Remember your preferences and settings.</li>
            </ul>
            <p>You can manage your cookie preferences through your browser settings.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
