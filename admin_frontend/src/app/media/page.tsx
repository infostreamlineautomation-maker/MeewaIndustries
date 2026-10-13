"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { MediaItem, MediaFilter, fetchMedia, uploadMedia, resolveMediaUrl, isVideo, formatBytes } from "@/lib/media";

const PAGE_SIZE = 60;

export default function MediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<MediaFilter>("all");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [active, setActive] = useState<MediaItem | null>(null);
  const [altDraft, setAltDraft] = useState("");
  const [usage, setUsage] = useState<string[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async (skip = 0) => {
    setLoading(true);
    try {
      const data = await fetchMedia({ q: query, type: filter, skip, limit: PAGE_SIZE });
      setItems(prev => (skip === 0 ? data : [...prev, ...data]));
      setHasMore(data.length === PAGE_SIZE);
    } catch (err) {
      console.error("Error fetching media", err);
    } finally {
      setLoading(false);
    }
  }, [query, filter]);

  useEffect(() => {
    const t = setTimeout(() => load(0), 250);
    return () => clearTimeout(t);
  }, [load]);

  const selectItem = (item: MediaItem) => {
    setActive(item);
    setAltDraft(item.alt_text || "");
    setUsage(null);
    fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/media/${item.id}/usage`)
      .then(res => res.json())
      .then(data => setUsage(data.usage || []))
      .catch(() => setUsage([]));
  };

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const uploaded = await uploadMedia(files);
      setItems(prev => [...uploaded, ...prev]);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSync = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/media/sync`, { method: "POST" });
    const data = await res.json();
    if (res.ok) {
      alert(data.added ? `Imported ${data.added} existing file(s).` : "Library is already up to date.");
      load(0);
    } else {
      alert("Import failed: " + JSON.stringify(data));
    }
  };

  const saveAlt = async () => {
    if (!active) return;
    const res = await fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/media/${active.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alt_text: altDraft }),
    });
    if (res.ok) {
      const updated: MediaItem = await res.json();
      setActive(updated);
      setItems(prev => prev.map(i => (i.id === updated.id ? updated : i)));
    } else {
      alert("Error saving alt text.");
    }
  };

  const handleDelete = async () => {
    if (!active) return;
    const inUse = usage && usage.length > 0;
    const msg = inUse
      ? `This file is still used in:\n\n${usage!.join("\n")}\n\nDeleting it will break those images on the website. Delete anyway?`
      : `Delete "${active.filename}" permanently?`;
    if (!confirm(msg)) return;
    const res = await fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/media/${active.id}${inUse ? "?force=true" : ""}`, { method: "DELETE" });
    if (res.ok) {
      setItems(prev => prev.filter(i => i.id !== active.id));
      setActive(null);
    } else {
      const data = await res.json();
      alert("Delete failed: " + JSON.stringify(data.detail ?? data));
    }
  };

  const copyUrl = async () => {
    if (!active) return;
    await navigator.clipboard.writeText(resolveMediaUrl(active.url));
    alert("URL copied to clipboard");
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-144px)] flex flex-col">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6 shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Media Library</h1>
          <p className="text-sm text-gray-500 mt-1">Upload images once and reuse them anywhere in the CMS with &quot;Choose from Library&quot;.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleSync} className="text-sm font-semibold px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
            Import Existing
          </button>
          <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="bg-meewa-red text-white text-sm font-semibold px-5 py-2 rounded-lg shadow-md hover:opacity-90 disabled:opacity-50">
            {uploading ? "Uploading..." : "Upload Files"}
          </button>
          <input ref={fileInputRef} type="file" multiple accept="image/*,video/*" className="hidden" onChange={e => handleUpload(e.target.files)} />
        </div>
      </div>

      <div className="flex gap-3 mb-4 shrink-0">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by name or alt text..."
          className="flex-1 border border-gray-300 rounded-lg p-2 text-sm bg-white focus:outline-none focus:border-meewa-red"
        />
        <select value={filter} onChange={e => setFilter(e.target.value as MediaFilter)} className="border border-gray-300 rounded-lg p-2 text-sm bg-white focus:outline-none focus:border-meewa-red">
          <option value="all">All media</option>
          <option value="image">Images</option>
          <option value="video">Videos</option>
        </select>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        <div
          className={`flex-1 bg-white rounded-xl shadow-sm border overflow-y-auto p-6 transition-colors ${dragging ? "border-meewa-red bg-red-50/40" : "border-gray-100"}`}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); handleUpload(e.dataTransfer.files); }}
        >
          {items.length === 0 && !loading ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
              <p className="font-medium">No media yet</p>
              <p className="text-sm mt-1">Drag &amp; drop files here, or use &quot;Import Existing&quot; to pull in images already used on the site.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
              {items.map(item => (
                <button
                  key={item.id}
                  onClick={() => selectItem(item)}
                  className={`group relative aspect-square rounded-lg overflow-hidden border-2 bg-gray-50 transition-all ${active?.id === item.id ? "border-meewa-red ring-2 ring-meewa-red/30" : "border-gray-100 hover:border-gray-300"}`}
                >
                  {isVideo(item) ? (
                    <video src={resolveMediaUrl(item.url)} muted className="w-full h-full object-cover" />
                  ) : (
                    <img src={resolveMediaUrl(item.url)} alt={item.alt_text || ""} loading="lazy" className="w-full h-full object-contain" />
                  )}
                  {isVideo(item) && <span className="absolute top-1 left-1 text-[10px] font-bold bg-black/70 text-white px-1.5 py-0.5 rounded">VIDEO</span>}
                  <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[11px] px-2 py-1 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.filename}
                  </span>
                </button>
              ))}
            </div>
          )}
          {loading && <p className="text-center text-sm text-gray-500 mt-4">Loading...</p>}
          {hasMore && !loading && (
            <div className="text-center mt-6">
              <button onClick={() => load(items.length)} className="text-sm font-semibold text-meewa-red hover:underline">Load more</button>
            </div>
          )}
        </div>

        {active && (
          <aside className="w-80 shrink-0 bg-white rounded-xl shadow-sm border border-gray-100 overflow-y-auto">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-900">File Details</h3>
              <button onClick={() => setActive(null)} className="text-gray-400 hover:text-gray-700 text-xl leading-none">&times;</button>
            </div>
            <div className="p-4 space-y-4">
              <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                {isVideo(active) ? (
                  <video src={resolveMediaUrl(active.url)} controls className="w-full max-h-56 object-contain" />
                ) : (
                  <img src={resolveMediaUrl(active.url)} alt={active.alt_text || ""} className="w-full max-h-56 object-contain" />
                )}
              </div>
              <dl className="text-xs space-y-1.5 text-gray-600">
                <div className="flex justify-between gap-2"><dt className="font-semibold">File</dt><dd className="truncate text-right" title={active.filename}>{active.filename}</dd></div>
                {active.original_name && active.original_name !== active.filename && (
                  <div className="flex justify-between gap-2"><dt className="font-semibold">Original</dt><dd className="truncate text-right" title={active.original_name}>{active.original_name}</dd></div>
                )}
                <div className="flex justify-between"><dt className="font-semibold">Type</dt><dd>{active.mime_type || "—"}</dd></div>
                <div className="flex justify-between"><dt className="font-semibold">Size</dt><dd>{formatBytes(active.size)}</dd></div>
                {active.width && active.height && (
                  <div className="flex justify-between"><dt className="font-semibold">Dimensions</dt><dd>{active.width} × {active.height}</dd></div>
                )}
                {active.created_at && (
                  <div className="flex justify-between"><dt className="font-semibold">Uploaded</dt><dd>{new Date(active.created_at).toLocaleString()}</dd></div>
                )}
              </dl>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Alt Text</label>
                <textarea value={altDraft} onChange={e => setAltDraft(e.target.value)} rows={2} className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:border-meewa-red" />
                <button onClick={saveAlt} disabled={altDraft === (active.alt_text || "")} className="mt-1 text-xs font-semibold text-meewa-red hover:underline disabled:opacity-40 disabled:no-underline">Save alt text</button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">File URL</label>
                <div className="flex gap-2">
                  <input readOnly value={resolveMediaUrl(active.url)} className="flex-1 min-w-0 border border-gray-200 bg-gray-50 rounded-lg p-2 text-xs" />
                  <button onClick={copyUrl} className="text-xs font-semibold px-3 rounded-lg border border-gray-300 hover:bg-gray-50">Copy</button>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-700 mb-1">Used In</p>
                {usage === null ? (
                  <p className="text-xs text-gray-400">Checking...</p>
                ) : usage.length === 0 ? (
                  <p className="text-xs text-gray-400">Not used anywhere</p>
                ) : (
                  <ul className="text-xs text-gray-600 space-y-1">
                    {usage.map(u => <li key={u} className="bg-gray-50 rounded px-2 py-1">{u}</li>)}
                  </ul>
                )}
              </div>

              <button onClick={handleDelete} className="w-full text-sm font-semibold py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50">
                Delete File
              </button>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
