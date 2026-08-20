import createNextIntlPlugin from "next-intl/plugin";

// Points next-intl at our single request-config module (KISS: one place).
const withNextIntl = createNextIntlPlugin("./src/core/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  /**
   * Two groups, both permanent (308).
   *
   * 1. `ai-analytics` was the original product fourth-section path. The spec
   *    names it `automation-intelligence-analytics`, and the old URLs were
   *    live, so they have to keep resolving.
   * 2. The spec's URL map lists several pages at the site root that this site
   *    nests under `/resources` and `/legal`. Redirecting is cheaper than
   *    moving the routes and keeps one canonical URL per page.
   *
   * Each rule is duplicated with a `:locale` prefix because localized paths
   * (`/en/...`) do not match the bare source pattern.
   */
  async redirects() {
    const flat = [
      ["/insights", "/resources/insights"],
      ["/news-events", "/resources/news-events"],
      ["/newsletter", "/resources/newsletter"],
      ["/privacy", "/legal/privacy"],
      ["/cookies", "/legal/cookies"],
      ["/terms", "/legal/terms"],
      ["/accessibility", "/legal/accessibility"],
      ["/security", "/legal/responsible-disclosure"],
      ["/responsible-disclosure", "/legal/responsible-disclosure"],
    ];

    return [
      {
        source: "/products/:product/ai-analytics",
        destination: "/products/:product/automation-intelligence-analytics",
        permanent: true,
      },
      {
        source: "/:locale/products/:product/ai-analytics",
        destination: "/:locale/products/:product/automation-intelligence-analytics",
        permanent: true,
      },
      ...flat.map(([source, destination]) => ({ source, destination, permanent: true })),
      ...flat.map(([source, destination]) => ({
        source: `/:locale${source}`,
        destination: `/:locale${destination}`,
        permanent: true,
      })),
    ];
  },
};

export default withNextIntl(nextConfig);
