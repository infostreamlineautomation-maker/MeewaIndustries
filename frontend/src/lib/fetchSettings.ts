import { cookies } from 'next/headers';

export async function fetchServerSettings() {
  const cookieStore = await cookies();
  const isPreview = cookieStore.has('preview_mode');
  const url = isPreview ? `${process.env.NEXT_PUBLIC_API_URL}/settings?preview=true` : `${process.env.NEXT_PUBLIC_API_URL}/settings`;
  const fetchOpts: RequestInit = isPreview ? { cache: 'no-store' } : { next: { revalidate: 10 } };
  return fetch(url, fetchOpts);
}
