"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function ContactFormInner() {
  const searchParams = useSearchParams();
  const initialProductId = searchParams.get("product");

  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: ""
  });

  const [requestedProducts, setRequestedProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`)
        ]);
        const cats = await catRes.json();
        const prods = await prodRes.json();
        setCategories(cats);
        setProducts(prods);

        // Auto-add product if query param exists
        if (initialProductId) {
          const preSelectedProd = prods.find((p: any) => p.id.toString() === initialProductId);
          if (preSelectedProd) {
            setRequestedProducts([{
              product_id: preSelectedProd.id,
              product_name: preSelectedProd.name,
              category_id: preSelectedProd.category_id,
              category_name: preSelectedProd.category?.name || cats.find((c: any) => c.id === preSelectedProd.category_id)?.name || "",
              quantity: preSelectedProd.moq || "" // default moq or empty
            }]);
          }
        }
      } catch (err) {
        console.error("Error fetching categories or products:", err);
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, [initialProductId]);

  const handleAddProduct = () => {
    setRequestedProducts([...requestedProducts, { category_id: "", product_id: "", quantity: "", product_name: "", category_name: "" }]);
  };

  const handleRemoveProduct = (index: number) => {
    const updated = [...requestedProducts];
    updated.splice(index, 1);
    setRequestedProducts(updated);
  };

  const handleProductChange = (index: number, field: string, value: string) => {
    const updated = [...requestedProducts];
    if (field === "category_id") {
      updated[index].category_id = value;
      const cat = categories.find((c: any) => c.id.toString() === value);
      updated[index].category_name = cat ? cat.name : "";
      // Reset product when category changes
      updated[index].product_id = "";
      updated[index].product_name = "";
    } else if (field === "product_id") {
      updated[index].product_id = value;
      const prod = products.find((p: any) => p.id.toString() === value);
      updated[index].product_name = prod ? prod.name : "";
      if (prod && !updated[index].quantity) {
          updated[index].quantity = prod.moq || "";
      }
    } else {
      updated[index][field] = value;
    }
    setRequestedProducts(updated);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        products_requested: requestedProducts.filter(p => p.product_id), // Only send if product selected
        source_page: "Contact Form"
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/enquiries/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert("Your inquiry has been submitted successfully!");
        setFormData({ name: "", phone: "", email: "", message: "" });
        setRequestedProducts([]);
      } else {
        alert("Failed to submit inquiry. Please try again.");
      }
    } catch (error) {
      alert("An error occurred while submitting.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="fullName" className="block text-xl font-medium text-gray-900 mb-3">Full Name</label>
          <input 
            type="text" 
            id="fullName" 
            required
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="block w-full rounded-xl border border-gray-200 bg-white py-4 px-5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-meewa-red transition-shadow" 
            placeholder="Enter Your Name*" 
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-xl font-medium text-gray-900 mb-3">Phone Number</label>
          <input 
            type="tel" 
            id="phone" 
            required
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            className="block w-full rounded-xl border border-gray-200 bg-white py-4 px-5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-meewa-red transition-shadow" 
            placeholder="Enter Your Phone Number*" 
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="email" className="block text-xl font-medium text-gray-900 mb-3">Email Address</label>
        <input 
          type="email" 
          id="email" 
          required
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          className="block w-full rounded-xl border border-gray-200 bg-white py-4 px-5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-meewa-red transition-shadow" 
          placeholder="Enter Your Email*" 
        />
      </div>

      {/* Quote / Products Section */}
      <div className="border-t border-gray-200 pt-6 mt-6">
        <div className="flex justify-between items-center mb-4">
          <label className="block text-xl font-medium text-gray-900">Request a Quote (Optional)</label>
          <button 
            type="button" 
            onClick={handleAddProduct}
            className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
          >
            + Add Product
          </button>
        </div>
        
        {!loadingData && requestedProducts.length > 0 && (
          <div className="space-y-4">
            {requestedProducts.map((rp, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 relative pr-10">
                
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select 
                    value={rp.category_id}
                    onChange={(e) => handleProductChange(index, "category_id", e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 bg-white py-2.5 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-meewa-red"
                  >
                    <option value="">Select Category</option>
                    {categories.map((c: any) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                  <select 
                    value={rp.product_id}
                    onChange={(e) => handleProductChange(index, "product_id", e.target.value)}
                    disabled={!rp.category_id}
                    className="block w-full rounded-lg border border-gray-300 bg-white py-2.5 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-meewa-red disabled:bg-gray-100"
                  >
                    <option value="">Select Product</option>
                    {products.filter((p: any) => p.category_id.toString() === rp.category_id.toString()).map((p: any) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div className="w-full md:w-32">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <input 
                    type="text" 
                    value={rp.quantity}
                    onChange={(e) => handleProductChange(index, "quantity", e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 bg-white py-2.5 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-meewa-red" 
                    placeholder="e.g. 10000" 
                  />
                </div>

                <button 
                  type="button"
                  onClick={() => handleRemoveProduct(index)}
                  className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400 hover:text-red-500 rounded-full w-6 h-6 flex items-center justify-center transition-colors"
                  title="Remove product"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ))}
          </div>
        )}
        {loadingData && requestedProducts.length > 0 && <p className="text-sm text-gray-500">Loading products...</p>}
      </div>

      <div>
        <label htmlFor="message" className="block text-xl font-medium text-gray-900 mb-3">Your Message</label>
        <textarea 
          id="message" 
          required
          rows={6} 
          value={formData.message}
          onChange={(e) => setFormData({...formData, message: e.target.value})}
          className="block w-full rounded-xl border border-gray-200 bg-white py-4 px-5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-meewa-red transition-shadow resize-none" 
          placeholder="Enter Your Message*"
        ></textarea>
      </div>
      
      <div className="pt-4">
        <button type="submit" className="bg-[#C9253B] text-white py-4 px-10 rounded-full hover:bg-red-700 font-semibold shadow-md hover:shadow-lg transition-all text-lg">
          Submit Inquiry
        </button>
      </div>
    </form>
  );
}

export default function ContactForm() {
  return (
    <Suspense fallback={<div>Loading form...</div>}>
      <ContactFormInner />
    </Suspense>
  )
}
