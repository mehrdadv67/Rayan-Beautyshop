import type { NextApiRequest, NextApiResponse } from 'next'

const API_TOKEN_HEADERS = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { phone } = req.body

  if (!phone || typeof phone !== 'string') {
    return res.status(400).json({ error: 'Phone number is required' })
  }

  const normalizedPhone = phone.trim()

  if (!/^09[0-9]{9}$/.test(normalizedPhone)) {
    return res.status(400).json({ error: 'Invalid phone number format' })
  }

  try {
    const strapiRes = await fetch(`${process.env.STRAPI_URL}/api/discount-subscriptions`, {
      method: 'POST',
      headers: API_TOKEN_HEADERS,
      body: JSON.stringify({ data: { phone: normalizedPhone, date: new Date().toISOString() } }),
    })

    if (!strapiRes.ok) {
      const errorText = await strapiRes.text()
      console.error('Strapi discount subscription failed:', errorText)
      return res.status(strapiRes.status).json({
        error: 'Failed to create subscription',
        details: errorText,
      })
    }

    const strapiData = await strapiRes.json()

    return res.status(201).json({
      message: 'Subscription created successfully',
      subscription: strapiData.data,
    })
  } catch (error) {
    console.error('Subscription error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
