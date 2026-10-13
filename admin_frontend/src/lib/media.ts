export type MediaItem = {
  id: number;
  url: string;
  filename?: string;
  original_name?: string;
  alt_text?: string;
  mime_type?: string;
  size?: number;
  width?: number;
  height?: number;
  created_at?: string;
};

export type MediaFilter = "all" | "image" | "video";

export const resolveMediaUrl = (url?: string | null) =>
  !url ? "" : url.startsWith("http") ? url : `${process.env.NEXT_PUBLIC_API_URL}${url}`;

export const isVideo = (item: Pick<MediaItem, "url" | "mime_type">) =>
  item.mime_type?.startsWith("video/") || /\.(mp4|webm|mov)$/i.test(item.url);

export const formatBytes = (bytes?: number) => {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export async function fetchMedia(params: { q?: string; type?: MediaFilter; skip?: number; limit?: number } = {}): Promise<MediaItem[]> {
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (params.type && params.type !== "all") search.set("type", params.type);
  search.set("skip", String(params.skip ?? 0));
  search.set("limit", String(params.limit ?? 60));
  const res = await fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/media?${search.toString()}`);
  if (!res.ok) throw new Error("Failed to load media");
  return res.json();
}

export async function uploadMedia(files: FileList | File[]): Promise<MediaItem[]> {
  const formData = new FormData();
  Array.from(files).forEach(file => formData.append("files", file));
  const res = await fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/media/upload`, {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(typeof data?.detail === "string" ? data.detail : "Upload failed");
  return data;
}
