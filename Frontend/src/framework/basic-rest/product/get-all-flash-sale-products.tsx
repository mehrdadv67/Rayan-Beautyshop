import { QueryOptionsType, Product } from "@framework/types";
import {
  API_ENDPOINTS,
  strapiTaggedParams,
} from "@framework/utils/api-endpoints";
import http from "@framework/utils/http";
import { normalizeProduct, unwrapList } from "@framework/utils/normalize";
import { useQuery } from "@tanstack/react-query";

export const fetchFlashSaleProducts = async () => {
  const { data } = await http.get(
    `${API_ENDPOINTS.FLASH_SALE_PRODUCTS}${strapiTaggedParams(
      "flash-sale"
    )}`
  );
  return {
    productFlashSellGridTwo: unwrapList(data, normalizeProduct) as Product[],
  };
};

const fetchAncientFlashSaleProducts = fetchFlashSaleProducts;

export const useFlashSaleProductsQuery = (options: QueryOptionsType) => {
  return useQuery<any, Error>({
    queryKey: ["flashSaleProducts", options],
    queryFn: fetchFlashSaleProducts,
  });
};

export { fetchAncientFlashSaleProducts };
