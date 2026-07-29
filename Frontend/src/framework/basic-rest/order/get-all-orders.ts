import { QueryOptionsType, Order } from "@framework/types";
import http from "@framework/utils/http";
import { API_ENDPOINTS, strapiOrderParams } from "@framework/utils/api-endpoints";
import { useQuery } from "@tanstack/react-query";

export const fetchOrders = async () => {
  const { data } = await http.get(
    `${API_ENDPOINTS.ORDERS}${strapiOrderParams()}`
  );
  return { orders: { data: data.data as Order[] } };
};
export const useOrdersQuery = (options: QueryOptionsType) => {
  return useQuery<{ orders: { data: Order[] } }, Error>({
    queryKey: [API_ENDPOINTS.ORDERS, options],
    queryFn: fetchOrders
  });
};
