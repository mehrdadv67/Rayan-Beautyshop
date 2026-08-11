import type { NextApiRequest, NextApiResponse } from 'next';

function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  if (!cookieHeader) return {};
  return cookieHeader.split(';').reduce((acc, c) => {
    const [k, ...v] = c.trim().split('=');
    acc[k] = v.join('=');
    return acc;
  }, {} as Record<string, string>);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const cookies = parseCookies(req.headers.cookie);
  const jwt = cookies.strapi_jwt;

  if (!jwt) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and current password are required' });
  }

  const strapiRes = await fetch(`${process.env.STRAPI_URL}/api/auth/change-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await strapiRes.json();

  if (!strapiRes.ok) {
    const message = data.message?.message || data.message || 'Failed to change email';
    return res.status(400).json({ message });
  }

  return res.status(200).json({ ok: true });
}
