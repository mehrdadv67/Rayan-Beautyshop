import { QueryOptionsType, Product } from "@framework/types";
import { API_ENDPOINTS, strapiListParams } from "@framework/utils/api-endpoints";
import http from "@framework/utils/http";
import { normalizeProduct, unwrapList } from "@framework/utils/normalize";
import shuffle from "lodash/shuffle";
import { useInfiniteQuery } from "@tanstack/react-query";

type PaginatedProduct = {
  data: Product[];
  paginatorInfo: {
    nextPageUrl: string | undefined;
  };
};

const fetchProducts = async () => {
  const { data } = await http.get(
    `${API_ENDPOINTS.PRODUCTS}${strapiListParams()}`
  );
  const products = unwrapList(data, normalizeProduct);
  return {
    data: shuffle(products),
    paginatorInfo: {
      // Single-page list: there is no next page.
      nextPageUrl: undefined,
    },
  };
};

const useProductsQuery = (options: QueryOptionsType) => {
  return useInfiniteQuery<PaginatedProduct, Error>({
    queryKey: ["products", options],
    queryFn: fetchProducts,
    initialPageParam: 1,
    getNextPageParam: () => undefined,
  });
};

export { useProductsQuery, fetchProducts };
