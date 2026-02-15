import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { DEFAULT_LOCALE, LOCALES, LOCALE_COOKIE_NAME, normalizeLocale, type Locale } from "@/lib/locale";

function detectLocaleFromAcceptLanguage(value: string | null): Locale | null {
  if (!value) return null;
  const normalized = value.toLowerCase();
  // Example: "zh-CN,zh;q=0.9,en;q=0.8"
  if (normalized.startsWith("zh")) return "zh";
  if (normalized.startsWith("en")) return "en";
  if (normalized.includes("zh")) return "zh";
  if (normalized.includes("en")) return "en";
  return null;
}

function hasLocalePrefix(pathname: string) {
  return LOCALES.some((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`));
}

// Only redirect "real" site routes. This avoids doubling random scanner traffic
// (e.g. /_layouts/*, /terraform.tfstate, /.well-known/*).
function isSupportedRoute(pathname: string) {
  if (pathname === "/") return true;
  const roots = ["/research", "/publications", "/projects", "/experience", "/cv", "/blog", "/contact"] as const;
  return roots.some((root) => pathname === root || pathname.startsWith(`${root}/`));
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (hasLocalePrefix(pathname)) {
    return NextResponse.next();
  }

  if (!isSupportedRoute(pathname)) {
    return NextResponse.next();
  }

  const cookieLocale = normalizeLocale(request.cookies.get(LOCALE_COOKIE_NAME)?.value);
  const headerLocale = detectLocaleFromAcceptLanguage(request.headers.get("accept-language"));
  const locale = cookieLocale ?? headerLocale ?? DEFAULT_LOCALE;

  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;

  const response = NextResponse.redirect(url);
  if (!cookieLocale) {
    response.cookies.set(LOCALE_COOKIE_NAME, locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax"
    });
  }
  return response;
}

export const config = {
  matcher: [
    // Skip Next.js internals and direct file requests (static assets).
    "/((?!_next/|api/|.*\\..*).*)"
  ]
};

// Default export for EdgeOne compatibility
export default proxy;
