import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Products | Coming Soon',
  description: 'View our premium export products.',
};

export default function ProductsPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 bg-gray-50 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[50%] bg-meewa-red/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[50%] bg-meewa-red/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="text-center bg-white p-12 md:p-16 rounded-[2rem] shadow-xl border border-gray-100 max-w-2xl w-full relative z-10">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-50 text-meewa-red mb-8 shadow-sm">
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">Our Products</h1>
        <p className="text-lg md:text-xl text-gray-500 mb-10 leading-relaxed">
          We are currently curating our extensive product catalog to bring you the best in B2B export. Check back soon for detailed specifications and pricing!
        </p>
        <Link href="/" className="inline-flex items-center px-10 py-4 border border-transparent text-base font-bold rounded-xl shadow-md text-white bg-meewa-red hover:bg-red-700 hover:shadow-lg transition-all hover:-translate-y-0.5">
          Return Home
        </Link>
      </div>
    </div>
  );
}
