import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@framework/utils/api-endpoints";

export const fetchBanners = async (position = "home_top") => {
  const response = await fetch(
    `/api/banners?position=${encodeURIComponent(position)}`,
    { cache: 'no-store' }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to fetch banners');
  }

  const data = await response.json();
  return {
    banners: {
      data: data.banners || [],
    },
  };
};

export const useBannersQuery = (position = "home_top") => {
  return useQuery<{ banners: { data: any[] } }, Error>({
    queryKey: [API_ENDPOINTS.BANNERS, position],
    queryFn: () => fetchBanners(position),
  });
};
