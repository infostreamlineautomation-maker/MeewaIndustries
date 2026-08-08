import { fetchServerSettings } from '@/lib/fetchSettings';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ProductClientPage from './ProductClientPage';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  try {
    const { slug } = await params;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/by-slug/${slug}`);
    if (!res.ok) return { title: 'Product Not Found' };
    const product = await res.json();
    return {
      title: `${product.name} | MEEWA Industries`,
      description: product.short_description,
    };
  } catch {
    return { title: 'Product Not Found' };
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  let product: any = null;
  let relatedProducts: any[] = [];
  let settings: any = {};

  try {
    const { slug } = await params;
    // Fetch product details
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/by-slug/${slug}`, { cache: 'no-store' });
    if (!res.ok) {
      if (res.status === 404) return notFound();
      throw new Error("Failed to fetch product");
    }
    product = await res.json();
    
    // Fetch related products (same category)
    const catRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, { cache: 'no-store' });
    if (catRes.ok) {
      const allProducts = await catRes.json();
      relatedProducts = allProducts.filter((p: any) => p.category_id === product.category_id && p.id !== product.id).slice(0, 3);
    }
    
    // Fetch settings for FAQ and Get In Touch
    const setRes = await fetchServerSettings();
    if (setRes.ok) {
      settings = await setRes.json();
    }
    
  } catch (error) {
    console.error(error);
    return notFound();
  }

  return (
    <ProductClientPage 
      product={product} 
      relatedProducts={relatedProducts} 
      settings={settings} 
    />
  );
}
