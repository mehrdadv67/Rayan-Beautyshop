import type { NextApiRequest, NextApiResponse } from "next";
import { absoluteSiteUrl } from "@utils/site-url";

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  const robots = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /_next/
Disallow: /private/

Sitemap: ${absoluteSiteUrl("/sitemap.xml")}
`.trim();

  res.setHeader("Content-Type", "text/plain");
  res.status(200).send(robots);
}
