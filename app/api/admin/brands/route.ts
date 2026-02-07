// API: Get all brands from Supabase (dynamic)
// Returns brand data including newly uploaded logos

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://jqygmrgargwvjovhrbid.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxeWdtcmdhcmd3dmpvdmhyYmlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzMzQ5NjEsImV4cCI6MjA4NTkxMDk2MX0.S2tpjzM-81jcQQCMsriaUIDAGy_o1easT7kJvJChnwU";

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    // Fetch from Supabase
    const { data: brands, error } = await supabase
      .from("brands")
      .select("*")
      .order("name");

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

    return NextResponse.json({ brands: formattedBrands });
  } catch (error) {
    console.error("Error fetching brands:", error);
    return NextResponse.json(
      { error: "Failed to fetch brands" },
      { status: 500 }
    );
  }
}
