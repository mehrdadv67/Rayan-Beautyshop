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

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profileError && profileError.code !== 'PGRST116') {
    console.error('Profile fetch error:', profileError)
  }

  const profileData = profile || {}

  if (req.method === 'POST') {
    const body = req.body

    if (body.save) {
      const { error: upsertError } = await supabase.from('profiles').upsert({
        id: user.id,
        first_name: body.firstName || '',
        last_name: body.lastName || '',
        phone_number: body.phone || '',
        address: body.address || '',
        city: body.city || '',
        zip_code: body.zipCode || '',
      })

      if (upsertError) {
        console.error('Profile upsert error:', upsertError)
      }
    }

    const orderPayload = {
      data: {
        customer: {
          connect: [user.id],
        },
        name: `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() || user.email,
        email: user.email || '',
        phone: profileData.phone_number || body.phone || '',
        address: profileData.address || body.address || '',
        city: profileData.city || body.city || '',
        zip_code: profileData.zip_code || body.zipCode || '',
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

    flushCookies()
    return res.status(201).json({
      message: 'Order created successfully',
      orderId,
      order: strapiData.data,
    })
  }

  if (req.method === 'GET') {
    const phoneNumber = profileData.phone_number || ''

    const strapiRes = await fetch(
      `${process.env.STRAPI_URL}/api/orders?filters[phone][$eq]=${encodeURIComponent(phoneNumber)}&populate[0]=order_items`,
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

    flushCookies()
    return res.status(200).json({ orders: strapiData.data || [] })
  }

  flushCookies()
  res.setHeader('Allow', ['POST', 'GET'])
  return res.status(405).json({ error: `Method ${req.method} not allowed` })
}
