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
    // Allow both zh and en locales - no redirecting between them
    return NextResponse.next();
  }

  // For paths without locale, detect user's preferred language
  const acceptLanguage = request.headers.get('accept-language');
  const preferredLocale = getPreferredLocale(acceptLanguage);

  // Redirect to locale-prefixed URL based on user preference
  const newUrl = new URL(`/${preferredLocale}${pathname}`, request.url);
  newUrl.search = request.nextUrl.search;

  return NextResponse.redirect(newUrl);
}

// Helper function to detect user's preferred language
function getPreferredLocale(acceptLanguage: string | null): string {
  if (!acceptLanguage) return defaultLocale;

  // Parse Accept-Language header
  const languages = acceptLanguage.split(',').map(lang => lang.split(';')[0].trim().toLowerCase());

  // Check for exact matches
  for (const preferredLang of languages) {
    if (locales.includes(preferredLang)) {
      return preferredLang;
    }
  }

  // Check for language prefix matches
  for (const preferredLang of languages) {
    const matchedLocale = locales.find(locale =>
      preferredLang.startsWith(locale.split('-')[0])
    );
    if (matchedLocale) {
      return matchedLocale;
    }
  }

  // Default to Chinese
  return defaultLocale;
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
