import { useQuery } from "@tanstack/react-query";

export const fetchSiteConfig = async () => {
  const response = await fetch(`/api/site-config`, { cache: 'no-store' });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to fetch site config');
  }

  return response.json();
};

export const useSiteConfigQuery = () => {
  return useQuery<{ logo: { url: string; width: number; height: number }; favicon: { url: string; width: number; height: number } }, Error>({
    queryKey: ['/api/site-config'],
    queryFn: fetchSiteConfig,
    staleTime: 1000 * 60 * 5,
  });
};
