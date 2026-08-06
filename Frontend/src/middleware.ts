import { createServerClient, CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

function serializeCookie(
  name: string,
  value: string,
  options: CookieOptions,
): string {
  let cookie = `${name}=${value}; Path=${options?.path ?? '/'}`
  if (options?.maxAge !== undefined && options?.maxAge !== null) {
    cookie += `; Max-Age=${options.maxAge}`
  }
  if (options?.httpOnly) cookie += `; HttpOnly`
  if (options?.secure) cookie += `; Secure`
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

const protectedPaths = ['/my-account', '/checkout', '/order', '/phones']

const authPaths = ['/signin', '/signup']

export async function middleware(request: NextRequest) {
  const supabaseResponse = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          supabaseResponse.cookies.set(
            name,
            value,
            options as Record<string, unknown>,
          )
        },
        remove(name: string, options: CookieOptions) {
          supabaseResponse.cookies.set(
            name,
            '',
            options as Record<string, unknown>,
          )
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  const isProtected = protectedPaths.some((path) => pathname.startsWith(path))
  const isAuthPage = authPaths.some((path) => pathname.startsWith(path))

  if (isProtected && !user) {
    const redirectUrl = new URL('/signin', request.url)
    redirectUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(redirectUrl, {
      headers: supabaseResponse.headers,
    })
  }

  if (isAuthPage && user) {
    return NextResponse.redirect(new URL('/my-account', request.url), {
      headers: supabaseResponse.headers,
    })
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - _middleware (old middleware paths)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
