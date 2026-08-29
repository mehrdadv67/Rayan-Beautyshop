import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const strapiRes = await fetch(`${(process.env.STRAPI_URL || "http://localhost:1337")}/api/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  const data = await strapiRes.json();

  if (!strapiRes.ok) {
    return res.status(400).json({
      message: data.message?.message || data.message || 'Failed to send reset email',
    });
  }

  return res.status(200).json({ ok: true, message: data.message || 'Reset email sent' });
}
