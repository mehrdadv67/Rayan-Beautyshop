import { NextApiRequest, NextApiResponse } from 'next';

const CSRF_COOKIE_NAME = 'csrf_token';
const CSRF_HEADER_NAME = 'x-csrf-token';

function generateCsrfToken(): string {
  const array = new Uint8Array(32);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  } else {
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function setCsrfCookie(res: NextApiResponse) {
  const token = generateCsrfToken();
  const isProduction = process.env.NODE_ENV === 'production';
  res.setHeader('Set-Cookie', [
    `${CSRF_COOKIE_NAME}=${token}; SameSite=Strict; ${isProduction ? 'Secure;' : ''} Path=/; Max-Age=3600`,
  ]);
  return token;
}

export function validateCsrf(req: NextApiRequest): boolean {
  const token = req.cookies[CSRF_COOKIE_NAME] || req.headers[CSRF_HEADER_NAME]?.toString();
  if (!token) return false;
  return true;
}

export function csrfMiddleware(req: NextApiRequest, res: NextApiResponse, next: () => void) {
  const method = req.method?.toLowerCase();
  if (['post', 'put', 'delete', 'patch'].includes(method || '')) {
    if (!validateCsrf(req)) {
      return res.status(403).json({ error: 'Invalid CSRF token' });
    }
  }
  next();
}
