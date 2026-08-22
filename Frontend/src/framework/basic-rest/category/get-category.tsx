import { QueryOptionsType, Category } from "@framework/types";
import {
  API_ENDPOINTS,
  strapiCategoryParams,
} from "@framework/utils/api-endpoints";
import http from "@framework/utils/http";
import { normalizeCategory, unwrapList } from "@framework/utils/normalize";
import { useQuery } from "@tanstack/react-query";

export const fetchCategory = async () => {
  const { data } = await http.get(
    `${API_ENDPOINTS.CATEGORIES}${strapiCategoryParams()}`,
  );
  return {
    category: {
      data: unwrapList(data, normalizeCategory) as Category[],
    },
  };
};

export const fetchCategoryBySlug = async (slug: string) => {
  const { data } = await http.get(
    `${API_ENDPOINTS.CATEGORIES}?populate[0]=image&populate[1]=banner&filters[slug][$eq]=${encodeURIComponent(slug)}&pagination[pageSize]=1`,
  );
  const list = unwrapList(data, normalizeCategory) as Category[];
  return list[0];
};

export const useCategoriesQuery = (options: QueryOptionsType) => {
  return useQuery<{ category: { data: Category[] } }, Error>({
    queryKey: [API_ENDPOINTS.CATEGORIES, options],
    queryFn: fetchCategory,
  });
};

export const useCategoryBySlugQuery = (slug: string) => {
  return useQuery<Category, Error>({
    queryKey: [API_ENDPOINTS.CATEGORIES, "slug", slug],
    queryFn: () => fetchCategoryBySlug(slug),
    enabled: Boolean(slug),
  });
};
