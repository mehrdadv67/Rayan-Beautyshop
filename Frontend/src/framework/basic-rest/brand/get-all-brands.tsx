import { QueryOptionsType, Brand } from "@framework/types";
import {
  API_ENDPOINTS,
  strapiBrandParams,
} from "@framework/utils/api-endpoints";
import http from "@framework/utils/http";
import { normalizeBrand, unwrapList } from "@framework/utils/normalize";
import { useQuery } from "@tanstack/react-query";

export const fetchBrands = async () => {
  const { data } = await http.get(
    `${API_ENDPOINTS.BRANDS}${strapiBrandParams()}`,
  );
  const brands = unwrapList(data, normalizeBrand) as Brand[];
  // The template renders brands in three identical layouts; all three point
  // at the same Strapi list.
  return {
    brands,
    brandsGrid: brands,
    brandsTimer: brands,
  };
};

const fetchAncientBrands = fetchBrands;

export const useBrandsQuery = (options: QueryOptionsType) => {
  return useQuery<
    { brands: Brand[]; brandsGrid: Brand[]; brandsTimer: Brand[] },
    Error
  >({
    queryKey:
      options.demoVariant === "ancient"
        ? [API_ENDPOINTS.BRANDS_ANCIENT, options]
        : [API_ENDPOINTS.BRANDS, options],
    queryFn:
      options.demoVariant === "ancient" ? fetchAncientBrands : fetchBrands,
  });
};
