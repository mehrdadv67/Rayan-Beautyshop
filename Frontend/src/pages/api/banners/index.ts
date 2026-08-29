import type { NextApiRequest, NextApiResponse } from 'next';
import { API_TOKEN_HEADERS, strapiBannerParams } from '@framework/utils/api-endpoints';
import { normalizeBanner, unwrapList } from '@framework/utils/normalize';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  const { position = 'home_top' } = req.query;
  const positionStr = Array.isArray(position) ? position[0] : position;

  try {
    const strapiRes = await fetch(
      `${(process.env.STRAPI_URL || "http://localhost:1337")}/api/banners${strapiBannerParams(positionStr)}`,
      {
        headers: API_TOKEN_HEADERS,
        cache: 'no-store',
      },
    );

    if (!strapiRes.ok) {
      const errorText = await strapiRes.text();
      console.error('Strapi banners fetch failed:', errorText);
      return res.status(strapiRes.status).json({ error: 'Failed to fetch banners' });
    }

    const data = await strapiRes.json();
    const banners = unwrapList(data, normalizeBanner);

    return res.status(200).json({ banners });
  } catch (error) {
    console.error('Banner API route error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
