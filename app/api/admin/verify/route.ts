// API: Verify admin session
// Returns 200 if authenticated, 401 if not

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createHash } from "crypto";

export const dynamic = 'force-dynamic';

// Simple token verification using ADMIN_PASSWORD
// In production, use NextAuth.js or Clerk for proper authentication
export async function POST() {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("admin_auth")?.value;
    
    if (!authToken) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }
    
    // Verify token matches hashed password
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      console.error("ADMIN_PASSWORD not configured");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }
    
    const expectedToken = createHash("sha256").update(adminPassword).digest("hex");
    
    if (authToken !== expectedToken) {
      return NextResponse.json(
        { error: "Invalid session" },
        { status: 401 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Auth verification error:", error);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}
