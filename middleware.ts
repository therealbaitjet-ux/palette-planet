import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rate limiting map (in-memory - reset on deploy)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Rate limit config
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 20; // 20 requests per minute for general
const UPLOAD_RATE_LIMIT_MAX = 5; // 5 uploads per minute

function isRateLimited(ip: string, isUpload: boolean): boolean {
  const now = Date.now();
  const maxRequests = isUpload ? UPLOAD_RATE_LIMIT_MAX : RATE_LIMIT_MAX;
  
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    // New window
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return false;
  }
  
  if (record.count >= maxRequests) {
    return true;
  }
  
  record.count++;
  return false;
}

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Get client IP
  const ip = request.ip || "anonymous";
  
  // Check rate limiting for admin APIs
  if (request.nextUrl.pathname.startsWith("/api/admin")) {
    const isUpload = request.nextUrl.pathname.includes("/upload");
    
    if (isRateLimited(ip, isUpload)) {
      return new NextResponse(
        JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": "60",
          },
        }
      );
    }
  }
  
  // Security Headers
  response.headers.set("X-DNS-Prefetch-Control", "on");
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  
  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' https://img.logo.dev https://*.supabase.co data:",
    "font-src 'self'",
    "connect-src 'self' https://*.supabase.co",
    "frame-ancestors 'self'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");
  
  response.headers.set("Content-Security-Policy", csp);
  
  return response;
}

export const config = {
  matcher: [
    "/api/:path*",
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
