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
  if (!jwt) return null

  try {
    const res = await fetch(`${process.env.STRAPI_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${jwt}` },
      cache: 'no-store',
    })
    if (!res.ok) return null
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

  const jwt = parseCookies(req.headers.cookie).strapi_jwt

  if (req.method === 'GET') {
    return res.status(200).json({ items: Array.isArray(user.cart) ? user.cart : [] })
  }

  if (req.method === 'PUT') {
    const items = Array.isArray(req.body?.items) ? req.body.items : []
    const strapiRes = await fetch(`${process.env.STRAPI_URL}/api/users/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({ cart: items }),
    })

    if (!strapiRes.ok) {
      const errorText = await strapiRes.text()
      console.error('Strapi cart save failed:', errorText)
      return res.status(502).json({ error: 'Failed to save cart' })
    }

    return res.status(200).json({ ok: true })
  }

  res.setHeader('Allow', ['GET', 'PUT'])
  return res.status(405).json({ error: `Method ${req.method} not allowed` })
}
