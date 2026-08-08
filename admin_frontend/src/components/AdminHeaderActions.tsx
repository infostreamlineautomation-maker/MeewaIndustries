"use client";

export default function AdminHeaderActions() {
  const handlePublish = async () => {
    if (!confirm("Are you sure you want to publish the drafted settings to the live website?")) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/settings/publish`, {
        method: 'POST'
      });
      if (res.ok) {
        alert('Settings published to the live website successfully!');
      } else {
        alert('Error publishing settings.');
      }
    } catch (err) {
      alert('Error publishing settings.');
    }
  };

  const handlePreview = () => {
    window.open('http://localhost:3000/api/preview', '_blank');
  };

  return (
    <div className="flex items-center gap-3 mr-6">
      <button 
        onClick={handlePreview} 
        className="bg-gray-100 text-gray-800 border border-gray-300 px-4 py-2 rounded-lg font-bold hover:bg-gray-200 transition-colors text-sm shadow-sm"
      >
        Preview Draft
      </button>
      <button 
        onClick={handlePublish} 
        className="bg-meewa-red text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 transition-colors shadow-sm text-sm"
      >
        Publish Live
      </button>
    </div>
  );
}
