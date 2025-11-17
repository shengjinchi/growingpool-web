import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['zh', 'en'];
const defaultLocale = 'zh';

// Paths that should not be processed by the middleware
const excludedPaths = [
  '/api',
  '/_next',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
  '/storage',
  '/models',
];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip excluded paths
  if (excludedPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Handle specific redirects
  if (pathname.includes('/about-fx-killer')) {
    const newPath = pathname.replace('/about-fx-killer', '/about-growingpool');
    const newUrl = new URL(newPath, request.url);
    newUrl.search = request.nextUrl.search;
    return NextResponse.redirect(newUrl, 301);
  }

  // Check if pathname already has a locale
  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    // If it's English locale, redirect to Chinese
    if (pathname.startsWith('/en')) {
      const chinesePath = pathname.replace('/en', '/zh');
      const newUrl = new URL(chinesePath, request.url);
      newUrl.search = request.nextUrl.search;
      return NextResponse.redirect(newUrl, 301);
    }
    // If it's already Chinese, allow it
    return NextResponse.next();
  }

  // Always use default locale (Chinese) for consistent experience
  const locale = defaultLocale;

  // Redirect to locale-prefixed URL
  const newUrl = new URL(`/${locale}${pathname}`, request.url);
  newUrl.search = request.nextUrl.search;

  return NextResponse.redirect(newUrl);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|storage|models).*)',
  ],
};
