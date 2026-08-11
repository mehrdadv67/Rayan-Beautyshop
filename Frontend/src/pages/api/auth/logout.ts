import type { NextApiRequest, NextApiResponse } from 'next';

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

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Set-Cookie', serializeClearCookie());
  return res.status(200).json({ ok: true, message: 'Logged out successfully' });
}
