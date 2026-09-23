import { QueryOptionsType, Product } from "@framework/types";
import { API_ENDPOINTS, strapiListParams } from "@framework/utils/api-endpoints";
import http from "@framework/utils/http";
import { normalizeProduct, unwrapList } from "@framework/utils/normalize";
import { useInfiniteQuery } from "@tanstack/react-query";

type PaginatedProduct = {
  data: Product[];
  paginatorInfo: {
    nextPageUrl: string | undefined;
    total?: number;
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

  if (query.collection) {
    parts.push(
      `filters[collections][slug][$eq]=${encodeURIComponent(String(query.collection))}`
    );
  }

  if (query.text) {
    parts.push(
      `filters[name][$containsi]=${encodeURIComponent(String(query.text))}`
    );
  }

  // Remove price sort from server-side because Strapi `display_price`
  // may not reflect the actual rendered price (variant salePrice/price
  // fallback). We'll sort client-side after fetch.
  const sortBy = query.sort_by;
  if (sortBy) {
    switch (sortBy) {
      case 'newest':
        parts.push('sort[0]=createdAt:desc');
        break;
      case 'popularity':
        parts.push('sort[0]=createdAt:desc');
        break;
    }
  }

  return parts.length > 0 ? `&${parts.join("&")}` : "";
};

const fetchProducts = async (query: Record<string, any> = {}, page: number = 1) => {
  const limit = query.limit || 100;
  const { data } = await http.get(
    `${API_ENDPOINTS.PRODUCTS}${strapiListParams(limit, page)}${buildFilterParams(query)}`
  );
  const products = unwrapList(data, normalizeProduct);

  let sorted = products;
  if (query.sort_by === 'low-high') {
    sorted = [...products].sort((a, b) => {
      const defaultVariantA = a?.variants?.find((v: any) => v.isDefault) ?? a?.variants?.[0];
      const defaultVariantB = b?.variants?.find((v: any) => v.isDefault) ?? b?.variants?.[0];
      const priceA =
        a.display_price ??
        defaultVariantA?.salePrice ??
        defaultVariantA?.price ??
        a.price ??
        0;
      const priceB =
        b.display_price ??
        defaultVariantB?.salePrice ??
        defaultVariantB?.price ??
        b.price ??
        0;
      return Number(priceA) || 0 - (Number(priceB) || 0);
    });
  } else if (query.sort_by === 'high-low') {
    sorted = [...products].sort((a, b) => {
      const defaultVariantA = a?.variants?.find((v: any) => v.isDefault) ?? a?.variants?.[0];
      const defaultVariantB = b?.variants?.find((v: any) => v.isDefault) ?? b?.variants?.[0];
      const priceA =
        a.display_price ??
        defaultVariantA?.salePrice ??
        defaultVariantA?.price ??
        a.price ??
        0;
      const priceB =
        b.display_price ??
        defaultVariantB?.salePrice ??
        defaultVariantB?.price ??
        b.price ??
        0;
      return (Number(priceB) || 0) - (Number(priceA) || 0);
    });
  } else if (!query.sort_by) {
    sorted = [...products].sort((a, b) => {
      const dateA = new Date(String(a.createdAt || "")).getTime();
      const dateB = new Date(String(b.createdAt || "")).getTime();
      return dateB - dateA;
    });
  }

  const total =
    data?.meta?.pagination?.total ??
    products.length;

  return {
    data: sorted,
    paginatorInfo: {
      nextPageUrl: sorted.length >= limit ? String(page + 1) : undefined,
      total,
    },
  };
};

const useProductsQuery = (options: QueryOptionsType) => {
  return useInfiniteQuery<PaginatedProduct, Error>({
    queryKey: ["products", options],
    queryFn: ({ pageParam = 1 }) => fetchProducts(options as Record<string, any>, pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.paginatorInfo.nextPageUrl,
  });
};

export { useProductsQuery, fetchProducts };
