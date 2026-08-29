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
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const cookies = parseCookies(req.headers.cookie);
  const jwt = cookies.strapi_jwt;

  if (!jwt) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { firstName, lastName, gender, address, city, zipCode } = req.body;

  const updatePayload: Record<string, any> = {};
  if (firstName !== undefined) updatePayload.firstName = firstName;
  if (lastName !== undefined) updatePayload.lastName = lastName;
  if (gender !== undefined) updatePayload.gender = gender;
  if (address !== undefined) updatePayload.address = address;
  if (city !== undefined) updatePayload.city = city;
  if (zipCode !== undefined) updatePayload.zipCode = zipCode;

  const strapiRes = await fetch(`${(process.env.STRAPI_URL || "http://localhost:1337")}/api/users/me`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify(updatePayload),
  });

  const data = await strapiRes.json();

  if (!strapiRes.ok) {
    const message = data.message?.message || data.message || 'Failed to update profile';
    return res.status(400).json({ message });
  }

  return res.status(200).json({ user: data });
}
