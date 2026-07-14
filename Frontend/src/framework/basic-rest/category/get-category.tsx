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

export const useCategoriesQuery = (options: QueryOptionsType) => {
  return useQuery<{ category: { data: Category[] } }, Error>({
    queryKey: [API_ENDPOINTS.CATEGORIES, options],
    queryFn: fetchCategory,
  });
};
