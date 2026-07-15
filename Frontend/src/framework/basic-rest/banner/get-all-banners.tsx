import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS, strapiBannerParams } from "@framework/utils/api-endpoints";
import http from "@framework/utils/http";
import { normalizeBanner, unwrapList } from "@framework/utils/normalize";

export const fetchBanners = async (position = "home_top") => {
  const { data } = await http.get(
    `${API_ENDPOINTS.BANNERS}${strapiBannerParams(position)}`,
  );
  return {
    banners: {
      data: unwrapList(data, normalizeBanner),
    },
  };
};

export const useBannersQuery = (position = "home_top") => {
  return useQuery<{ banners: { data: any[] } }, Error>({
    queryKey: [API_ENDPOINTS.BANNERS, position],
    queryFn: () => fetchBanners(position),
  });
};
