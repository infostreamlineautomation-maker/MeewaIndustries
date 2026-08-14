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
    <section className="pb-10 md:pb-16 pt-32 md:pt-48 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      <h2 className="text-[28px] sm:text-[32px] md:text-[60px] font-medium text-meewa-red text-center leading-none tracking-normal mb-6 md:mb-16">Our Products</h2>
      
      <div className="relative">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-6 md:gap-x-8 md:gap-y-12 min-h-[400px] md:min-h-[800px]">
        {currentProducts.map((prod: any) => (
          <Link href={`/products/${prod.slug || '#'}`} key={prod.id} className="flex flex-col group cursor-pointer">
            <div className="w-full aspect-[4/5] bg-gray-100 rounded-lg md:rounded-3xl overflow-hidden mb-2 md:mb-4 shadow-sm group-hover:shadow-lg transition-shadow border border-gray-200 relative">
              {prod.cover_image ? (
                <img src={`${prod.cover_image?.startsWith('http') ? prod.cover_image : process.env.NEXT_PUBLIC_API_URL + prod.cover_image}`} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full bg-gray-200"></div>
              )}
            </div>
            <h3 className="text-gray-900 font-bold text-[12px] md:text-2xl leading-tight text-center px-1 md:px-2">{prod.name}</h3>
          </Link>
        ))}
      </div>

          {/* Floating Pagination Arrows */}
          {totalPages > 1 && (
            <>
              <button 
                onClick={handlePrevPage}
                className="absolute -left-4 md:-left-12 lg:-left-20 xl:-left-24 top-1/2 -translate-y-1/2 z-10 bg-white shadow-xl border border-gray-100 rounded-full w-14 h-14 flex items-center justify-center text-gray-500 hover:text-meewa-red hover:scale-110 transition-all opacity-80 hover:opacity-100 hidden md:flex"
                aria-label="Previous Page"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
              </button>
              
              <button 
                onClick={handleNextPage}
                className="absolute -right-4 md:-right-12 lg:-right-20 xl:-right-24 top-1/2 -translate-y-1/2 z-10 bg-white shadow-xl border border-gray-100 rounded-full w-14 h-14 flex items-center justify-center text-gray-500 hover:text-meewa-red hover:scale-110 transition-all opacity-80 hover:opacity-100 hidden md:flex"
                aria-label="Next Page"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path></svg>
              </button>
            </>
          )}
      </div>

      {/* Pagination (Below grid) */}
      {totalPages > 1 && (
          <div className="flex justify-center items-center mt-12 gap-1.5 md:hidden">
            <button 
              onClick={handlePrevPage}
              disabled={currentPage === 0}
              className="bg-white border border-gray-100 rounded-[4px] w-7 h-7 flex items-center justify-center text-gray-500 hover:text-meewa-red disabled:opacity-50"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            
            {/* Logic to show pages */}
            {[...Array(totalPages)].map((_, i) => {
              if (totalPages > 5) {
                if (i === 0 || i === totalPages - 1 || (i >= currentPage - 1 && i <= currentPage + 1)) {
                  return (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i)}
                      className={`rounded-[4px] w-7 h-7 flex items-center justify-center text-[10px] font-medium ${currentPage === i ? 'bg-[#EE3050] text-white border border-[#EE3050]' : 'bg-white border border-gray-100 text-gray-600 hover:text-[#EE3050]'}`}
                    >
                      {i + 1}
                    </button>
                  );
                } else if (i === currentPage - 2 || i === currentPage + 2) {
                  return <span key={i} className="text-gray-400 text-[10px] px-1">...</span>;
                }
                return null;
              } else {
                 return (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i)}
                      className={`rounded-[4px] w-7 h-7 flex items-center justify-center text-[10px] font-medium ${currentPage === i ? 'bg-[#EE3050] text-white border border-[#EE3050]' : 'bg-white border border-gray-100 text-gray-600 hover:text-[#EE3050]'}`}
                    >
                      {i + 1}
                    </button>
                  );
              }
            })}

            <button 
              onClick={handleNextPage}
              disabled={currentPage === totalPages - 1}
              className="bg-white border border-gray-100 rounded-[4px] w-7 h-7 flex items-center justify-center text-gray-500 hover:text-meewa-red disabled:opacity-50"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
          </div>
      )}
    </section>
  );
}

