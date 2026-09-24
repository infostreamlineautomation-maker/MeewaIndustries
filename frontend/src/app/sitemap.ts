import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://meewaindustries.com';
  
  // Base static routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  try {
    // Fetch products to add dynamic routes
    const prodRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, { next: { revalidate: 3600 } });
    if (prodRes.ok) {
      const products = await prodRes.json();
      products.forEach((product: any) => {
        if (product.slug) {
          routes.push({
            url: `${baseUrl}/products/${product.slug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
          });
        }
      });
    }

    // Fetch categories if available
    const catRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, { next: { revalidate: 3600 } });
    if (catRes.ok) {
      const categories = await catRes.json();
      categories.forEach((cat: any) => {
        if (cat.slug) {
          routes.push({
            url: `${baseUrl}/categories/${cat.slug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
          });
        }
      });
    }
  } catch (error) {
    console.error("Error generating sitemap:", error);
  }

  return routes;
}
