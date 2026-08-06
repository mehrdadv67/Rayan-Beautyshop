import { createServerClient, CookieOptions } from '@supabase/ssr'
import type { GetServerSidePropsContext } from 'next'

function serializeCookie(
  name: string,
  value: string,
  options: CookieOptions,
): string {
  let cookie = `${name}=${value}; Path=${options?.path ?? '/'}`
  if (options?.maxAge !== undefined && options?.maxAge !== null) {
    cookie += `; Max-Age=${options.maxAge}`
  }
  if (options?.httpOnly) {
    cookie += `; HttpOnly`
  }
  if (options?.secure) {
    cookie += `; Secure`
  }
  if (options?.sameSite) {
    const sameSiteVal = options.sameSite as any
    cookie += `; SameSite=${
      typeof sameSiteVal === 'string'
        ? sameSiteVal.charAt(0).toUpperCase() + sameSiteVal.slice(1)
        : sameSiteVal
          ? 'Lax'
          : 'None'
    }`
  }
  return cookie
}

export function createServerSupabaseClient(ctx: GetServerSidePropsContext) {
  const { req, res } = ctx
  const pendingCookies: string[] = []

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies[name] || undefined
        },
        set(name: string, value: string, options: CookieOptions) {
          pendingCookies.push(serializeCookie(name, value, options))
        },
        remove(name: string, options: CookieOptions) {
          pendingCookies.push(serializeCookie(name, '', { ...options, maxAge: 0 }))
        },
      },
    },
  )

  // Flush any cookies set during the request (e.g. session refresh) to the
  // response. In Pages Router we have to do this manually because the
  // createServerClient cannot directly access the Node.js response object.
  const flushCookies = () => {
    if (pendingCookies.length > 0) {
      res.setHeader('Set-Cookie', pendingCookies)
    }
  }

  return { supabase, flushCookies }
}
