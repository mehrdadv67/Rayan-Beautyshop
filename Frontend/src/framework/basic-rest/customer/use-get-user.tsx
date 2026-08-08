import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@framework/types';

async function getUser(): Promise<User> {
  const supabase = createClient();

  const { data: { user: authUser }, error: authError } =
    await supabase.auth.getUser();

  if (authError || !authUser) {
    throw new Error('User not found');
  }

  let profile = null
  try {
    const result = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single()
    profile = result.data
    if (result.error && result.error.code !== 'PGRST116') {
      console.warn('Profile fetch warning:', result.error)
    }
  } catch (e) {
    console.warn('Profiles table may not exist yet:', e)
  }

  return {
    id: authUser.id,
    username: profile?.username ?? authUser.user_metadata?.username ?? '',
    email: authUser.email ?? '',
    firstName: profile?.first_name ?? authUser.user_metadata?.first_name ?? '',
    lastName: profile?.last_name ?? authUser.user_metadata?.last_name ?? '',
    phoneNumber: profile?.phone_number ?? '',
    address: profile?.address ?? '',
    city: profile?.city ?? '',
    zipCode: profile?.zip_code ?? '',
    gender: profile?.gender ?? '',
    provider: authUser.app_metadata?.provider ?? 'email',
    confirmed: authUser.email_confirmed_at ? true : false,
    blocked: false,
    createdAt: authUser.created_at,
    updatedAt: authUser.updated_at ?? authUser.created_at,
  };
}

export const useGetUserQuery = () => {
  return useQuery({
    queryKey: ['current-user'],
    queryFn: getUser,
  });
};
