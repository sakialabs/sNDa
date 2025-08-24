import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales, defaultLocale } from './next-intl.config';

const intlMiddleware = createMiddleware({
  locales: Array.from(locales),
  defaultLocale,
  localePrefix: 'always'
});

export default function middleware(request: NextRequest) {
  // Run locale detection/routing first
  const intlResponse = intlMiddleware(request);
  if (intlResponse) return intlResponse;

  // Auth guard for localized dashboard routes
  const { pathname, origin } = request.nextUrl;
  const isDashboard = locales.some((loc) => pathname.startsWith(`/${loc}/dashboard`));
  if (isDashboard) {
    const token = request.cookies.get('access_token')?.value || request.cookies.get('ACCESS_TOKEN')?.value;
    if (!token) {
      // Redirect to localized home if no token
      const loc = locales.find((l) => pathname.startsWith(`/${l}/`)) || defaultLocale;
      return NextResponse.redirect(`${origin}/${loc}`);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|.*\..*).*)']
};
