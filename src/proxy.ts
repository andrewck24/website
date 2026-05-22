import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LOCALES = ["zh-TW", "en", "ja"] as const;
const DEFAULT_LOCALE = "zh-TW";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!hasLocale) {
    // Strip any unsupported locale prefix before prepending the default,
    // so /fr/about → /zh-TW/about rather than /zh-TW/fr/about.
    const strippedPathname = pathname.replace(/^\/[^/]+/, "") || "/";
    return NextResponse.redirect(
      new URL(`/${DEFAULT_LOCALE}${strippedPathname}`, request.url)
    );
  }
}

export const config = {
  matcher: [
    "/((?!api|studio|_next/static|_next/image|images|favicon.ico|icon|apple-icon).*)",
  ],
};
