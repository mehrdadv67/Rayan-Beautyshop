import { QueryOptionsType, Product } from "@framework/types";
import {
  API_ENDPOINTS,
  strapiListParams,
} from "@framework/utils/api-endpoints";
import http from "@framework/utils/http";
import { normalizeProduct, unwrapList } from "@framework/utils/normalize";
import { useQuery } from "@tanstack/react-query";

export const fetchNewArrivalProducts = async () => {
  const { data } = await http.get(
    `${API_ENDPOINTS.NEW_ARRIVAL_PRODUCTS}${strapiListParams()}&filters[collections][slug][$eq]=new-products`
  );
  return unwrapList(data, normalizeProduct) as Product[];
};

const fetchNewArrivalAncientProducts = fetchNewArrivalProducts;

export const useNewArrivalProductsQuery = (options: QueryOptionsType) => {
  return useQuery<Product[], Error>({
    queryKey: ["newArrivalProducts", options],
    queryFn: fetchNewArrivalProducts,
  });
};

export { fetchNewArrivalAncientProducts };
