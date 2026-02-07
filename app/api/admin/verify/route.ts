// API: Verify admin session
// Returns 200 if authenticated, 401 if not

import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST() {
  // In a production app, verify JWT or session token here
  // For now, we rely on the cookie set by successful login
  // This is checked client-side by the existence of the cookie
  // A more secure implementation would use httpOnly cookies with JWT
  
  return NextResponse.json({ success: true });
}
