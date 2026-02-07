// lib/brands-data.ts - Brand data types and helpers
// Data is auto-generated from logo files at build time

import { generatedBrands } from './brands-data-generated';

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

// Export generated brands
export const brands: Brand[] = generatedBrands;

// Helper functions
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
