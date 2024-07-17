// Import the NextResponse type from 'next/server'
import { NextRequest, NextResponse } from 'next/server';

// This is the middleware function
export function middleware(request: NextRequest) {
  // Retrieve the 'X-Yt-Summary' header from the request
  const headerYTSummary = request.headers.get('X-Yt-Summary');

  // Compare the header value with the environment variable
  if (headerYTSummary !== process.env.NEXT_PUBLIC_CRYPTO_SECRET) {
    // If they don't match, return a JSON response indicating an invalid request
    return new Response(
      JSON.stringify({
        status: false,
        message: 'Invalid request 🙃',
      }),
      {
        status: 403, // Forbidden status code
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  // If the header matches, continue with the request
  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
