import type { MetadataRoute } from "next";
import { LEGAL_CONFIG } from "./_lib/legal/config";

/**
 * `robots.txt`.
 *
 * The rules are the same permissive default this site already had by
 * having no `robots.txt` at all — nothing that was crawlable yesterday
 * becomes uncrawlable today. The file exists for the `Sitemap:` line:
 * that directive is the only way a crawler finds `/sitemap.xml` without
 * someone submitting it in Search Console first, and a directory whose
 * per-facility URLs are never discovered is a directory nobody uses.
 *
 * `/api/` is excluded because it holds one POST-only handler
 * (`/api/design-partners`) — nothing there is a page, and a crawler that
 * tries is answered with a method error rather than content.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    sitemap: `${LEGAL_CONFIG.urls.marketing}/sitemap.xml`,
    host: LEGAL_CONFIG.urls.marketing,
  };
}
