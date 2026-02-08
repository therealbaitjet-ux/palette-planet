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

// Categories that match the actual brand data
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
    name: "Finance",
    slug: "finance",
    description:
      "Banks, investment firms, fintech startups, and financial services with trustworthy visual identities.",
    seoIntro:
      "Discover finance and fintech brands that build trust through sophisticated typography, stable color palettes, and marks that signal security and innovation in the financial sector.",
  },
  {
    name: "Retail",
    slug: "retail",
    description:
      "Consumer brands, retail chains, and e-commerce platforms with memorable visual systems.",
    seoIntro:
      "Browse retail brands that capture attention and drive sales through bold colors, distinctive marks, and identities designed for high-visibility commercial environments.",
  },
  {
    name: "Automotive",
    slug: "automotive",
    description:
      "Car manufacturers, auto parts, and mobility brands with powerful, iconic identities.",
    seoIntro:
      "Explore automotive brands that convey speed, luxury, reliability, and innovation through timeless marks and precision-crafted visual systems.",
  },
  {
    name: "Healthcare",
    slug: "healthcare",
    description:
      "Medical institutions, pharmaceutical companies, and health tech with caring, professional identities.",
    seoIntro:
      "Review healthcare brands that balance clinical credibility with human warmth through calming palettes, clean typography, and trustworthy visual systems.",
  },
  {
    name: "Entertainment",
    slug: "entertainment",
    description:
      "Media companies, streaming platforms, and entertainment brands with captivating visual identities.",
    seoIntro:
      "Discover entertainment brands that capture attention and spark emotion through dynamic marks, bold typography, and visually striking identity systems.",
  },
  {
    name: "Food & Beverage",
    slug: "food-beverage",
    description:
      "Restaurants, food brands, and beverage companies with appetizing, memorable identities.",
    seoIntro:
      "Browse food and beverage brands that stimulate appetite and create craving through color psychology, approachable typography, and mouth-watering visual design.",
  },
  {
    name: "Energy",
    slug: "energy",
    description:
      "Oil & gas, utilities, and renewable energy companies with powerful, industrial identities.",
    seoIntro:
      "Explore energy brands that convey power, sustainability, and industrial strength through bold marks, earth-tone palettes, and robust visual systems.",
  },
  {
    name: "Travel & Hospitality",
    slug: "travel",
    description:
      "Airlines, hotels, travel services, and hospitality brands with welcoming, adventurous identities.",
    seoIntro:
      "Review travel and hospitality brands that inspire wanderlust and comfort through calming palettes, elegant typography, and globally-appealing visual systems.",
  },
  {
    name: "Telecommunications",
    slug: "telecom",
    description:
      "Phone carriers, internet providers, and communication brands with connected, modern identities.",
    seoIntro:
      "Discover telecommunications brands that signal connectivity, speed, and reliability through forward-thinking marks and digitally-native visual systems.",
  },
];

import { brands as importedBrands } from "./brands-data";

const baseBrands: Brand[] = importedBrands;

// Logo quality tiers for sorting
// Tier 1: PNG logos (Logo.dev - best quality)
// Tier 2: SVG logos (Wikipedia - good quality)
// Tier 3: Generated initials (lowest priority)
const getLogoTier = (brand: Brand): number => {
  if (!brand.logoUrl) return 0;
  // Tier 1: PNG from Logo.dev or other sources
  if (brand.logoUrl.startsWith('/logos/') && brand.logoUrl.endsWith('.png')) {
    return 3;
  }
  // Tier 2: SVG from Wikipedia
  if (brand.logoUrl.startsWith('/logos/') && brand.logoUrl.endsWith('.svg')) {
    return 2;
  }
  // Tier 0: Generated initials (/uploads/logos/)
  if (brand.logoUrl.includes('/uploads/')) {
    return 0;
  }
  // Default: any other /logos/ path
  if (brand.logoUrl.startsWith('/logos/')) {
    return 1;
  }
  return 0;
};

export const getBrands = () => {
  const allBrands = [...baseBrands];
  // Sort: featured first, then by logo tier (PNG > SVG > generated), then by views
  return allBrands.sort((a, b) => {
    // Featured brands always come first
    if (a.featured !== b.featured) {
      return a.featured ? -1 : 1;
    }
    // Then sort by logo tier (higher tier = better logo)
    const aTier = getLogoTier(a);
    const bTier = getLogoTier(b);
    if (aTier !== bTier) {
      return bTier - aTier; // Higher tier first
    }
    // Then by views (popularity)
    return b.views - a.views;
  });
};

export const getFeaturedBrands = () => getBrands().filter((brand) => brand.featured);

// Get top N brands with real logos, sorted by popularity (views)
export const getTopBrands = (limit: number = 20) => {
  return getBrands()
    .filter((brand) => {
      // Only brands with real logos (PNG or SVG in /logos/)
      if (!brand.logoUrl) return false;
      return brand.logoUrl.startsWith('/logos/') && 
        (brand.logoUrl.endsWith('.png') || brand.logoUrl.endsWith('.svg'));
    })
    .slice(0, limit);
};

export const getCategoryBySlug = (slug: string) =>
  categories.find((category) => category.slug === slug);

export const getBrandBySlug = (slug: string) =>
  getBrands().find((brand) => brand.slug === slug);
