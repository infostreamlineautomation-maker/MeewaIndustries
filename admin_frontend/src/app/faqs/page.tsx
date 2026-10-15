"use client";
import { useEffect, useMemo, useState } from "react";
import { FaqForm } from "@/components/FaqPlacementEditor";
import { Faq, PAGE_LOCATIONS, createFaq, deleteFaq, fetchFaqs, locationLabel, productLocation, updateFaq } from "@/lib/faqs";

type ProductOption = { id: number; name: string };

function LocationPicker({ value, onChange, products }: { value: string[]; onChange: (v: string[]) => void; products: ProductOption[] }) {
  const [productQuery, setProductQuery] = useState("");
  const toggle = (loc: string) => onChange(value.includes(loc) ? value.filter(l => l !== loc) : [...value, loc]);
  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(productQuery.toLowerCase()));

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div>
        <p className="text-xs font-semibold text-gray-700 mb-2">Pages</p>
        <div className="space-y-1.5">
          {PAGE_LOCATIONS.map(loc => (
            <label key={loc.value} className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={value.includes(loc.value)} onChange={() => toggle(loc.value)} className="accent-meewa-red" />
              {loc.label}
            </label>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-700 mb-2">Specific Products</p>
        <input
          type="text"
          value={productQuery}
          onChange={e => setProductQuery(e.target.value)}
          placeholder="Filter products..."
          className="w-full border border-gray-300 rounded-md p-1.5 text-xs mb-2 focus:outline-none focus:border-meewa-red"
        />
        <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
          {filteredProducts.map(p => (
            <label key={p.id} className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={value.includes(productLocation(p.id))} onChange={() => toggle(productLocation(p.id))} className="accent-meewa-red" />
              {p.name}
            </label>
          ))}
          {filteredProducts.length === 0 && <p className="text-xs text-gray-400">No products</p>}
        </div>
        <p className="text-[11px] text-gray-400 mt-2">A product with its own FAQs shows those instead of the default product FAQs.</p>
      </div>
    </div>
  );
}

export default function FaqBankPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [query, setQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newLocations, setNewLocations] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [placingId, setPlacingId] = useState<number | null>(null);
  const [placingDraft, setPlacingDraft] = useState<string[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/products`)
      .then(res => res.json())
      .then((data: ProductOption[]) => setProducts(data.map(p => ({ id: p.id, name: p.name })).sort((a, b) => a.name.localeCompare(b.name))))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      fetchFaqs(query)
        .then(setFaqs)
        .catch(console.error)
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(t);
  }, [query]);

  const productNames = useMemo(() => Object.fromEntries(products.map(p => [p.id, p.name])), [products]);

  const visible = faqs.filter(f => {
    if (!locationFilter) return true;
    if (locationFilter === "__unused") return f.locations.length === 0;
    if (locationFilter === "__products") return f.locations.some(l => l.startsWith("product:"));
    return f.locations.includes(locationFilter);
  });

  const replace = (updated: Faq) => setFaqs(prev => prev.map(f => (f.id === updated.id ? updated : f)));

  const handleDelete = async (faq: Faq) => {
    const where = faq.locations.length ? `\n\nIt will be removed from: ${faq.locations.map(l => locationLabel(l, productNames)).join(", ")}` : "";
    if (!confirm(`Delete this FAQ permanently?\n\n"${faq.question}"${where}`)) return;
    try {
      await deleteFaq(faq.id);
      setFaqs(prev => prev.filter(f => f.id !== faq.id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const toggleActive = async (faq: Faq) => {
    try {
      replace(await updateFaq(faq.id, { is_active: !faq.is_active }));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Update failed");
    }
  };

  const savePlacing = async (faq: Faq) => {
    try {
      replace(await updateFaq(faq.id, { locations: placingDraft }));
      setPlacingId(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Update failed");
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">FAQ Bank</h1>
          <p className="text-sm text-gray-500 mt-1">Write each question once, then show it on any page or product. Order per page is set on that page&apos;s settings.</p>
        </div>
        <button onClick={() => { setCreating(true); setNewLocations([]); setEditingId(null); }} className="bg-meewa-red text-white text-sm font-semibold px-5 py-2 rounded-lg shadow-md hover:opacity-90">
          + New FAQ
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search questions or answers..."
          className="flex-1 min-w-[220px] border border-gray-300 rounded-lg p-2 text-sm bg-white focus:outline-none focus:border-meewa-red"
        />
        <select value={locationFilter} onChange={e => setLocationFilter(e.target.value)} className="border border-gray-300 rounded-lg p-2 text-sm bg-white focus:outline-none focus:border-meewa-red">
          <option value="">All FAQs</option>
          {PAGE_LOCATIONS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
          <option value="__products">Used on specific products</option>
          <option value="__unused">Not used anywhere</option>
        </select>
      </div>

      {creating && (
        <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">New FAQ</h2>
          <div>
            <p className="text-xs text-gray-500 mb-2">Show this FAQ on:</p>
            <LocationPicker value={newLocations} onChange={setNewLocations} products={products} />
          </div>
          <FaqForm
            submitLabel="Create FAQ"
            onCancel={() => setCreating(false)}
            onSubmit={async data => {
              const created = await createFaq({ ...data, locations: newLocations });
              setFaqs(prev => [created, ...prev]);
              setCreating(false);
            }}
          />
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
        {loading ? (
          <p className="p-8 text-center text-gray-500">Loading...</p>
        ) : visible.length === 0 ? (
          <p className="p-8 text-center text-gray-500">No FAQs found.</p>
        ) : (
          visible.map(faq => (
            <div key={faq.id} className="p-5">
              {editingId === faq.id ? (
                <FaqForm
                  initial={faq}
                  submitLabel="Save FAQ"
                  note={faq.locations.length > 1 ? `Shared on ${faq.locations.length} places. Editing it updates all of them.` : undefined}
                  onCancel={() => setEditingId(null)}
                  onSubmit={async data => {
                    replace(await updateFaq(faq.id, data));
                    setEditingId(null);
                  }}
                />
              ) : (
                <>
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium ${faq.is_active ? "text-gray-900" : "text-gray-400"}`}>
                        {faq.question}
                        {!faq.is_active && <span className="ml-2 text-[10px] font-bold uppercase bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded align-middle">Inactive</span>}
                      </p>
                      <p className="text-sm text-gray-500 mt-1 whitespace-pre-wrap line-clamp-3">{faq.answer}</p>
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {faq.locations.length === 0 ? (
                          <span className="text-[11px] text-gray-400 italic">Not shown anywhere</span>
                        ) : (
                          faq.locations.map(l => (
                            <span key={l} className="text-[11px] font-medium bg-red-50 text-meewa-red px-2 py-0.5 rounded-full">{locationLabel(l, productNames)}</span>
                          ))
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0 text-xs font-semibold">
                      <button onClick={() => { setPlacingId(placingId === faq.id ? null : faq.id); setPlacingDraft(faq.locations); }} className="text-meewa-red hover:underline">Show on...</button>
                      <button onClick={() => { setEditingId(faq.id); setPlacingId(null); }} className="text-gray-600 hover:underline">Edit</button>
                      <button onClick={() => toggleActive(faq)} className="text-gray-600 hover:underline">{faq.is_active ? "Deactivate" : "Activate"}</button>
                      <button onClick={() => handleDelete(faq)} className="text-red-500 hover:underline">Delete</button>
                    </div>
                  </div>
                  {placingId === faq.id && (
                    <div className="mt-4 p-4 bg-gray-50 border rounded-lg">
                      <LocationPicker value={placingDraft} onChange={setPlacingDraft} products={products} />
                      <div className="flex justify-end gap-2 mt-4">
                        <button onClick={() => setPlacingId(null)} className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900">Cancel</button>
                        <button onClick={() => savePlacing(faq)} className="px-4 py-1.5 text-sm font-medium bg-meewa-red text-white rounded-md hover:bg-red-700">Save Placement</button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
