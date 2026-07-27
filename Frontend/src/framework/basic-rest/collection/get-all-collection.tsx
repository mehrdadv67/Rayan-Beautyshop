import { QueryOptionsType, Collection } from "@framework/types";
import http from "@framework/utils/http";
import {
  API_ENDPOINTS,
  strapiCategoryParams,
} from "@framework/utils/api-endpoints";
import { useQuery } from "@tanstack/react-query";

export const fetchCollections = async () => {
  const {
    data: { data },
  } = await http.get(`${API_ENDPOINTS.COLLECTIONS}${strapiCategoryParams()}`);
  return { collections: { data: data.data as Collection[] } };
};
export const useCollectionsQuery = (options: QueryOptionsType) => {
  return useQuery<{ collections: { data: Collection[] } }, Error>({
    queryKey: [API_ENDPOINTS.COLLECTIONS, options],
    queryFn: fetchCollections,
  });
};

export const fetchCollectionBySlug = async (slug: string) => {
  const { data } = await http.get(
    `${API_ENDPOINTS.COLLECTIONS}?filters[slug][$eq]=${encodeURIComponent(
      slug
    )}&populate[0]=coverImage&populate[1]=products&pagination[pageSize]=1`
  );
  const list = (data.data || []).map((item: any) => item);
  return list[0];
};

export const useCollectionBySlugQuery = (slug: string) => {
  return useQuery<any, Error>({
    queryKey: ["collectionBySlug", slug],
    queryFn: () => fetchCollectionBySlug(slug),
  });
};
