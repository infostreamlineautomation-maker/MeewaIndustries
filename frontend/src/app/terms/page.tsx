import { fetchServerSettings } from '@/lib/fetchSettings';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms and Conditions | MEEWA Industries',
  description: 'Terms and Conditions for MEEWA Industries',
};

export default async function TermsPage() {
  let settings: any = {};
  try {
    const res = await fetchServerSettings();
    settings = await res.json();
  } catch (error) {
    console.error("Failed to fetch settings for terms:", error);
  }

  const content = settings.terms_content || "These are the terms and conditions for using our website.";

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 border-b pb-6">Terms and Conditions</h1>
          <div className="prose prose-lg max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
            {content}
          </div>
        </div>
      </div>
    </div>
  );
}
