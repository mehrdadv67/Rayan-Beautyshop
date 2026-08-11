import { useQuery } from '@tanstack/react-query';
import type { User } from '@framework/types';

async function getUser(): Promise<User> {
  const res = await fetch('/api/customer/me', {
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('User not found');
  }

  const { user } = await res.json();

  if (!user) {
    throw new Error('User not found');
  }

  return user;
}

export const useGetUserQuery = () => {
  return useQuery({
    queryKey: ['current-user'],
    queryFn: getUser,
  });
};
