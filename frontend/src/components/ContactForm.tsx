"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

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

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("hasSubmittedContact") === "true") {
      setIsSubmitted(true);
    }
    
    const fetchData = async () => {
      try {
        const [prodRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`)
        ]);
        const prods = await prodRes.json();
        setProducts(prods);

        // Auto-add product if query param exists
        if (initialProductId) {
          const preSelectedProd = prods.find((p: any) => p.id.toString() === initialProductId);
          if (preSelectedProd) {
              setRequestedProducts([{
                product_id: preSelectedProd.id,
                product_name: preSelectedProd.name,
                category_id: preSelectedProd.category_id,
                category_name: "",
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
    if (field === "product_id") {
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
    
    // Basic frontend validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    if (!formData.phone || formData.phone.length < 7) {
      setErrorMsg("Please enter a valid phone number with country code.");
      return;
    }
    setErrorMsg("");
    setIsSubmitting(true);

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
        setIsSubmitted(true);
        if (typeof window !== "undefined") {
          localStorage.setItem("hasSubmittedContact", "true");
        }
      } else if (res.status === 429) {
        setErrorMsg("You have sent too many requests. Please try again later.");
      } else {
        setErrorMsg("Failed to submit inquiry. Please try again.");
      }
    } catch (error) {
      setErrorMsg("An error occurred while submitting.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative">
      <style>{`
        .PhoneInputCustom .PhoneInputInput {
          border: none;
          outline: none;
          background: transparent;
          flex: 1;
          min-width: 0;
          font-size: inherit;
          color: inherit;
        }
      `}</style>
      <AnimatePresence mode="wait">
        {isSubmitted ? (
          <motion.div 
            key="success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-16 text-center space-y-4"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <motion.svg 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-10 h-10 text-green-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <motion.path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </motion.svg>
            </div>
            <h3 className="text-3xl font-bold text-gray-900">Thank you for contacting us!</h3>
            <p className="text-lg text-gray-600">We have received your message and will get back to you shortly.</p>
          </motion.div>
        ) : (
          <motion.form 
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit} 
            className="space-y-6"
          >
            {errorMsg && (
              <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm font-medium border border-red-100">
                {errorMsg}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="fullName" className="block text-base md:text-xl font-medium text-gray-900 mb-2 md:mb-3">Full Name</label>
          <input 
            type="text" 
            id="fullName" 
            required
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="block w-full rounded-xl border border-gray-200 bg-white py-3 px-4 md:py-4 md:px-5 text-sm md:text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-meewa-red transition-shadow" 
            placeholder="Enter Your Name*" 
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-base md:text-xl font-medium text-gray-900 mb-2 md:mb-3">Phone Number</label>
          <PhoneInput
            international
            defaultCountry="IN"
            id="phone" 
            value={formData.phone}
            onChange={(val: any) => setFormData({...formData, phone: val || ""})}
            className="flex w-full rounded-xl border border-gray-200 bg-white py-3 px-4 md:py-4 md:px-5 text-sm md:text-base text-gray-900 focus-within:ring-2 focus-within:ring-meewa-red transition-shadow PhoneInputCustom" 
            placeholder="Enter Your Phone Number*" 
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="email" className="block text-base md:text-xl font-medium text-gray-900 mb-2 md:mb-3">Email Address</label>
        <input 
          type="email" 
          id="email" 
          required
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          className="block w-full rounded-xl border border-gray-200 bg-white py-3 px-4 md:py-4 md:px-5 text-sm md:text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-meewa-red transition-shadow" 
          placeholder="Enter Your Email*" 
        />
      </div>

      {/* Quote / Products Section */}
      <div className="border-t border-gray-200 pt-6 mt-6">
        <div className="flex justify-between items-center mb-2 md:mb-4">
          <label className="block text-base md:text-xl font-medium text-gray-900">Request a Quote (Optional)</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                  <select 
                    value={rp.product_id}
                    onChange={(e) => handleProductChange(index, "product_id", e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 bg-white py-2.5 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-meewa-red"
                  >
                    <option value="">Select Product</option>
                    {products.map((p: any) => (
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
        <label htmlFor="message" className="block text-base md:text-xl font-medium text-gray-900 mb-2 md:mb-3">Your Message</label>
        <textarea 
          id="message" 
          required
          rows={6} 
          value={formData.message}
          onChange={(e) => setFormData({...formData, message: e.target.value})}
          className="block w-full rounded-xl border border-gray-200 bg-white py-3 px-4 md:py-4 md:px-5 text-sm md:text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-meewa-red transition-shadow resize-none" 
          placeholder="Enter Your Message*"
        ></textarea>
      </div>
      
      <div className="pt-2 md:pt-4">
        <button disabled={isSubmitting} type="submit" className="w-full md:w-auto bg-meewa-red text-white py-3 px-6 md:py-4 md:px-10 rounded-full hover:brightness-90 font-semibold shadow-md hover:shadow-lg transition-all text-base md:text-lg disabled:opacity-50">
          {isSubmitting ? "Submitting..." : "Submit Inquiry"}
        </button>
      </div>
    </motion.form>
    )}
    </AnimatePresence>
    </div>
  );
}

export default function ContactForm() {
  return (
    <Suspense fallback={<div>Loading form...</div>}>
      <ContactFormInner />
    </Suspense>
  )
}
