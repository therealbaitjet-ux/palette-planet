// API: Admin authentication
// Checks password against environment variable and sets secure cookie

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createHash } from "crypto";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export async function POST(request: Request) {
  try {
    if (!ADMIN_PASSWORD) {
      console.error("ADMIN_PASSWORD not configured");
      return NextResponse.json(
        { success: false, error: "Admin not configured" },
        { status: 500 }
      );
    }

    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { success: false, error: "Password required" },
        { status: 400 }
      );
    }

    // Constant-time comparison to prevent timing attacks
    const isValid = timingSafeEqual(
      Buffer.from(password), 
      Buffer.from(ADMIN_PASSWORD)
    );

    if (isValid) {
      // Create secure hashed token
      const token = createHash("sha256").update(ADMIN_PASSWORD).digest("hex");
      
      // Set secure HTTP-only cookie
      const cookieStore = await cookies();
      cookieStore.set("admin_auth", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
      });
      
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, error: "Incorrect password" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { success: false, error: "Authentication failed" },
      { status: 500 }
    );
  }
}

// Constant-time comparison function
function timingSafeEqual(a: Buffer, b: Buffer): boolean {
  if (a.length !== b.length) {
    // Still do comparison to avoid leaking length info via timing
    const maxLen = Math.max(a.length, b.length);
    let result = 0;
    for (let i = 0; i < maxLen; i++) {
      result |= (a[i] || 0) ^ (b[i] || 0);
    }
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a[i] ^ b[i];
  }
  return result === 0;
}
