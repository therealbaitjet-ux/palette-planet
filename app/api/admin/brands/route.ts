// API: Get all brands for admin
// Returns brand data from generated file

import { NextResponse } from "next/server";
import { brands } from "@/lib/brands-data";

export async function GET() {
  try {
    // Add status field
    const brandsWithStatus = brands.map((brand) => ({
      ...brand,
      status: "working" as const,
    }));

    return NextResponse.json({ brands: brandsWithStatus });
  } catch (error) {
    console.error("Error fetching brands:", error);
    return NextResponse.json(
      { error: "Failed to fetch brands" },
      { status: 500 }
    );
  }
}
