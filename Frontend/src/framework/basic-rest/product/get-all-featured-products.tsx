import { QueryOptionsType, Product } from "@framework/types";
import {
  API_ENDPOINTS,
  strapiTaggedParams,
} from "@framework/utils/api-endpoints";
import http from "@framework/utils/http";
import { normalizeProduct, unwrapList } from "@framework/utils/normalize";
import { useQuery } from "@tanstack/react-query";

export const fetchFeaturedProducts = async () => {
  const { data } = await http.get(
    `${API_ENDPOINTS.FEATURED_PRODUCTS}${strapiTaggedParams("featured")}`
  );
  return unwrapList(data, normalizeProduct) as Product[];
};

const fetchAncientFeaturedProducts = fetchFeaturedProducts;

export const useFeaturedProductsQuery = (options: QueryOptionsType) => {
  return useQuery<Product[], Error>({
    queryKey: ["featuredProducts", options],
    queryFn: fetchFeaturedProducts,
  });
};

export { fetchAncientFeaturedProducts };
