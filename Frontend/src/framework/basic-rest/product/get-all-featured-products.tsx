import { QueryOptionsType, Product } from "@framework/types";
import {
  API_ENDPOINTS,
  strapiFlaggedParams,
} from "@framework/utils/api-endpoints";
import http from "@framework/utils/http";
import { normalizeProduct, unwrapList } from "@framework/utils/normalize";
import { useQuery } from "@tanstack/react-query";

export const fetchFeaturedProducts = async () => {
  const { data } = await http.get(
    `${API_ENDPOINTS.FEATURED_PRODUCTS}${strapiFlaggedParams("is_featured")}`
  );
  return unwrapList(data, normalizeProduct) as Product[];
};

const fetchAncientFeaturedProducts = fetchFeaturedProducts;

export const useFeaturedProductsQuery = (options: QueryOptionsType) => {
  return useQuery<Product[], Error>({
    queryKey: [API_ENDPOINTS.FEATURED_PRODUCTS, options],
    queryFn: fetchFeaturedProducts,
  });
};

// keep legacy export name some imports may use
export { fetchAncientFeaturedProducts };
