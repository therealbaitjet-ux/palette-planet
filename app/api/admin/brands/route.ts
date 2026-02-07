// API: Get all brands from Supabase (dynamic)
// Returns brand data including newly uploaded logos

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://jqygmrgargwvjovhrbid.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY not configured");
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Cache duration in seconds
const CACHE_DURATION = 60; // 1 minute cache for admin

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // Parse query params for pagination
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100); // Max 100
    const offset = (page - 1) * limit;

    // Fetch from Supabase with pagination
    const { data: brands, error, count } = await supabase
      .from("brands")
      .select("*", { count: "exact" })
      .order("name")
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch brands", details: error.message },
        { status: 500 }
      );
    }

    // Transform to match expected format
    const formattedBrands = brands.map((b: any) => ({
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
      status: "working",
    }));

    // Return with cache headers to reduce load
    return NextResponse.json(
      {
        brands: formattedBrands,
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
        },
      },
      {
        headers: {
          "Cache-Control": `private, max-age=${CACHE_DURATION}`,
        },
      }
    );
  } catch (error) {
    console.error("Error fetching brands:", error);
    return NextResponse.json(
      { error: "Failed to fetch brands" },
      { status: 500 }
    );
  }
}
