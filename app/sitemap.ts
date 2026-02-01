import type { MetadataRoute } from "next";
import { getBrands, categories } from "@/lib/data";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: SITE_URL,
      lastModified: now,
    },
    {
      url: `${SITE_URL}/gallery`,
      lastModified: now,
    },
    {
      url: `${SITE_URL}/category`,
      lastModified: now,
    },
    ...categories.map((category) => ({
      url: `${SITE_URL}/category/${category.slug}`,
      lastModified: now,
    })),
    ...getBrands().map((brand) => ({
      url: `${SITE_URL}/brand/${brand.slug}`,
      lastModified: now,
    })),
    ...getBrands().map((brand) => ({
      url: `${SITE_URL}/logo/${brand.slug}`,
      lastModified: now,
    })),
  ];
}
