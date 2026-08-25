import type { NextApiRequest, NextApiResponse } from "next";
import { absoluteSiteUrl, getSiteUrl } from "@utils/site-url";

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  const baseUrl = getSiteUrl().replace(/\/$/, "");
  const now = new Date().toISOString();

  const staticPages = [
    { loc: "/", lastmod: now, changefreq: "daily", priority: 1.0 },
    { loc: "/products", lastmod: now, changefreq: "daily", priority: 0.9 },
    { loc: "/category", lastmod: now, changefreq: "daily", priority: 0.9 },
    { loc: "/collections", lastmod: now, changefreq: "weekly", priority: 0.8 },
    { loc: "/shops", lastmod: now, changefreq: "weekly", priority: 0.8 },
    { loc: "/cart", lastmod: now, changefreq: "hourly", priority: 0.7 },
    { loc: "/checkout", lastmod: now, changefreq: "hourly", priority: 0.6 },
    { loc: "/contact-us", lastmod: now, changefreq: "monthly", priority: 0.5 },
    { loc: "/faq", lastmod: now, changefreq: "monthly", priority: 0.5 },
    { loc: "/terms", lastmod: now, changefreq: "monthly", priority: 0.3 },
    { loc: "/privacy", lastmod: now, changefreq: "monthly", priority: 0.3 },
    { loc: "/signin", lastmod: now, changefreq: "monthly", priority: 0.4 },
    { loc: "/signup", lastmod: now, changefreq: "monthly", priority: 0.4 },
    { loc: "/forget-password", lastmod: now, changefreq: "monthly", priority: 0.4 },
  ];

  const sitemap = staticPages
    .map((page) => {
      const loc = page.loc.startsWith("http") ? page.loc : `${baseUrl}${page.loc}`;
      return `
        <url>
          <loc>${loc}</loc>
          ${page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : ""}
          ${page.changefreq ? `<changefreq>${page.changefreq}</changefreq>` : ""}
          ${page.priority ? `<priority>${page.priority}</priority>` : ""}
        </url>
      `;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${sitemap}
    </urlset>
  `.replace(/\s+/g, " ").trim();

  res.setHeader("Content-Type", "application/xml");
  res.status(200).send(xml);
}
