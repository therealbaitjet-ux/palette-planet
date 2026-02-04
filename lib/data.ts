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

const baseBrands: Brand[] = [
  {
    id: "brd-006",
    name: "Sable & Coast",
    slug: "sable-and-coast",
    description:
      "Sable & Coast designs elevated coastal apparel with soft neutrals and understated luxury. The identity is refined, editorial, and timeless.",
    categorySlug: "lifestyle-retail",
    tags: ["apparel", "luxury", "editorial"],
    logoUrl: "/logos/sable.svg",
    dominantColors: ["#E2E8F0", "#94A3B8"],
    country: "United States",
    website: "https://sableandcoast.example.com",
    createdAt: "2023-08-19",
    featured: true,
    views: 13300,
  },
  {
    id: "brd-007",
    name: "Lumen Market",
    slug: "lumen-market",
    description:
      "Lumen Market is a modern home goods retailer focused on warm lighting and tactile materials. The logo is a simple bulb motif with gentle curves.",
    categorySlug: "lifestyle-retail",
    tags: ["home", "retail", "lighting"],
    logoUrl: "/logos/lumen.svg",
    dominantColors: ["#FBBF24", "#F59E0B"],
    country: "Sweden",
    website: "https://lumenmarket.example.com",
    createdAt: "2024-04-01",
    featured: false,
    views: 6540,
  },
  {
    id: "brd-008",
    name: "Thread & Field",
    slug: "thread-and-field",
    description:
      "Thread & Field crafts ethical outdoor apparel. The identity feels sturdy and optimistic, blending a wordmark with a terrain-inspired symbol.",
    categorySlug: "lifestyle-retail",
    tags: ["outdoor", "sustainable", "apparel"],
    logoUrl: "/logos/thread.svg",
    dominantColors: ["#4ADE80", "#22C55E"],
    country: "New Zealand",
    website: "https://threadfield.example.com",
    createdAt: "2023-11-30",
    featured: false,
    views: 5980,
  },
  {
    id: "brd-009",
    name: "Atria Suites",
    slug: "atria-suites",
    description:
      "Atria Suites is a boutique hotel brand rooted in calm geometry and muted gold accents. The logo emphasizes space, light, and quiet luxury.",
    categorySlug: "hospitality-travel",
    tags: ["hotel", "boutique", "luxury"],
    logoUrl: "/logos/atria.svg",
    dominantColors: ["#FDE68A", "#F59E0B"],
    country: "Italy",
    website: "https://atriasuites.example.com",
    createdAt: "2023-07-02",
    featured: true,
    views: 14110,
  },
  {
    id: "brd-010",
    name: "Skylane Travel",
    slug: "skylane-travel",
    description:
      "Skylane Travel organizes premium travel itineraries with a modern, optimistic visual system. The logo implies movement through soft arcs.",
    categorySlug: "hospitality-travel",
    tags: ["travel", "concierge", "experience"],
    logoUrl: "/logos/skylane.svg",
    dominantColors: ["#38BDF8", "#0EA5E9"],
    country: "United States",
    website: "https://skylanetravel.example.com",
    createdAt: "2024-05-03",
    featured: false,
    views: 8840,
  },
  {
    id: "brd-011",
    name: "Harborline",
    slug: "harborline",
    description:
      "Harborline is a ferry and coastal travel service with a heritage-inspired identity. The mark combines nautical typography with a wave emblem.",
    categorySlug: "hospitality-travel",
    tags: ["coastal", "transport", "heritage"],
    logoUrl: "/logos/harborline.svg",
    dominantColors: ["#38BDF8", "#1E40AF"],
    country: "Portugal",
    website: "https://harborline.example.com",
    createdAt: "2023-09-12",
    featured: false,
    views: 7710,
  },
  {
    id: "brd-012",
    name: "Everwell Clinics",
    slug: "everwell-clinics",
    description:
      "Everwell Clinics offers preventative health services with a calm, supportive brand system. The logo uses soft shapes that signal care and balance.",
    categorySlug: "wellness-health",
    tags: ["healthcare", "clinical", "wellness"],
    logoUrl: "/logos/everwell.svg",
    dominantColors: ["#67E8F9", "#06B6D4"],
    country: "Netherlands",
    website: "https://everwellclinics.example.com",
    createdAt: "2024-02-21",
    featured: false,
    views: 9030,
  },
];

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
