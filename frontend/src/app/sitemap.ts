import type { MetadataRoute } from "next";

const LOCALES = ["en", "ar"] as const;
const ROUTES = ["/", "/about", "/community", "/contact", "/donate", "/volunteer", "/wall-of-love"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const lastModified = new Date();

  const entries: MetadataRoute.Sitemap = [];

  for (const route of ROUTES) {
    for (const locale of LOCALES) {
      const url = new URL(`${locale}${route}`, siteUrl).toString();
      // Build alternates for this route
      const alternates: Record<string, string> = {};
      for (const alt of LOCALES) {
        alternates[alt] = new URL(`${alt}${route}`, siteUrl).toString();
      }
      entries.push({
        url,
        lastModified,
        changeFrequency: "weekly",
        alternates: {
          languages: alternates,
        },
      });
    }
  }

  return entries;
}
