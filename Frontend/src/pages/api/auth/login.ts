import type { NextApiRequest, NextApiResponse } from 'next';

function serializeCookie(value: string, maxAge: number): string {
  const isProduction = process.env.NODE_ENV === 'production';
  const parts = [
    `strapi_jwt=${value}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${maxAge}`,
  ];
  if (isProduction) {
    parts.push('Secure');
  }
  return parts.join('; ');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const strapiRes = await fetch(`${process.env.STRAPI_URL}/api/auth/local`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: email, password }),
  });

  const data = await strapiRes.json();

  if (!strapiRes.ok) {
    return res.status(401).json({
      message: data.message?.message || data.message || 'Invalid credentials',
    });
  }

  res.setHeader('Set-Cookie', serializeCookie(data.jwt, 30 * 24 * 60 * 60));

  return res.status(200).json({ user: data.user });
}
