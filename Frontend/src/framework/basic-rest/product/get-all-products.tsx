import { QueryOptionsType, Product } from "@framework/types";
import { API_ENDPOINTS, strapiListParams } from "@framework/utils/api-endpoints";
import http from "@framework/utils/http";
import { normalizeProduct, unwrapList } from "@framework/utils/normalize";
import shuffle from "lodash/shuffle";
import { useInfiniteQuery } from "@tanstack/react-query";

type PaginatedProduct = {
  data: Product[];
  paginatorInfo: {
    nextPageUrl: string | undefined;
  };
};

/**
 * Translate URL filter params into Strapi v5 filters:
 *   category=<slug,slug>  → category.slug $in
 *   brand=<slug,slug>     → brand.slug $in
 *   attr=<valueId,...>    → variant option attribute_value id $in
 *   price=<lo-hi,...>     → $or of (price|salePrice between lo and hi)
 *   text=<q>              → name $containsi
 */
const buildFilterParams = (query: Record<string, any>): string => {
  const parts: string[] = [];

  const categories: string[] = query.category
    ? String(query.category).split(",")
    : [];
  categories.forEach((slug, i) =>
    parts.push(`filters[category][slug][$in][${i}]=${encodeURIComponent(slug)}`)
  );

  const brands: string[] = query.brand ? String(query.brand).split(",") : [];
  brands.forEach((slug, i) =>
    parts.push(`filters[brand][slug][$in][${i}]=${encodeURIComponent(slug)}`)
  );

  const attrValues: string[] = query.attr ? String(query.attr).split(",") : [];
  attrValues.forEach((id, i) =>
    parts.push(
      `filters[variants][options][attribute_value][id][$in][${i}]=${id}`
    )
  );

  const ranges: string[] = query.price ? String(query.price).split(",") : [];
  let orIndex = 0;
  ranges.forEach((range) => {
    const [lo, hi] = range.split("-");
    // (variants.price between lo..hi) OR (variants.salePrice between lo..hi)
    parts.push(
      `filters[$or][${orIndex}][$and][0][variants][price][$gte]=${lo}`,
      `filters[$or][${orIndex}][$and][1][variants][price][$lte]=${hi}`,
      `filters[$or][${orIndex + 1}][$and][0][variants][salePrice][$gte]=${lo}`,
      `filters[$or][${orIndex + 1}][$and][1][variants][salePrice][$lte]=${hi}`
    );
    orIndex += 2;
  });

  if (query.text) {
    parts.push(
      `filters[name][$containsi]=${encodeURIComponent(String(query.text))}`
    );
  }

  // Sort parameter mapping to Strapi v5 sort syntax
  const sortBy = query.sort_by;
  if (sortBy) {
    switch (sortBy) {
      case 'newest':
        parts.push('sort[0]=createdAt:desc');
        break;
      case 'popularity':
        parts.push('sort[0]=createdAt:desc');
        break;
      case 'low-high':
        parts.push('sort[0]=display_price:asc');
        break;
      case 'high-low':
        parts.push('sort[0]=display_price:desc');
        break;
    }
  }

  return parts.length > 0 ? `&${parts.join("&")}` : "";
};

const fetchProducts = async (query: Record<string, any> = {}) => {
  const { data } = await http.get(
    `${API_ENDPOINTS.PRODUCTS}${strapiListParams()}${buildFilterParams(query)}`
  );
  const products = unwrapList(data, normalizeProduct);
  // Only shuffle when no explicit sort is requested
  const sorted = query.sort_by ? products : shuffle(products);
  return {
    data: sorted,
    paginatorInfo: {
      // Single-page list: there is no next page.
      nextPageUrl: undefined,
    },
  };
};

const useProductsQuery = (options: QueryOptionsType) => {
  return useInfiniteQuery<PaginatedProduct, Error>({
    queryKey: ["products", options],
    queryFn: () => fetchProducts(options as Record<string, any>),
    initialPageParam: 1,
    getNextPageParam: () => undefined,
  });
};

export { useProductsQuery, fetchProducts };
