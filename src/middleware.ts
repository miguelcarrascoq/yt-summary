import { NextRequest, NextResponse, userAgent } from 'next/server';
import { CONST_APP_URL } from './app/services/constants';

const allowedOrigins = [
  CONST_APP_URL,
  // 'http://localhost:3000',
];

const corsOptions = {
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export function middleware(request: NextRequest) {
  // Check the origin from the request
  const origin = request.headers.get('origin') ?? '';
  const isAllowedOrigin = allowedOrigins.includes(origin);

  // Handle preflighted requests
  const isPreflight = request.method === 'OPTIONS';

  if (isPreflight) {
    const preflightHeaders = {
      ...(isAllowedOrigin && { 'Access-Control-Allow-Origin': origin }),
      ...corsOptions,
    };
    return NextResponse.json({}, { headers: preflightHeaders });
  }

  // Handle simple requests
  const response = NextResponse.next();

  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }

  Object.entries(corsOptions).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  const headerYTSummary = request.headers.get('X-Yt-Summary');

  const { device } = userAgent(request);
  // { vendor: undefined, model: undefined, type: undefined }
  // {vendor: "Apple", model: "Macintosh"}
  // {"model": "K", "type": "mobile"}
  console.log(device);

  if (
    headerYTSummary !== process.env.NEXT_PUBLIC_CRYPTO_SECRET ||
    device.type === 'console' ||
    device.vendor === undefined
  ) {
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

  return response;
}

export const config = {
  matcher: '/api/:path*',
};
