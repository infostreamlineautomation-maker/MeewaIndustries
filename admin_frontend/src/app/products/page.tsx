export default function AdminProductsPage() {
  return (
    <div className="max-w-7xl mx-auto h-full flex flex-col items-center justify-center">
      <div className="text-center bg-white p-12 rounded-xl shadow-sm border border-gray-100 max-w-lg w-full">
        <svg className="w-16 h-16 text-meewa-red mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Management</h2>
        <p className="text-gray-500">CRUD operations for Products are coming soon!</p>
      </div>
    </div>
  );
}
