import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/lib/products";

const SITE_URL = "https://oystra.fr";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: SITE_URL, lastModified: now, changeFrequency: "daily", priority: 1 },
    ...PRODUCTS.map((p) => ({
      url: `${SITE_URL}/produits/${p.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...["mentions-legales", "cgv", "confidentialite"].map((slug) => ({
      url: `${SITE_URL}/${slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.2,
    })),
  ];
}
