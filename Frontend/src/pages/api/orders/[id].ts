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

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).json({ error: `Method ${req.method} not allowed` })
  }

  const { id } = req.query
  const orderId = id?.toString()

  if (!orderId) {
    return res.status(400).json({ error: 'Order ID is required' })
  }

  const strapiRes = await fetch(
    `${process.env.STRAPI_URL}/api/orders/${encodeURIComponent(orderId)}?populate[0]=order_items&populate[1]=order_items.order_item`,
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
    console.error('Strapi order fetch failed:', errorText)
    return res.status(404).json({ error: 'Order not found' })
  }

  const strapiData = await strapiRes.json()
  const order = strapiData.data

  if (!order || String(order.customer?.id) !== String(user.id)) {
    return res.status(404).json({ error: 'Order not found' })
  }

  return res.status(200).json({ data: order })
}
