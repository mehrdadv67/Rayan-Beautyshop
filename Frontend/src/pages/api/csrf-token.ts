import type { NextApiRequest, NextApiResponse } from 'next';
import { setCsrfCookie } from '@/lib/csrf';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  setCsrfCookie(res);
  return res.status(200).json({ csrfToken: req.cookies.csrf_token || null });
}
