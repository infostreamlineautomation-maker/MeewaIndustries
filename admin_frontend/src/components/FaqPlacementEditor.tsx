"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Faq, createFaq, fetchFaqs, fetchPlacements, savePlacements, updateFaq } from "@/lib/faqs";

// Enter inside these inputs must not submit the page form the editor is embedded in
const stopEnter = (e: React.KeyboardEvent) => {
  if (e.key === "Enter" && !(e.target instanceof HTMLTextAreaElement)) e.preventDefault();
};

export function FaqForm({
  initial,
  submitLabel,
  note,
  onSubmit,
  onCancel,
}: {
  initial?: Partial<Faq>;
  submitLabel: string;
  note?: string;
  onSubmit: (data: { question: string; answer: string; is_active: boolean }) => Promise<void>;
  onCancel: () => void;
}) {
  const [question, setQuestion] = useState(initial?.question ?? "");
  const [answer, setAnswer] = useState(initial?.answer ?? "");
  const [isActive, setIsActive] = useState(initial?.is_active ?? true);
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!question.trim() || !answer.trim()) {
      alert("Question and answer are both required.");
      return;
    }
    setSaving(true);
    try {
      await onSubmit({ question, answer, is_active: isActive });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error saving FAQ");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-3 p-4 border border-meewa-red/30 rounded-lg bg-white">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Question</label>
        <input
          type="text"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          onKeyDown={stopEnter}
          autoFocus
          placeholder="e.g. Can I customize products?"
          className="w-full border-gray-300 rounded-md shadow-sm p-2 border text-gray-900 bg-white placeholder-gray-400 focus:border-meewa-red text-sm"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Answer</label>
        <textarea
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          rows={3}
          placeholder="e.g. Yes, we offer full customization..."
          className="w-full border-gray-300 rounded-md shadow-sm p-2 border text-gray-900 bg-white placeholder-gray-400 focus:border-meewa-red text-sm"
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="accent-meewa-red" />
        Active (shown on the website)
      </label>
      {note && <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded px-2 py-1.5">{note}</p>}
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900">Cancel</button>
        <button type="button" onClick={submit} disabled={saving} className="px-4 py-1.5 text-sm font-medium bg-meewa-red text-white rounded-md hover:bg-red-700 disabled:opacity-50">
          {saving ? "Saving..." : submitLabel}
        </button>
      </div>
    </div>
  );
}

function FaqBankPicker({ exclude, onClose, onAdd }: { exclude: number[]; onClose: () => void; onAdd: (faqs: Faq[]) => void }) {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      fetchFaqs(query)
        .then(setFaqs)
        .catch(console.error)
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(t);
  }, [query]);

  const available = faqs.filter(f => !exclude.includes(f.id));
  const toggle = (id: number) => setSelected(s => (s.includes(id) ? s.filter(x => x !== id) : [...s, id]));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Add from FAQ Bank</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-700 text-2xl leading-none">&times;</button>
        </div>
        <div className="px-6 py-3 border-b border-gray-100">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={stopEnter}
            placeholder="Search questions or answers..."
            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:border-meewa-red"
          />
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-3 space-y-2">
          {loading ? (
            <p className="text-sm text-gray-500 text-center py-6">Loading...</p>
          ) : available.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-6">
              No more FAQs to add. Create new ones here or in the <Link href="/faqs" className="text-meewa-red hover:underline">FAQ Bank</Link>.
            </p>
          ) : (
            available.map(faq => (
              <label key={faq.id} className={`flex gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${selected.includes(faq.id) ? "border-meewa-red bg-red-50/50" : "border-gray-200 hover:bg-gray-50"}`}>
                <input type="checkbox" checked={selected.includes(faq.id)} onChange={() => toggle(faq.id)} className="mt-1 accent-meewa-red" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {faq.question}
                    {!faq.is_active && <span className="ml-2 text-[10px] font-bold uppercase bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">Inactive</span>}
                  </p>
                  <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">{faq.answer}</p>
                </div>
              </label>
            ))
          )}
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900">Cancel</button>
          <button
            type="button"
            disabled={selected.length === 0}
            onClick={() => {
              onAdd(selected.map(id => faqs.find(f => f.id === id)!).filter(Boolean));
              onClose();
            }}
            className="bg-meewa-red text-white text-sm font-semibold px-5 py-2 rounded-lg hover:opacity-90 disabled:opacity-40"
          >
            Add {selected.length || ""}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FaqPlacementEditor({
  location,
  title = "FAQs",
  description,
  emptyHint = "No FAQs on this page yet.",
}: {
  location: string;
  title?: string;
  description?: string;
  emptyHint?: string;
}) {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);
  const [picking, setPicking] = useState(false);

  useEffect(() => {
    fetchPlacements(location)
      .then(setFaqs)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [location]);

  const persist = useCallback(async (next: Faq[]) => {
    setFaqs(next);
    setStatus("saving");
    try {
      setFaqs(await savePlacements(location, next.map(f => f.id)));
      setStatus("saved");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }, [location]);

  const move = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= faqs.length) return;
    const next = [...faqs];
    [next[idx], next[target]] = [next[target], next[idx]];
    persist(next);
  };

  const remove = (idx: number) => persist(faqs.filter((_, i) => i !== idx));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between items-center gap-3 border-b pb-2">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {description ?? "Pick questions from the shared FAQ Bank. Changes here save automatically."}
            {status === "saving" && <span className="ml-2 text-gray-400">Saving...</span>}
            {status === "saved" && <span className="ml-2 text-green-600">✓ Saved</span>}
            {status === "error" && <span className="ml-2 text-red-600">Could not save, please retry</span>}
          </p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => setPicking(true)} className="text-sm border border-meewa-red text-meewa-red px-3 py-1.5 rounded-md hover:bg-red-50 font-medium">
            + Add from FAQ Bank
          </button>
          <button type="button" onClick={() => { setCreating(true); setEditingId(null); }} className="text-sm bg-meewa-red text-white px-3 py-1.5 rounded-md hover:bg-red-700 font-medium">
            + New FAQ
          </button>
        </div>
      </div>

      {creating && (
        <FaqForm
          submitLabel="Create & Add"
          onCancel={() => setCreating(false)}
          onSubmit={async data => {
            const created = await createFaq({ ...data, locations: [location] });
            setFaqs(prev => [...prev, created]);
            setCreating(false);
            setStatus("saved");
          }}
        />
      )}

      {loading ? (
        <p className="text-sm text-gray-500">Loading FAQs...</p>
      ) : faqs.length === 0 && !creating ? (
        <p className="text-sm text-gray-500 bg-gray-50 border border-dashed rounded-lg p-4">{emptyHint}</p>
      ) : (
        <div className="space-y-2">
          {faqs.map((faq, idx) =>
            editingId === faq.id ? (
              <FaqForm
                key={faq.id}
                initial={faq}
                submitLabel="Save FAQ"
                note={faq.locations.length > 1 ? `This FAQ is shared on ${faq.locations.length} places. Editing it updates all of them.` : undefined}
                onCancel={() => setEditingId(null)}
                onSubmit={async data => {
                  const updated = await updateFaq(faq.id, data);
                  setFaqs(prev => prev.map(f => (f.id === updated.id ? updated : f)));
                  setEditingId(null);
                }}
              />
            ) : (
              <div key={faq.id} className={`flex items-start gap-3 p-3 border rounded-lg ${faq.is_active ? "bg-gray-50" : "bg-gray-50/50 opacity-60"}`}>
                <span className="text-sm font-semibold text-gray-400 w-6 shrink-0 pt-0.5">{idx + 1}.</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {faq.question}
                    {!faq.is_active && <span className="ml-2 text-[10px] font-bold uppercase bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">Hidden (inactive)</span>}
                  </p>
                  <p className="text-xs text-gray-500 line-clamp-2 mt-0.5 whitespace-pre-wrap">{faq.answer}</p>
                  {faq.locations.length > 1 && <p className="text-[11px] text-gray-400 mt-1">Also used on {faq.locations.length - 1} other place{faq.locations.length > 2 ? "s" : ""}</p>}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button type="button" onClick={() => move(idx, -1)} disabled={idx === 0} className="w-7 h-7 rounded hover:bg-gray-200 text-gray-500 disabled:opacity-30" title="Move up">↑</button>
                  <button type="button" onClick={() => move(idx, 1)} disabled={idx === faqs.length - 1} className="w-7 h-7 rounded hover:bg-gray-200 text-gray-500 disabled:opacity-30" title="Move down">↓</button>
                  <button type="button" onClick={() => { setEditingId(faq.id); setCreating(false); }} className="px-2 h-7 rounded text-xs font-semibold text-gray-600 hover:bg-gray-200">Edit</button>
                  <button type="button" onClick={() => remove(idx)} className="px-2 h-7 rounded text-xs font-semibold text-red-500 hover:bg-red-50" title="Remove from this page (stays in the FAQ Bank)">Remove</button>
                </div>
              </div>
            )
          )}
        </div>
      )}

      {picking && (
        <FaqBankPicker
          exclude={faqs.map(f => f.id)}
          onClose={() => setPicking(false)}
          onAdd={added => persist([...faqs, ...added])}
        />
      )}
    </div>
  );
}
