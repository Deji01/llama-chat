import NextAuth from "next-auth";
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { authConfig } from "@/app/(auth)/auth.config";

export default NextAuth(authConfig).auth;

export function middleware(request: NextRequest) {
  // Check if we're in development mode
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (isDevelopment) {
    const forwardedHost = request.headers.get('x-forwarded-host');
    const originHost = request.headers.get('host');

    // If x-forwarded-host is missing or different, set it to the origin host
    if (!forwardedHost || forwardedHost !== originHost) {
      request.headers.set('x-forwarded-host', originHost || 'localhost:3000');
    }
  }

  // Continue the response as normal
  return NextResponse.next();
}

// // Apply the middleware to all routes
// export const config = {
//   matcher: '/:path*',
// };

export const config = {
  matcher: ["/", "/:id", "/api/:path*", "/login", "/register"],
};
