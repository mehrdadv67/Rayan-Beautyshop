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

const API_TOKEN_HEADERS = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
}

/** Cart item ids look like "12" or "12.5.7" (product id + attribute value ids). */
function parseCartItemId(rawId: any): { baseId: string; attrIds: string[] } {
  const parts = String(rawId ?? '').split('.').filter(Boolean)
  const [baseId, ...attrIds] = parts
  return { baseId, attrIds }
}

function getUserIdFromJwt(jwt: string | undefined): string | null {
  if (!jwt) return null
  try {
    const payload = JSON.parse(Buffer.from(jwt.split('.')[1], 'base64').toString())
    return String(payload.id || payload.user?.id || '')
  } catch {
    return null
  }
}

interface PricedLine {
  item: any
  unitPrice: number
  stock: number | null
  variantDocumentId?: string
  productDocumentId: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const user = await getStrapiUser(req)

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const userId = String(user.id)
    const body = req.body
    const cartItems: any[] = Array.isArray(body.products) ? body.products : []

    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'سبد خرید خالی است' })
    }

    // ---- Server-side price + stock validation against Strapi ----
    const parsed = cartItems.map((item) => ({
      item,
      ...parseCartItemId(item.id),
      quantity: Math.max(1, Number(item.quantity) || 1),
    }))
    const productIds = [...new Set(parsed.map((p) => p.baseId))].filter(Boolean)

    const productsRes = await fetch(
      `${process.env.STRAPI_URL}/api/products?filters[id][$in]=${productIds.join(',')}` +
        `&populate[variants][populate][options][populate][attribute_value][fields][0]=id`,
      { headers: API_TOKEN_HEADERS, cache: 'no-store' },
    )

    if (!productsRes.ok) {
      const errorText = await productsRes.text()
      console.error('Strapi products fetch failed:', errorText)
      return res.status(502).json({ error: 'خطا در دریافت اطلاعات محصولات' })
    }

    const products: any[] = (await productsRes.json()).data ?? []
    const productsById = new Map(products.map((p) => [String(p.id), p]))

    const lines: PricedLine[] = []
    for (const entry of parsed) {
      const product = productsById.get(entry.baseId)
      if (!product) {
        return res.status(400).json({
          error: `محصول «${entry.item.name ?? entry.baseId}» یافت نشد و ممکن است حذف شده باشد`,
        })
      }

      let unitPrice: number
      let stock: number | null
      let variantDocumentId: string | undefined

      if (entry.attrIds.length > 0) {
        // Find the variant whose options cover all selected attribute values.
        const variants = Array.isArray(product.variants) ? product.variants : []
        const variant = variants.find((v: any) => {
          const optIds = (Array.isArray(v.options) ? v.options : [])
            .map((o: any) => String(o?.attribute_value?.id ?? ''))
            .filter(Boolean)
          return entry.attrIds.every((a) => optIds.includes(a))
        })

        if (!variant) {
          return res.status(400).json({
            error: `ترکیب انتخابی محصول «${product.name ?? product.title ?? ''}» دیگر موجود نیست`,
          })
        }

        unitPrice = Number(variant.salePrice ?? variant.price ?? 0)
        stock = variant.stock != null ? Number(variant.stock) : null
        variantDocumentId = variant.documentId
      } else {
        unitPrice = Number(product.display_price ?? 0)
        stock = product.stock != null ? Number(product.stock) : null
      }

      // stock === null means inventory is not tracked for this item.
      if (stock != null && stock < entry.quantity) {
        return res.status(400).json({
          error: `موجودی «${entry.item.name ?? ''}» کافی نیست (${stock} عدد باقی مانده)`,
        })
      }

      lines.push({
        item: entry.item,
        unitPrice,
        stock,
        variantDocumentId,
        productDocumentId: product.documentId,
      })
    }

    // Authoritative total computed on the server; the client value is ignored.
    const shippingFee = 0
    const serverTotal =
      lines.reduce(
        (sum, line, i) => sum + line.unitPrice * parsed[i].quantity,
        0,
      ) + shippingFee

    const orderPayload = {
      data: {
        name: `${body.firstName || ''} ${body.lastName || ''}`.trim() || user.email || '',
        email: body.email || user.email || '',
        phone: body.phone || '',
        address: body.address || '',
        city: body.city || '',
        zip_code: body.zipCode || '',
        total: serverTotal,
        shipping_fee: shippingFee,
        payment_gateway: body.paymentMethod || 'cash_on_delivery',
        status: 'pending',
        products: lines.map((line, i) => ({
          ...line.item,
          quantity: parsed[i].quantity,
          price: line.unitPrice,
        })),
        customer: user.id,
      },
    }

    const strapiRes = await fetch(`${process.env.STRAPI_URL}/api/orders`, {
      method: 'POST',
      headers: API_TOKEN_HEADERS,
      body: JSON.stringify(orderPayload),
    })

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

    // ---- Decrement stock in Strapi (best-effort, after successful order) ----
    const variantDeltas = new Map<string, number>()
    const productDeltas = new Map<string, number>()
    lines.forEach((line, i) => {
      const qty = parsed[i].quantity
      if (line.stock == null) return
      if (line.variantDocumentId) {
        variantDeltas.set(
          line.variantDocumentId,
          (variantDeltas.get(line.variantDocumentId) ?? 0) + qty,
        )
      } else {
        productDeltas.set(
          line.productDocumentId,
          (productDeltas.get(line.productDocumentId) ?? 0) + qty,
        )
      }
    })

    const stockUpdates: Promise<void>[] = []
    for (const [documentId, qty] of variantDeltas) {
      const line = lines.find((l) => l.variantDocumentId === documentId)!
      stockUpdates.push(
        fetch(`${process.env.STRAPI_URL}/api/product-variants/${documentId}`, {
          method: 'PUT',
          headers: API_TOKEN_HEADERS,
          body: JSON.stringify({ data: { stock: (line.stock ?? 0) - qty } }),
        }).then(() => undefined),
      )
    }
    for (const [documentId, qty] of productDeltas) {
      const line = lines.find(
        (l) => !l.variantDocumentId && l.productDocumentId === documentId,
      )!
      stockUpdates.push(
        fetch(`${process.env.STRAPI_URL}/api/products/${documentId}`, {
          method: 'PUT',
          headers: API_TOKEN_HEADERS,
          body: JSON.stringify({ data: { stock: (line.stock ?? 0) - qty } }),
        }).then(() => undefined),
      )
    }
    await Promise.all(stockUpdates)

    return res.status(201).json({
      message: 'Order created successfully',
      orderId,
      total: serverTotal,
      order: strapiData.data,
    })
  }

  if (req.method === 'GET') {
    const cookies = parseCookies(req.headers.cookie)
    const userJwt = cookies.strapi_jwt
    const userId = getUserIdFromJwt(userJwt)

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const strapiRes = await fetch(
      `${process.env.STRAPI_URL}/api/orders?populate[0]=order_items&populate[1]=order_items.order_item&populate[2]=customer&filters[customer][id][$eq]=${userId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userJwt}`,
        },
      },
    )

    if (!strapiRes.ok) {
      const errorText = await strapiRes.text()
      console.error('Strapi orders fetch failed:', errorText)
      return res.status(strapiRes.status).json({ error: 'Failed to fetch orders' })
    }

    const strapiData = await strapiRes.json()

    return res.status(200).json({ orders: strapiData.data || [] })
  }

  res.setHeader('Allow', ['POST', 'GET'])
  return res.status(405).json({ error: `Method ${req.method} not allowed` })
}
