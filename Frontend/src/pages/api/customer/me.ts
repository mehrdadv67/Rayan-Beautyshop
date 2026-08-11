import type { NextApiRequest, NextApiResponse } from 'next';

function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  if (!cookieHeader) return {};
  return cookieHeader.split(';').reduce((acc, c) => {
    const [k, ...v] = c.trim().split('=');
    acc[k] = v.join('=');
    return acc;
  }, {} as Record<string, string>);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const cookies = parseCookies(req.headers.cookie);
  const jwt = cookies.strapi_jwt;

  if (!jwt) {
    return res.status(401).json({ user: null });
  }

  const strapiRes = await fetch(`${process.env.STRAPI_URL}/api/users/me`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });

  if (!strapiRes.ok) {
    return res.status(401).json({ user: null });
  }

  const strapiUser = await strapiRes.json();

  const user = {
    id: String(strapiUser.id),
    username: strapiUser.username ?? '',
    email: strapiUser.email ?? '',
    firstName: strapiUser.firstName ?? strapiUser.firstname ?? '',
    lastName: strapiUser.lastName ?? strapiUser.lastname ?? '',
    phoneNumber: strapiUser.phoneNumber ?? '',
    address: strapiUser.address ?? '',
    city: strapiUser.city ?? '',
    zipCode: strapiUser.zipCode ?? '',
    gender: strapiUser.gender ?? '',
    provider: strapiUser.provider ?? 'email',
    confirmed: Boolean(strapiUser.confirmed),
    blocked: Boolean(strapiUser.blocked),
    createdAt: strapiUser.createdAt ?? strapiUser.created_at ?? '',
    updatedAt: strapiUser.updatedAt ?? strapiUser.updated_at ?? '',
  };

  return res.status(200).json({ user });
}
