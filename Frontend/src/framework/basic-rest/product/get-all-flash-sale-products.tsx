import { QueryOptionsType, Product } from "@framework/types";
import {
  API_ENDPOINTS,
  strapiFlaggedParams,
} from "@framework/utils/api-endpoints";
import http from "@framework/utils/http";
import { normalizeProduct, unwrapList } from "@framework/utils/normalize";
import { useQuery } from "@tanstack/react-query";

export const fetchFlashSaleProducts = async () => {
  const { data } = await http.get(
    `${API_ENDPOINTS.FLASH_SALE_PRODUCTS}${strapiFlaggedParams(
      "is_flash_sale"
    )}`
  );
  return unwrapList(data, normalizeProduct) as Product[];
};

const fetchAncientFlashSaleProducts = fetchFlashSaleProducts;

export const useFlashSaleProductsQuery = (options: QueryOptionsType) => {
  return useQuery<any, Error>({
    queryKey: [API_ENDPOINTS.FLASH_SALE_PRODUCTS, options],
    queryFn: fetchFlashSaleProducts,
  });
};

export { fetchAncientFlashSaleProducts };
