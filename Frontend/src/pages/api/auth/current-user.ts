import type { NextApiRequest, NextApiResponse } from 'next';

function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  if (!cookieHeader) return {};
  return cookieHeader.split(';').reduce((acc, c) => {
    const [k, ...v] = c.trim().split('=');
    acc[k] = v.join('=');
    return acc;
  }, {} as Record<string, string>);
}

function serializeClearCookie(): string {
  const isProduction = process.env.NODE_ENV === 'production';
  const parts = [
    'strapi_jwt=',
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    'Max-Age=0',
  ];
  if (isProduction) {
    parts.push('Secure');
  }
  return parts.join('; ');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const cookies = parseCookies(req.headers.cookie);
  const jwt = cookies.strapi_jwt;

  if (!jwt) {
    return res.status(200).json({ user: null });
  }

  const strapiRes = await fetch(`${(process.env.STRAPI_URL || "http://localhost:1337")}/api/users/me`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });

  if (!strapiRes.ok) {
    res.setHeader('Set-Cookie', serializeClearCookie());
    return res.status(200).json({ user: null });
  }

  const user = await strapiRes.json();

  return res.status(200).json({ user });
}
