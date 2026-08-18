import createIntlMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { defaultLocale, locales } from "@/core/i18n/config";
import { resolveTenant, TENANT_HEADER } from "@/core/tenancy/resolveTenant";

const intlMiddleware = createIntlMiddleware({
  locales: [...locales],
  defaultLocale,
  // Always keep the locale in the URL so every page has one canonical form.
  localePrefix: "always",
});

/**
 * Resolves the tenant from Host and exposes it on the response, then delegates
 * locale detection and redirects to next-intl.
 *
 * Note: server components read the tenant via core/tenancy/getTenant, which
 * falls back to resolving the Host header itself — so tenancy never depends on
 * this header surviving the middleware/render boundary.
 */
export default function middleware(request: NextRequest) {
  const tenant = resolveTenant(request.headers.get("host"));

  const response = intlMiddleware(request);
  response.headers.set(TENANT_HEADER, tenant);

  return response;
}

export const config = {
  // Skip Next internals and static files; API routes resolve tenant themselves.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
