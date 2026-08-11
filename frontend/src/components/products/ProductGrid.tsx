"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function ProductGrid({ products }: { products: any[] }) {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 12;
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const currentProducts = products.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  return (
    <section className="pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      <h2 className="text-4xl md:text-5xl font-bold text-meewa-red text-center mb-16 pt-10">Our Products</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 min-h-[800px]">
        {currentProducts.map((prod: any) => (
          <Link href={`/products/${prod.slug || '#'}`} key={prod.id} className="flex flex-col group cursor-pointer">
            <div className="w-full aspect-[4/5] bg-gray-100 rounded-3xl overflow-hidden mb-4 shadow-sm group-hover:shadow-lg transition-shadow border border-gray-200 relative">
              {prod.cover_image ? (
                <img src={`${prod.cover_image?.startsWith('http') ? prod.cover_image : process.env.NEXT_PUBLIC_API_URL + prod.cover_image}`} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full bg-gray-200"></div>
              )}
            </div>
            <h3 className="text-gray-900 font-bold text-2xl leading-tight text-center">{prod.name}</h3>
          </Link>
        ))}
      </div>

      {/* Floating Pagination Arrows */}
      {totalPages > 1 && (
        <>
          <button 
            onClick={handlePrevPage}
            className="fixed left-4 top-1/2 -translate-y-1/2 z-50 bg-white shadow-xl border border-gray-100 rounded-full w-14 h-14 flex items-center justify-center text-gray-500 hover:text-meewa-red hover:scale-110 transition-all opacity-80 hover:opacity-100 hidden md:flex"
            aria-label="Previous Page"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
          </button>
          
          <button 
            onClick={handleNextPage}
            className="fixed right-4 top-1/2 -translate-y-1/2 z-50 bg-white shadow-xl border border-gray-100 rounded-full w-14 h-14 flex items-center justify-center text-gray-500 hover:text-meewa-red hover:scale-110 transition-all opacity-80 hover:opacity-100 hidden md:flex"
            aria-label="Next Page"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path></svg>
          </button>

          {/* Mobile Pagination (Below grid) */}
          <div className="flex justify-center items-center mt-12 gap-4 md:hidden">
            <button 
              onClick={handlePrevPage}
              className="bg-white shadow-md border border-gray-100 rounded-full w-12 h-12 flex items-center justify-center text-gray-500 hover:text-meewa-red"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            <span className="text-gray-500 font-medium">Page {currentPage + 1} of {totalPages}</span>
            <button 
              onClick={handleNextPage}
              className="bg-white shadow-md border border-gray-100 rounded-full w-12 h-12 flex items-center justify-center text-gray-500 hover:text-meewa-red"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
          </div>
        </>
      )}
    </section>
  );
}
