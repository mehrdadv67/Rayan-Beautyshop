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

  const { name, email, rating, message, productId } = req.body;

  if (!name || !email || !rating || !message) {
    return res.status(400).json({ error: 'تمام فیلدها الزامی هستند' });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'امتیاز باید بین ۱ تا ۵ باشد' });
  }

  try {
    const payload: any = {
      name,
      email,
      rating,
      message,
      date: new Date().toISOString(),
    };

    if (productId) {
      payload.product = productId;
    }

    console.log('Creating review with payload:', JSON.stringify(payload, null, 2));

    const strapiRes = await fetch(`${(process.env.STRAPI_URL || "http://localhost:1337")}/api/reviews`, {
      method: 'POST',
      headers: API_TOKEN_HEADERS,
      body: JSON.stringify({ data: payload }),
    });

    const responseText = await strapiRes.text();
    console.log('Strapi response status:', strapiRes.status);
    console.log('Strapi response body:', responseText);

    if (!strapiRes.ok) {
      let errorDetails = responseText;
      try {
        const errorJson = JSON.parse(responseText);
        errorDetails = errorJson.error?.message || errorJson.error?.details || responseText;
      } catch {
        // keep raw text if not JSON
      }
      return res.status(strapiRes.status).json({
        error: 'خطا در ثبت نظر',
        details: errorDetails,
      });
    }

    const strapiData = JSON.parse(responseText);

    return res.status(201).json({
      message: 'نظر شما با موفقیت ثبت شد',
      data: strapiData.data,
    });
  } catch (error) {
    console.error('Review form error:', error);
    return res.status(500).json({ error: 'خطای سرور' });
  }
}
