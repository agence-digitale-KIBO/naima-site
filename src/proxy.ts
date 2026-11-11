import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { isLocale } from "./i18n/locales";
import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

// Next.js 16 runs the proxy again on an internal rewrite. The second pass
// sees the filesystem path (/it/about), and next-intl redirects it back to
// the public path (/it/chi-sono). Mark the first rewrite so the follow-up
// renders instead of redirecting, and keep the locale header for translations.
const REWRITE_PASS = "x-naima-locale-pass";

export function proxy(request: NextRequest) {
  if (request.headers.get(REWRITE_PASS) === "1") {
    const headers = new Headers(request.headers);
    const segment = request.nextUrl.pathname.split("/")[1] ?? "";
    if (isLocale(segment)) headers.set("X-NEXT-INTL-LOCALE", segment);
    return NextResponse.next({ request: { headers } });
  }

  const response = handleI18nRouting(request);

  if (response.headers.has("x-middleware-rewrite")) {
    response.headers.set(REWRITE_PASS, "1");
  }

  return response;
}

export const config = {
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
