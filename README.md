# Iorta Technxt Website

Next.js 14 (App Router) marketing site + app shell with multi-language routing, multi-tenant theming, and a pluggable CRM integration.

## Getting started

Node 18.17+ is required (Node 20 LTS recommended).

```bash
npm install
```

```bash
cp .env.example .env.local
```

```bash
npm run dev
```

Open http://localhost:3000 — you will be redirected to `/en`.

To exercise a different tenant locally, add hosts entries for `client-a.localhost` and `client-b.localhost` (or use them directly, since Chrome resolves `*.localhost`) and visit http://client-a.localhost:3000/en.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` / `npm start` | Production build and serve |
| `npm run lint` | ESLint (Next + Prettier config) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest unit tests for `core/` and `features/` |

## Architecture at a glance

```
src/app/        routing only — layouts, pages, route handlers, sitemap, robots
src/core/       cross-cutting: i18n, theme, seo, tenancy
src/features/   vertical slices: crm (gateway, validation, components)
src/services/   external integrations: crm clients, http client
src/config/     env- and tenant-driven configuration
src/components/ shared ui + layout components
src/lib/        utilities (logger)
```

Rules that keep it that way:

- `app/` contains no business logic.
- UI never calls a CRM API directly. The path is
  `ContactForm → /api/crm/contact → features/crm/api/crmGateway → services/crm/*Client`.
  An ESLint rule blocks direct imports of `@/services/crm/*` outside the gateway.
- UI components use theme CSS variables (`var(--primary)`), never hardcoded colours.

## Two deviations from the original architecture doc

1. **Locale segment is above the route groups.** The doc had `(public)/[locale]` and `(app)/[locale]`. Two route groups cannot both own a root layout at the same `/[locale]` position in Next.js, so this repo uses `app/[locale]/(marketing)` and `app/[locale]/(app)`. Same URLs, same separation, valid routing.
2. **The CRM route lives at `app/api/crm/contact`, not under `[locale]`.** The locale travels in the request body, so one endpoint serves all languages instead of three identical ones (DRY). Middleware skips `/api` and the handler resolves the tenant from `Host` itself.

There is no `src/app/layout.tsx` — `app/[locale]/layout.tsx` is the root layout, because `<html lang>` needs the active locale.

## How to add a new locale

1. Add the code to `locales` in [config.ts](src/core/i18n/config.ts), plus entries in `localeNames` and `localeTags`.
2. Copy `src/core/i18n/messages/en.json` to `<locale>.json` and translate it. `npm test` fails if keys drift.
3. Import and register the bundle in [messages.test.ts](src/core/i18n/messages.test.ts).

Nothing else changes: routing helpers, `generateStaticParams`, hreflang, and the sitemap all read from `locales`.

## How to add a new tenant and theme

1. Add the id to `tenantIds` and a `tenantConfig` entry in [tenancy/config.ts](src/core/tenancy/config.ts).
2. Map its hostname(s) in `tenantByDomain` in the same file.
3. Add `"<tenant>-light"` and `"<tenant>-dark"` to `themeRegistry` in [theme/config.ts](src/core/theme/config.ts) — the token names must match the existing themes; a test enforces this.
4. Add a `seoConfig` entry in [seo.config.ts](src/config/seo.config.ts) and a `crmConfig` entry in [crm.config.ts](src/config/crm.config.ts).

No new routes or components are needed.

## How to add or change a CRM integration

1. Create `src/services/crm/<provider>Client.ts` exporting a factory that returns a `CrmClient` (see [hubspotClient.ts](src/services/crm/hubspotClient.ts) for the shape). Use `httpJson` from `@/services/http/client`.
2. Add the provider to the `CrmProvider` union in [features/crm/types.ts](src/features/crm/types.ts) and to `CrmTenantConfig` in [crm.config.ts](src/config/crm.config.ts).
3. Wire it into the `switch` in [crmGateway.ts](src/features/crm/api/crmGateway.ts) — TypeScript will flag the missing case.
4. Point a tenant at it in `crmConfig` and add the credentials to `.env.example` and your `.env.local`.

Route handlers and components need no changes.

## SEO checklist

| Item | Where | Status |
| --- | --- | --- |
| Unique localized title + description per page | `generateMetadata` → [buildPageMetadata](src/core/seo/metadata.ts) | Done |
| `alternates.languages` + `x-default` on every public page | [hreflang.ts](src/core/seo/hreflang.ts) | Done |
| Canonical URL per locale | `buildAlternates` | Done |
| Open Graph + Twitter cards | `buildPageMetadata` | Done |
| Localized sitemap with alternates | [sitemap.ts](src/app/sitemap.ts) | Done |
| robots.txt blocking dashboard/settings/api | [robots.ts](src/app/robots.ts) | Done |
| `noindex` on private routes | [(app)/layout.tsx](src/app/[locale]/\(app\)/layout.tsx) | Done |
| `<html lang>` per locale | [[locale]/layout.tsx](src/app/[locale]/layout.tsx) | Done |
| OG images per tenant | — | Not implemented |
| Structured data (JSON-LD) | — | Not implemented |

## Not implemented yet

- Authentication for the `(app)` route group — `/dashboard` and `/settings` are currently reachable by anyone who knows the URL. They are `noindex`, which is not access control.
- E2E tests (Playwright) across locales and tenants.
- Real CRM credentials; the clients are written against each provider's documented API but have not been run against a live account.
