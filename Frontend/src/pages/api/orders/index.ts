import type { NextApiRequest, NextApiResponse } from 'next'

function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  if (!cookieHeader) return {}
  return cookieHeader.split(';').reduce((acc, c) => {
    const [k, ...v] = c.trim().split('=')
    acc[k] = v.join('=')
    return acc
  }, {} as Record<string, string>)
}

async function getStrapiUser(req: NextApiRequest): Promise<any | null> {
  const cookies = parseCookies(req.headers.cookie)
  const jwt = cookies.strapi_jwt

  if (!jwt) {
    return null
  }

  try {
    const res = await fetch(`${process.env.STRAPI_URL}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      cache: 'no-store',
    })

    if (!res.ok) {
      return null
    }

    return await res.json()
  } catch {
    return null
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getStrapiUser(req)

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const userId = String(user.id)

  if (req.method === 'POST') {
    const body = req.body

    const orderPayload = {
      data: {
        name: `${body.firstName || ''} ${body.lastName || ''}`.trim() || user.email || '',
        email: body.email || user.email || '',
        phone: body.phone || '',
        address: body.address || '',
        city: body.city || '',
        zip_code: body.zipCode || '',
        total: body.total || 0,
        shipping_fee: body.shippingFee || 0,
        payment_gateway: body.paymentMethod || 'cash_on_delivery',
        status: 'pending',
        products: Array.isArray(body.products) ? body.products : [],
      },
    }

    const strapiRes = await fetch(
      `${process.env.STRAPI_URL}/api/orders`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
        body: JSON.stringify(orderPayload),
      },
    )

    if (!strapiRes.ok) {
      const strapiError = await strapiRes.text()
      console.error('Strapi order creation failed:', strapiError)
      return res.status(strapiRes.status).json({
        error: 'Failed to create order in Strapi',
        details: strapiError,
      })
    }

    const strapiData = await strapiRes.json()
    const orderId = strapiData.data?.documentId || strapiData.data?.id

    return res.status(201).json({
      message: 'Order created successfully',
      orderId,
      order: strapiData.data,
    })
  }

  if (req.method === 'GET') {
    const strapiRes = await fetch(
      `${process.env.STRAPI_URL}/api/orders?populate[0]=order_items&populate[1]=order_items.order_item`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
      },
    )

    if (!strapiRes.ok) {
      const errorText = await strapiRes.text()
      console.error('Strapi orders fetch failed:', errorText)
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const strapiData = await strapiRes.json()

    return res.status(200).json({ orders: strapiData.data || [] })
  }

  res.setHeader('Allow', ['POST', 'GET'])
  return res.status(405).json({ error: `Method ${req.method} not allowed` })
}
