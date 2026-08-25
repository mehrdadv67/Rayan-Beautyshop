import type { NextApiRequest, NextApiResponse } from 'next';

const API_TOKEN_HEADERS = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'تمام فیلدها الزامی هستند' });
  }

  try {
    const strapiRes = await fetch(`${process.env.STRAPI_URL}/api/contact-messages`, {
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
