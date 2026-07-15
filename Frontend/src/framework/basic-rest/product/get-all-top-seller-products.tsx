import { QueryOptionsType, Product } from "@framework/types";
import {
  API_ENDPOINTS,
  strapiFlaggedParams,
} from "@framework/utils/api-endpoints";
import http from "@framework/utils/http";
import { normalizeProduct, unwrapList } from "@framework/utils/normalize";
import { useQuery } from "@tanstack/react-query";

export const fetchTopSellerProducts = async () => {
  const { data } = await http.get(
    `${API_ENDPOINTS.TOP_SELLER_PRODUCTS}${strapiFlaggedParams(
      "is_top_seller"
    )}`
  );
  return unwrapList(data, normalizeProduct) as Product[];
};

export const useTopSellerProductsQuery = (options: QueryOptionsType) => {
  return useQuery<Product[], Error>({
    queryKey: ["topSellerProducts", options],
    queryFn: fetchTopSellerProducts,
  });
};
