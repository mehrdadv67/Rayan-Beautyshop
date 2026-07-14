import { QueryOptionsType, Product } from "@framework/types";
import {
  API_ENDPOINTS,
  strapiFlaggedParams,
} from "@framework/utils/api-endpoints";
import http from "@framework/utils/http";
import { normalizeProduct, unwrapList } from "@framework/utils/normalize";
import { useQuery } from "@tanstack/react-query";

export const fetchBestSellerProducts = async () => {
  const { data } = await http.get(
    `${API_ENDPOINTS.BEST_SELLER_PRODUCTS}${strapiFlaggedParams(
      "is_best_seller"
    )}`
  );
  return unwrapList(data, normalizeProduct) as Product[];
};

export const useBestSellerProductsQuery = (options: QueryOptionsType) => {
  return useQuery<Product[], Error>({
    queryKey: [API_ENDPOINTS.BEST_SELLER_PRODUCTS, options],
    queryFn: fetchBestSellerProducts,
  });
};
