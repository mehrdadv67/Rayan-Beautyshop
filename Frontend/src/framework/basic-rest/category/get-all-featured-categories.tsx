import { QueryOptionsType, Category } from "@framework/types";
import {
  API_ENDPOINTS,
  strapiCategoryParams,
} from "@framework/utils/api-endpoints";
import http from "@framework/utils/http";
import { normalizeCategory, unwrapList } from "@framework/utils/normalize";
import { useQuery } from "@tanstack/react-query";

export const fetchFeaturedCategories = async () => {
  const { data } = await http.get(
    `${API_ENDPOINTS.FEATURED_CATEGORIES}${strapiCategoryParams()}`,
  );
  return unwrapList(data, normalizeCategory) as Category[];
};

export const useFeaturedCategoriesQuery = (options: QueryOptionsType) => {
  return useQuery<Category[], Error>({
    queryKey: [API_ENDPOINTS.FEATURED_CATEGORIES, options],
    queryFn: fetchFeaturedCategories,
  });
};
