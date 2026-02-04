export type Category = {
  name: string;
  slug: string;
  description: string;
  seoIntro: string;
};

export type Brand = {
  id: string;
  name: string;
  slug: string;
  description: string;
  categorySlug: string;
  tags: string[];
  logoUrl: string;
  dominantColors: string[];
  country: string;
  website?: string;
  createdAt: string;
  featured: boolean;
  views: number;
};

export const categories: Category[] = [
  {
    name: "Tech & SaaS",
    slug: "tech-saas",
    description:
      "Software platforms, cloud tools, and digital-first products with sharp identity systems.",
    seoIntro:
      "Explore a curated mix of SaaS and technology brands that prioritize clarity, trust, and modern digital-first identity design. These logos balance functionality with personality, making them ideal reference points for scalable tech companies.",
  },
  {
    name: "Lifestyle & Retail",
    slug: "lifestyle-retail",
    description:
      "Consumer goods, lifestyle brands, and modern retail experiences with bold visual systems.",
    seoIntro:
      "Discover lifestyle and retail brands that blend tactile storytelling with elevated typography and color. This collection highlights logos built to feel premium, contemporary, and memorable across physical and digital touchpoints.",
  },
  {
    name: "Hospitality & Travel",
    slug: "hospitality-travel",
    description:
      "Boutique hotels, travel services, and experiential destinations focused on premium service.",
    seoIntro:
      "Browse hospitality and travel identity systems that signal comfort, adventure, and high-end service. These brands emphasize calming palettes, confident marks, and versatile logo systems for global audiences.",
  },
  {
    name: "Wellness & Health",
    slug: "wellness-health",
    description:
      "Wellness studios, health platforms, and holistic services with calming brand direction.",
    seoIntro:
      "Review wellness and health brands that elevate care and trust through minimal marks and soothing color palettes. These logos are crafted to feel restorative, approachable, and credible for modern audiences.",
  },
];

const baseBrands: Brand[] = [];

const readAdminBrands = (): Brand[] => {
  if (typeof process === "undefined") {
    return [];
  }

  try {
    const fs = require("fs") as typeof import("fs");
    const path = require("path") as typeof import("path");
    const filePath = path.join(process.cwd(), "data", "admin-brands.json");
    if (!fs.existsSync(filePath)) {
      return [];
    }
    const raw = fs.readFileSync(filePath, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Brand[]) : [];
  } catch {
    return [];
  }
};

// Check if a brand has a real logo (not generated)
const hasRealLogo = (brand: Brand): boolean => {
  if (!brand.logoUrl) return false;
  // Real logos are in /logos/ directory (PNG or SVG)
  return brand.logoUrl.startsWith('/logos/') && 
    (brand.logoUrl.endsWith('.png') || brand.logoUrl.endsWith('.svg'));
};

export const getBrands = () => {
  const allBrands = [...baseBrands, ...readAdminBrands()];
  // Sort: featured first, then by logo quality (real logos first), then by views
  return allBrands.sort((a, b) => {
    // Featured brands always come first
    if (a.featured !== b.featured) {
      return a.featured ? -1 : 1;
    }
    // Then sort by real logo presence
    const aHasLogo = hasRealLogo(a) ? 1 : 0;
    const bHasLogo = hasRealLogo(b) ? 1 : 0;
    if (aHasLogo !== bHasLogo) {
      return bHasLogo - aHasLogo; // Real logos first
    }
    // Then by views (popularity)
    return b.views - a.views;
  });
};

export const getFeaturedBrands = () => getBrands().filter((brand) => brand.featured);

export const getCategoryBySlug = (slug: string) =>
  categories.find((category) => category.slug === slug);

export const getBrandBySlug = (slug: string) =>
  getBrands().find((brand) => brand.slug === slug);
