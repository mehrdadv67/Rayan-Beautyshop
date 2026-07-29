import { Order } from "@framework/types";
import http from "@framework/utils/http";
import { API_ENDPOINTS } from "@framework/utils/api-endpoints";
import { useQuery } from "@tanstack/react-query";

export const fetchOrder = async (id: string) => {
  const { data } = await http.get(
    `${API_ENDPOINTS.ORDER}/${encodeURIComponent(id)}?populate[0]=order_items&populate[1]=order_items.order_item&populate[2]=order`
  );
  return data.data as Order;
};
export const useOrderQuery = (id: string) => {
  return useQuery<Order, Error>({
    queryKey: [API_ENDPOINTS.ORDER, id],
    queryFn: () => fetchOrder(id)
  });
};
