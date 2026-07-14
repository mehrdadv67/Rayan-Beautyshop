import { CategoriesQueryOptionsType, Category } from "@framework/types";
import {
  API_ENDPOINTS,
  strapiCategoryParams,
} from "@framework/utils/api-endpoints";
import http from "@framework/utils/http";
import { normalizeCategory, unwrapList } from "@framework/utils/normalize";
import { useQuery } from "@tanstack/react-query";

export const fetchCategories = async () => {
  const { data } = await http.get(
    `${API_ENDPOINTS.CATEGORIES_2}${strapiCategoryParams()}`,
  );
  return {
    categories: {
      data: unwrapList(data, normalizeCategory) as Category[],
    },
  };
};

export const useCategoriesQuery = (options: CategoriesQueryOptionsType) => {
  return useQuery<{ categories: { data: Category[] } }, Error>({
    queryKey: [API_ENDPOINTS.CATEGORIES_2, options],
    queryFn: fetchCategories,
  });
};
