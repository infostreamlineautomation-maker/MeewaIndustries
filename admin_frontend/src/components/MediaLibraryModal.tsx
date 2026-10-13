"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MediaItem, MediaFilter, fetchMedia, uploadMedia, resolveMediaUrl, isVideo, formatBytes } from "@/lib/media";

type Props = {
  open: boolean;
  onClose: () => void;
  onSelect: (items: MediaItem[]) => void;
  multiple?: boolean;
  accept?: MediaFilter;
  title?: string;
};

const PAGE_SIZE = 60;

export default function MediaLibraryModal({ open, onClose, onSelect, multiple = false, accept = "all", title = "Media Library" }: Props) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [selected, setSelected] = useState<MediaItem[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<MediaFilter>(accept);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async (skip = 0) => {
    setLoading(true);
    try {
      const data = await fetchMedia({ q: query, type: filter, skip, limit: PAGE_SIZE });
      setItems(prev => (skip === 0 ? data : [...prev, ...data]));
      setHasMore(data.length === PAGE_SIZE);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [query, filter]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => load(0), 250);
    return () => clearTimeout(t);
  }, [open, load]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const uploaded = await uploadMedia(files);
      setItems(prev => [...uploaded, ...prev]);
      setSelected(prev => (multiple ? [...uploaded, ...prev] : uploaded.slice(0, 1)));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const toggle = (item: MediaItem) => {
    const isSelected = selected.some(s => s.id === item.id);
    if (multiple) {
      setSelected(isSelected ? selected.filter(s => s.id !== item.id) : [...selected, item]);
    } else {
      setSelected(isSelected ? [] : [item]);
    }
  };

  const confirm = (picked = selected) => {
    if (picked.length === 0) return;
    onSelect(picked);
    onClose();
  };

  if (!open) return null;

  const acceptAttr = accept === "image" ? "image/*" : accept === "video" ? "video/*" : "image/*,video/*";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-700 text-2xl leading-none">&times;</button>
        </div>

        <div className="flex flex-wrap items-center gap-3 px-6 py-3 border-b border-gray-100 shrink-0">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by name or alt text..."
            className="flex-1 min-w-[200px] border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:border-meewa-red"
          />
          {accept === "all" && (
            <select value={filter} onChange={e => setFilter(e.target.value as MediaFilter)} className="border border-gray-300 rounded-lg p-2 text-sm bg-white focus:outline-none focus:border-meewa-red">
              <option value="all">All media</option>
              <option value="image">Images</option>
              <option value="video">Videos</option>
            </select>
          )}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="bg-meewa-red text-white text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Upload New"}
          </button>
          <input ref={fileInputRef} type="file" multiple accept={acceptAttr} className="hidden" onChange={e => handleUpload(e.target.files)} />
        </div>

        <div
          className="flex-1 overflow-y-auto p-6"
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); handleUpload(e.dataTransfer.files); }}
        >
          {items.length === 0 && !loading ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
              <p className="font-medium">No media found</p>
              <p className="text-sm mt-1">Drop files here or click &quot;Upload New&quot;</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {items.map(item => {
                const isSelected = selected.some(s => s.id === item.id);
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => toggle(item)}
                    onDoubleClick={() => !multiple && confirm([item])}
                    title={item.original_name || item.filename}
                    className={`group relative aspect-square rounded-lg overflow-hidden border-2 bg-gray-50 transition-all ${isSelected ? "border-meewa-red ring-2 ring-meewa-red/30" : "border-gray-100 hover:border-gray-300"}`}
                  >
                    {isVideo(item) ? (
                      <video src={resolveMediaUrl(item.url)} muted className="w-full h-full object-cover" />
                    ) : (
                      <img src={resolveMediaUrl(item.url)} alt={item.alt_text || ""} loading="lazy" className="w-full h-full object-contain" />
                    )}
                    {isVideo(item) && <span className="absolute top-1 left-1 text-[10px] font-bold bg-black/70 text-white px-1.5 py-0.5 rounded">VIDEO</span>}
                    {isSelected && (
                      <span className="absolute top-1 right-1 w-6 h-6 rounded-full bg-meewa-red text-white text-xs font-bold flex items-center justify-center">
                        {multiple ? selected.findIndex(s => s.id === item.id) + 1 : "✓"}
                      </span>
                    )}
                    <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[10px] px-1.5 py-1 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.filename}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
          {loading && <p className="text-center text-sm text-gray-500 mt-4">Loading...</p>}
          {hasMore && !loading && (
            <div className="text-center mt-4">
              <button type="button" onClick={() => load(items.length)} className="text-sm font-semibold text-meewa-red hover:underline">Load more</button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50 shrink-0">
          <div className="text-sm text-gray-600 truncate">
            {selected.length === 0
              ? "Click an item to select it"
              : selected.length === 1
                ? `${selected[0].filename} · ${selected[0].width && selected[0].height ? `${selected[0].width}×${selected[0].height} · ` : ""}${formatBytes(selected[0].size)}`
                : `${selected.length} items selected`}
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900">Cancel</button>
            <button
              type="button"
              onClick={() => confirm()}
              disabled={selected.length === 0}
              className="bg-meewa-red text-white text-sm font-semibold px-5 py-2 rounded-lg hover:opacity-90 disabled:opacity-40"
            >
              {multiple ? `Insert ${selected.length || ""}` : "Use this file"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
