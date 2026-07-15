import { QueryOptionsType, Product } from "@framework/types";
import {
  API_ENDPOINTS,
  strapiSearchParams,
} from "@framework/utils/api-endpoints";
import http from "@framework/utils/http";
import { normalizeProduct, unwrapList } from "@framework/utils/normalize";
import { useQuery } from "@tanstack/react-query";

export const fetchSearchedProducts = async (text: string) => {
  const { data } = await http.get(
    `${API_ENDPOINTS.SEARCH}${strapiSearchParams(text)}`
  );
  return unwrapList(data, normalizeProduct) as Product[];
};

export const useSearchQuery = (options: QueryOptionsType) => {
  return useQuery<Product[], Error>({
    queryKey: ["search", options],
    queryFn: () => fetchSearchedProducts(options.text ?? ""),
  });
};
