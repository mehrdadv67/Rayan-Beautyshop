import { QueryOptionsType, Product } from "@framework/types";
import { API_ENDPOINTS, strapiListParams } from "@framework/utils/api-endpoints";
import http from "@framework/utils/http";
import { normalizeProduct, unwrapList } from "@framework/utils/normalize";
import { useQuery } from "@tanstack/react-query";

export const fetchProducts = async () => {
  const { data } = await http.get(
    `${API_ENDPOINTS.PRODUCTS_2}${strapiListParams()}`
  );
  return unwrapList(data, normalizeProduct) as Product[];
};

export const useProductsQuery = (options: QueryOptionsType) => {
  return useQuery<Product[], Error>({
    queryKey: ["products2", options],
    queryFn: fetchProducts,
  });
};
