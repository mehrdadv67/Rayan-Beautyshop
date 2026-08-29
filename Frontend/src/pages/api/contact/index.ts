import type { NextApiRequest, NextApiResponse } from 'next';
import { rateLimit, getRateLimitIdentifier } from '@/lib/rate-limit';
import { setCsrfCookie, validateCsrf } from '@/lib/csrf';

const API_TOKEN_HEADERS = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  setCsrfCookie(res);

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const identifier = getRateLimitIdentifier(req);
  if (!rateLimit(identifier, 5, 60000)) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  if (!validateCsrf(req)) {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }

  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'تمام فیلدها الزامی هستند' });
  }

  try {
    const strapiRes = await fetch(`${(process.env.STRAPI_URL || "http://localhost:1337")}/api/contact-messages`, {
      method: 'POST',
      headers: API_TOKEN_HEADERS,
      body: JSON.stringify({
        data: {
          name,
          email,
          subject,
          message,
          date: new Date().toISOString(),
        },
      }),
    });

    if (!strapiRes.ok) {
      const errorText = await strapiRes.text();
      console.error('Strapi contact message failed:', errorText);
      return res.status(strapiRes.status).json({
        error: 'خطا در ارسال پیام',
        details: errorText,
      });
    }

    const strapiData = await strapiRes.json();

    return res.status(201).json({
      message: 'پیام شما با موفقیت ارسال شد',
      data: strapiData.data,
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({ error: 'خطای سرور' });
  }
}
