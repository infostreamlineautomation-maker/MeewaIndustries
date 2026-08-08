"use client";
import { fetchClientSettings } from '@/lib/fetchClientSettings';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function FeaturedCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    // Fetch Settings
    fetchClientSettings()
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error(err));

    // Fetch Categories
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`)
      .then(res => res.json())
      .then(data => setCategories(data || []))
      .catch(err => console.error(err));
  }, []);

  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const displayedCategories = categories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="bg-gray-50 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-meewa-red tracking-wide uppercase">
            {settings.portfolio_title || "Our Portfolio"}
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold text-gray-900 sm:text-4xl">
            {settings.portfolio_subtitle || "Explore Product Categories"}
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Browse our comprehensive range of high-quality export products.
          </p>
        </div>

        {categories.length === 0 ? (
          <div className="mt-16 text-center text-gray-500">No categories found.</div>
        ) : (
          <div className="mt-16 grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-4 xl:gap-x-8">
            {displayedCategories.map((category) => (
              <div key={category.id} className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col h-full">
                <div className="w-full h-48 bg-gray-200 overflow-hidden group-hover:opacity-75">
                  {category.cover_image ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL}${category.cover_image}`}
                      alt={category.name}
                      className="w-full h-full object-center object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                  )}
                </div>
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      <Link href={`/categories/${category.id}`}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {category.name}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">{category.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-10 flex justify-center items-center space-x-4">
            <button 
              onClick={prevPage} 
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-meewa-red text-white hover:bg-red-700'}`}
            >
              Previous
            </button>
            <span className="text-gray-600 font-medium">Page {currentPage} of {totalPages}</span>
            <button 
              onClick={nextPage} 
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md ${currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-meewa-red text-white hover:bg-red-700'}`}
            >
              Next
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
