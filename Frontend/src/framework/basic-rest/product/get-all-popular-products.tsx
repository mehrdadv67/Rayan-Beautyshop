import { QueryOptionsType, Product } from "@framework/types";
import {
  API_ENDPOINTS,
  strapiFlaggedParams,
} from "@framework/utils/api-endpoints";
import http from "@framework/utils/http";
import { normalizeProduct, unwrapList } from "@framework/utils/normalize";
import { useQuery } from "@tanstack/react-query";

export const fetchPopularProducts = async () => {
  const { data } = await http.get(
    `${API_ENDPOINTS.POPULAR_PRODUCTS}${strapiFlaggedParams("is_popular")}`
  );
  return unwrapList(data, normalizeProduct) as Product[];
};

export const usePopularProductsQuery = (options: QueryOptionsType) => {
  return useQuery<Product[], Error>({
    queryKey: [API_ENDPOINTS.POPULAR_PRODUCTS, options],
    queryFn: fetchPopularProducts,
  });
};
