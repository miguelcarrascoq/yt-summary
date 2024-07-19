import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const headerYTSummary = request.headers.get('X-Yt-Summary');

  if (headerYTSummary !== process.env.NEXT_PUBLIC_CRYPTO_SECRET) {
    return new Response(
      JSON.stringify({
        status: false,
        message: 'Invalid request 🙃',
      }),
      {
        status: 403,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
