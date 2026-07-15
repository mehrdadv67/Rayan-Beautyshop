import { Product } from "@framework/types";
import { API_ENDPOINTS } from "@framework/utils/api-endpoints";
import http from "@framework/utils/http";
import { normalizeProduct, unwrapList } from "@framework/utils/normalize";
import { useQuery } from "@tanstack/react-query";

/**
 * Fetch a single product by slug. Strapi has no slug-based route, so we
 * filter the collection by slug (always returns at most one) and take [0].
 */
const POPULATE =
  "populate[0]=image&populate[1]=brand&populate[2]=categories&pagination[pageSize]=1";

export const fetchProduct = async (slug: string) => {
  const { data } = await http.get(
    `${API_ENDPOINTS.PRODUCT}?filters[slug][$eq]=${encodeURIComponent(
      slug
    )}&${POPULATE}`
  );
  const list = unwrapList(data, normalizeProduct);
  return list[0];
};

export const useProductQuery = (slug: string) => {
  return useQuery<Product, Error>({
    queryKey: ["product", slug],
    queryFn: () => fetchProduct(slug),
  });
};
