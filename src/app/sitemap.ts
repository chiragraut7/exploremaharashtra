import { MetadataRoute } from 'next';

// 💡 TIP: If you have a local lib/data file, import it here 
// to avoid network overhead during build time.
// import { getAllDestinations } from '@/lib/db'; 

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.goexploremaharashtra.in';
  const categories = ['forts', 'beaches', 'hills', 'wildlife', 'religious', 'culture'];
  
  // Generate Category URLs
  const categoryUrls: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${baseUrl}/${cat}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  }));

  let dynamicUrls: MetadataRoute.Sitemap = [];
  
  try {
    const fetchPromises = categories.map(async (cat) => {
      // Use cache: 'no-store' or revalidate to ensure fresh data
      const res = await fetch(`${baseUrl}/api/${cat}`, { next: { revalidate: 3600 } });
      const json = await res.json();
      
      if (json.success && Array.isArray(json.data)) {
        return json.data.map((item: any) => ({
          url: `${baseUrl}/${cat}/${item.slug || item.id}`,
          lastModified: item.updatedAt ? new Date(item.updatedAt) : new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        }));
      }
      return [];
    });

    const results = await Promise.all(fetchPromises);
    dynamicUrls = results.flat();
  } catch (error) {
    console.error("Sitemap Fetch Error:", error);
  }

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: new Date(), priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), priority: 0.5 },
  ];

  return [...staticPages, ...categoryUrls, ...dynamicUrls];
}