// lib/brands-data.ts - Hybrid: Static fallback + Supabase for admin uploads
import { createClient } from "@supabase/supabase-js";

// Supabase client for dynamic data
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://jqygmrgargwvjovhrbid.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseKey) {
  console.warn("SUPABASE_ANON_KEY not set - using static data only");
}

export const supabase = createClient(
  supabaseUrl, 
  supabaseKey || "dummy-key-for-build-only"
);

// Import static brands as fallback
import { generatedBrands } from "./brands-data-generated";

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description: string;
  categorySlug: string;
  tags: string[];
  logoUrl: string;
  dominantColors: string[];
  country: string;
  website: string;
  featured: boolean;
  views: number;
  createdAt: string;
}

export interface Category {
  slug: string;
  name: string;
  description: string;
}

export const categories: Category[] = [
  { slug: "tech-saas", name: "Tech & SaaS", description: "Technology companies and software platforms" },
  { slug: "finance", name: "Finance", description: "Banks, investment firms, and fintech" },
  { slug: "retail", name: "Retail", description: "Consumer brands and retail" },
  { slug: "automotive", name: "Automotive", description: "Car manufacturers and brands" },
  { slug: "healthcare", name: "Healthcare", description: "Medical and pharmaceutical" },
  { slug: "entertainment", name: "Entertainment", description: "Media and entertainment" },
  { slug: "food-beverage", name: "Food & Beverage", description: "Restaurants and food brands" },
  { slug: "energy", name: "Energy", description: "Oil, gas, and utilities" },
  { slug: "travel", name: "Travel & Hospitality", description: "Airlines, hotels, travel" },
  { slug: "telecom", name: "Telecommunications", description: "Phone and internet providers" },
];

// Static brands (fallback)
export const brands: Brand[] = generatedBrands;

// Async function to get all brands (combines static + Supabase)
export async function getBrands(): Promise<Brand[]> {
  try {
    // Try to fetch from Supabase first
    const { data: supabaseBrands, error } = await supabase
      .from("brands")
      .select("*")
      .order("name");

    if (error || !supabaseBrands || supabaseBrands.length === 0) {
      // Fallback to static data
      return generatedBrands;
    }

    // Combine Supabase brands with static, preferring Supabase
    const brandMap = new Map<string, Brand>();
    
    // Add static brands first
    generatedBrands.forEach(brand => brandMap.set(brand.id, brand));
    
    // Override with Supabase brands
    supabaseBrands.forEach((b: any) => {
      brandMap.set(b.id, {
        id: b.id,
        name: b.name,
        slug: b.slug,
        description: b.description,
        categorySlug: b.category_slug,
        tags: b.tags || [],
        logoUrl: b.logo_url,
        dominantColors: b.dominant_colors || [],
        country: b.country || "US",
        website: b.website,
        featured: b.featured || false,
        views: b.views || 0,
        createdAt: b.created_at,
      });
    });

    return Array.from(brandMap.values());
  } catch (err) {
    console.error("Error fetching brands from Supabase:", err);
    return generatedBrands;
  }
}

export function getBrandBySlug(slug: string): Brand | undefined {
  return brands.find(b => b.slug === slug);
}

export function getBrandsByCategory(categorySlug: string): Brand[] {
  return brands.filter(b => b.categorySlug === categorySlug);
}

export function getTopBrands(count: number = 20): Brand[] {
  return [...brands].sort((a, b) => b.views - a.views).slice(0, count);
}

export function getFeaturedBrands(): Brand[] {
  return brands.filter(b => b.featured);
}

export function getCategories(): Category[] {
  return categories;
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find(c => c.slug === slug);
}
