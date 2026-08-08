export function fetchClientSettings() {
  const isPreview = document.cookie.includes('preview_mode=true');
  const url = isPreview ? `${process.env.NEXT_PUBLIC_API_URL}/settings?preview=true` : `${process.env.NEXT_PUBLIC_API_URL}/settings`;
  return fetch(url);
}
