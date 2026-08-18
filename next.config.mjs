import createNextIntlPlugin from "next-intl/plugin";

// Points next-intl at our single request-config module (KISS: one place).
const withNextIntl = createNextIntlPlugin("./src/core/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
};

export default withNextIntl(nextConfig);
