import { useQuery } from '@tanstack/react-query';
import http from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { User } from '@framework/types';

async function getUser() {
  const { data } = await http.get<User>(API_ENDPOINTS.USERS_ME);
  return data;
}

export const useGetUserQuery = () => {
  return useQuery({
    queryKey: ['/users-permissions/users/me'],
    queryFn: getUser,
  });
};
