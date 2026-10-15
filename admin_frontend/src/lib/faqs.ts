export type Faq = {
  id: number;
  question: string;
  answer: string;
  is_active: boolean;
  locations: string[];
};

export const PAGE_LOCATIONS: { value: string; label: string }[] = [
  { value: "landing", label: "Landing Page" },
  { value: "about", label: "About Us Page" },
  { value: "products", label: "Products Page" },
  { value: "product_default", label: "All Product Pages (default)" },
];

export const productLocation = (productId: number) => `product:${productId}`;

export const locationLabel = (location: string, productNames: Record<number, string> = {}) => {
  const page = PAGE_LOCATIONS.find(l => l.value === location);
  if (page) return page.label;
  const match = location.match(/^product:(\d+)$/);
  if (match) return `Product: ${productNames[Number(match[1])] ?? `#${match[1]}`}`;
  return location;
};

const api = (path: string) => `${process.env.NEXT_PUBLIC_ADMIN_API_URL}/faqs${path}`;

async function json<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) throw new Error(typeof data?.detail === "string" ? data.detail : "Request failed");
  return data;
}

export const fetchFaqs = (q = "") =>
  fetch(api(q ? `?q=${encodeURIComponent(q)}` : "")).then(res => json<Faq[]>(res));

export const createFaq = (data: { question: string; answer: string; is_active?: boolean; locations?: string[] }) =>
  fetch(api(""), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then(res => json<Faq>(res));

export const updateFaq = (id: number, data: Partial<Pick<Faq, "question" | "answer" | "is_active" | "locations">>) =>
  fetch(api(`/${id}`), { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then(res => json<Faq>(res));

export const deleteFaq = (id: number) =>
  fetch(api(`/${id}`), { method: "DELETE" }).then(res => json<{ message: string }>(res));

export const fetchPlacements = (location: string) =>
  fetch(api(`/placements?location=${encodeURIComponent(location)}`)).then(res => json<Faq[]>(res));

export const savePlacements = (location: string, faqIds: number[]) =>
  fetch(api("/placements"), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ location, faq_ids: faqIds }),
  }).then(res => json<Faq[]>(res));
