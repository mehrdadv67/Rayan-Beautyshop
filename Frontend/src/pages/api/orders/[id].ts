import type { NextApiRequest, NextApiResponse } from 'next'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { supabase, flushCookies } = createServerSupabaseClient({
    req: req as any,
    res: res as any,
  } as any)

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (req.method !== 'GET') {
    flushCookies()
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

  flushCookies()
  return res.status(200).json({ data: strapiData.data })
}
