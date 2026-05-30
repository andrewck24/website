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
    return NextResponse.redirect(
      new URL(`/${DEFAULT_LOCALE}${pathname}`, request.url)
    );
  }

  const response = NextResponse.next();
  response.headers.set("x-pathname", pathname);
  return response;
}

export const config = {
  matcher: [
    "/((?!api|studio|_next/static|_next/image|images|favicon.ico|icon|apple-icon|robots\\.txt|sitemap\\.xml).*)",
  ],
};
