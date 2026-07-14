import { QueryOptionsType, Product } from "@framework/types";
import {
  API_ENDPOINTS,
  strapiFlaggedParams,
} from "@framework/utils/api-endpoints";
import http from "@framework/utils/http";
import { normalizeProduct, unwrapList } from "@framework/utils/normalize";
import { useQuery } from "@tanstack/react-query";

export const fetchOnSellingProducts = async () => {
  const { data } = await http.get(
    `${API_ENDPOINTS.ON_SELLING_PRODUCTS}${strapiFlaggedParams(
      "is_on_selling"
    )}`
  );
  return unwrapList(data, normalizeProduct) as Product[];
};

export const useOnSellingProductsQuery = (options: QueryOptionsType) => {
  return useQuery<Product[], Error>({
    queryKey: [API_ENDPOINTS.ON_SELLING_PRODUCTS, options],
    queryFn: fetchOnSellingProducts,
  });
};
