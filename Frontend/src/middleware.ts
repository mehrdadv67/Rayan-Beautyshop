import { NextResponse, type NextRequest } from 'next/server';

const protectedPaths = ['/my-account', '/checkout', '/order', '/phones'];
const authPaths = ['/signin', '/signup'];

async function getStrapiUser(jwt: string | undefined): Promise<any | null> {
  if (!jwt) return null;

  try {
    const res = await fetch(`${process.env.STRAPI_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${jwt}` },
      next: { revalidate: 0 },
    });

    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const strapiJwt = request.cookies.get('strapi_jwt')?.value;
  const user = await getStrapiUser(strapiJwt);

  const { pathname } = request.nextUrl;
  const locale = pathname.split('/')[1] || 'fa';

  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));
  const isAuthPage = authPaths.some((path) => pathname.startsWith(path));

  if (isProtected && !user) {
    const redirectUrl = new URL(`/${locale}/signin`, request.url);
    redirectUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (isAuthPage && user) {
    return NextResponse.redirect(new URL(`/${locale}/my-account`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
