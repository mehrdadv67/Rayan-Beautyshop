import type { NextApiRequest, NextApiResponse } from 'next';
import { API_TOKEN_HEADERS } from '@framework/utils/api-endpoints';
import { normalizeSiteConfig } from '@framework/utils/normalize';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    const strapiRes = await fetch(
      `${process.env.STRAPI_URL}/api/banners?populate[0]=logo&populate[1]=favicon&filters[position][$eq]=global`,
      {
        headers: API_TOKEN_HEADERS,
        cache: 'no-store',
      },
    );

    if (!strapiRes.ok) {
      const errorText = await strapiRes.text();
      console.error('Strapi site-config fetch failed:', errorText);
      return res.status(strapiRes.status).json({ error: 'Failed to fetch site config' });
    }

    const data = await strapiRes.json();
    const banner = Array.isArray(data?.data) ? data.data[0] : undefined;

    if (!banner) {
      return res.status(200).json({
        logo: { url: '', width: 0, height: 0 },
        favicon: { url: '', width: 0, height: 0 },
      });
    }

    return res.status(200).json(normalizeSiteConfig(banner));
  } catch (error) {
    console.error('Site config API route error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
