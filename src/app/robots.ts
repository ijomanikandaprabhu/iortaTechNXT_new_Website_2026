import type { MetadataRoute } from "next";
import { appConfig } from "@/config/app.config";
import { privatePathPatterns } from "@/config/seo.config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [...privatePathPatterns],
    },
    sitemap: `${appConfig.siteUrl}/sitemap.xml`,
    host: appConfig.siteUrl,
  };
}
