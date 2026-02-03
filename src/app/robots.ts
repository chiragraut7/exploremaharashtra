import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.goexploremaharashtra.in';

  return {
    rules: {
      userAgent: '*',
      allow: [
        '/',
        '/assets/images/', // ✅ Explicitly allow heritage images for Google Image Search
      ],
      disallow: [
        '/api/',       // Prevents bots from crawling your raw JSON data
        '/_next/',     // Ignores internal Next.js build files
        '/search?',    // Prevents indexing of infinite search result combinations
        '/admin/',     // Hide your CMS or admin panel if it exists
        '/private/',   // Hide any private project folders
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}