import { Product } from "@framework/types";
import {
  API_ENDPOINTS,
  strapiListParams,
} from "@framework/utils/api-endpoints";
import http from "@framework/utils/http";
import { normalizeProduct, unwrapList } from "@framework/utils/normalize";
import { useQuery } from "@tanstack/react-query";

export const fetchProductsByCollection = async (slug: string) => {
  const { data } = await http.get(
    `${API_ENDPOINTS.PRODUCTS}${strapiListParams()}&filters[collections][slug][$eq]=${encodeURIComponent(
      slug
    )}`
  );
  return unwrapList(data, normalizeProduct) as Product[];
};

export const fetchCollectionBySlug = async (slug: string) => {
  const { data } = await http.get(
    `${API_ENDPOINTS.COLLECTIONS}?filters[slug][$eq]=${encodeURIComponent(
      slug
    )}&populate[0]=coverImage&populate[1]=products&pagination[pageSize]=1`
  );
  const list = unwrapList(data, (item: any) => item);
  return list[0];
};

export const useProductsByCollectionQuery = (options: { collection: string }) => {
  return useQuery<Product[], Error>({
    queryKey: ["productsByCollection", options],
    queryFn: () => fetchProductsByCollection(options.collection),
  });
};

export const useCollectionBySlugQuery = (slug: string) => {
  return useQuery<any, Error>({
    queryKey: ["collectionBySlug", slug],
    queryFn: () => fetchCollectionBySlug(slug),
  });
};
