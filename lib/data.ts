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

export const getBrands = () => [...baseBrands, ...readAdminBrands()];

export const getFeaturedBrands = () => getBrands().filter((brand) => brand.featured);

export const getCategoryBySlug = (slug: string) =>
  categories.find((category) => category.slug === slug);

export const getBrandBySlug = (slug: string) =>
  getBrands().find((brand) => brand.slug === slug);
